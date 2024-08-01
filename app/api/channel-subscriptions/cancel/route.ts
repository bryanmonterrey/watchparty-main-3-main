// app/api/channel-subscriptions/cancel/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSelf } from '@/lib/auth-service';
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  try {
    const { subscriptionId } = await req.json();
    const self = await getSelf();

    if (!self) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscription = await db.channelSubscription.findFirst({
      where: {
        id: subscriptionId,
        subscriberId: self.id,
      },
    });

    if (!subscription) {
      return new NextResponse("Subscription not found", { status: 404 });
    }

    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    }

    await db.channelSubscription.update({
      where: { id: subscriptionId },
      data: { status: 'canceled' },
    });

    return NextResponse.json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    console.error('[CANCEL_CHANNEL_SUBSCRIPTION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}