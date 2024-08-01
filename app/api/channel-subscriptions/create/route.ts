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

async function cancelStripeSubscription(subscriptionId: string) {
  if (subscriptionId.startsWith('pi_')) {
    await stripe.paymentIntents.cancel(subscriptionId);
  }
}

export async function POST(req: Request) {
  try {
    const self = await getSelf();
    if (!self) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { channelId, tierName, amount, paymentType, isUpgrade } = body;

    // Check if user already has a subscription
    const existingSubscription = await prisma.channelSubscription.findUnique({
      where: {
        subscriberId_channelId: {
          subscriberId: self.id,
          channelId: channelId,
        },
      },
    });

    if (existingSubscription && !isUpgrade) {
      return new NextResponse("Already subscribed", { status: 400 });
    }

    if (isUpgrade && existingSubscription && existingSubscription.stripeSubscriptionId) {
      // Only cancel if it's a Stripe subscription
      await cancelStripeSubscription(existingSubscription.stripeSubscriptionId);
    }

    if (paymentType === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        metadata: { channelId, tierName, userId: self.id, isUpgrade: isUpgrade ? 'true' : 'false' },
      });

      await prisma.channelSubscription.upsert({
        where: {
          subscriberId_channelId: {
            subscriberId: self.id,
            channelId: channelId,
          },
        },
        update: {
          status: 'pending_upgrade',
          tierName,
          stripeSubscriptionId: paymentIntent.id,
          cryptoPaymentId: null,
          stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        create: {
          subscriberId: self.id,
          channelId,
          status: 'pending',
          tierName,
          stripeSubscriptionId: paymentIntent.id,
          stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } else if (paymentType === 'crypto') {
      const charge = await createCharge(
        amount,
        `${tierName} Channel Subscription`,
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