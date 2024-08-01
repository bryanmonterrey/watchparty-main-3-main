// app/api/channel-subscriptions/create/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSelf } from '@/lib/auth-service';
import Stripe from 'stripe';
import { createCharge } from '@/lib/coinbase';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

async function getOrCreateStripeCustomer(userId: string, email: string) {
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const stripeCustomer = await stripe.customers.create({
    email,
    metadata: { userId }
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: stripeCustomer.id }
  });

  return stripeCustomer.id;
}

async function getOrCreateStripeProduct(channelId: string, tierName: string) {
  let products = await stripe.products.list({
    active: true,
  });

  let product = products.data.find(p => 
    p.metadata.channelId === channelId && p.metadata.tierName === tierName
  );

  if (product) {
    return product.id;
  }

  const newProduct = await stripe.products.create({
    name: `${tierName} Subscription for Channel ${channelId}`,
    metadata: { channelId, tierName }
  });

  return newProduct.id;
}

export async function POST(req: Request) {
  try {
    const self = await getSelf();
    if (!self) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { channelId, tierName, amount, paymentType } = body;

    const existingSubscription = await prisma.channelSubscription.findUnique({
      where: {
        subscriberId_channelId: {
          subscriberId: self.id,
          channelId: channelId,
        },
      },
    });

    const isUpgrade = !!existingSubscription;

    if (paymentType === 'stripe') {
      const stripeCustomerId = await getOrCreateStripeCustomer(self.id, self.email);
      const productId = await getOrCreateStripeProduct(channelId, tierName);

      // Create or get Price
      let prices = await stripe.prices.list({
        product: productId,
        active: true,
        type: 'recurring',
      });

      let price: Stripe.Price;

      if (prices.data.length === 0) {
        price = await stripe.prices.create({
          product: productId,
          unit_amount: Math.round(amount * 100),
          currency: 'usd',
          recurring: { interval: 'month' },
        });
      } else {
        price = prices.data[0];
      }

      // Create the subscription
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: price.id }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: { 
          channelId, 
          tierName, 
          userId: self.id, 
          isUpgrade: isUpgrade ? 'true' : 'false' 
        },
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      await prisma.channelSubscription.upsert({
        where: {
          subscriberId_channelId: {
            subscriberId: self.id,
            channelId: channelId,
          },
        },
        update: {
          status: 'incomplete',
          tierName,
          stripeSubscriptionId: subscription.id,
          stripePriceId: price.id,
          cryptoPaymentId: null,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        create: {
          subscriberId: self.id,
          channelId,
          status: 'incomplete',
          tierName,
          stripeSubscriptionId: subscription.id,
          stripePriceId: price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });

      return NextResponse.json({ 
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret 
      });
    } else if (paymentType === 'crypto') {
      // The crypto payment logic remains the same
      const charge = await createCharge(
        amount,
        `${tierName} Channel Subscription for ${channelId}`,
        `${isUpgrade ? 'Upgrade' : 'Subscription'} to channel ${channelId}`,
        { channelId, tierName, userId: self.id, isUpgrade: isUpgrade ? 'true' : 'false' }
      );

      await prisma.channelSubscription.upsert({
        where: {
          subscriberId_channelId: {
            subscriberId: self.id,
            channelId: channelId,
          },
        },
        update: {
          status: 'pending',
          tierName,
          cryptoPaymentId: charge.id,
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        create: {
          subscriberId: self.id,
          channelId,
          status: 'pending',
          tierName,
          cryptoPaymentId: charge.id,
          stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return NextResponse.json({ chargeId: charge.id });
    }

    return new NextResponse("Invalid payment type", { status: 400 });
  } catch (error) {
    console.error('Error creating channel subscription:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}