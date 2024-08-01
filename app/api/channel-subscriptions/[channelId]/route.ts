// app/api/channel-subscriptions/[channelId]/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSelf } from '@/lib/auth-service';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const self = await getSelf();
    if (!self) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const channelId = params.channelId;

    // Fetch the current user's subscription for the given channel
    const subscription = await prisma.channelSubscription.findUnique({
      where: {
        subscriberId_channelId: {
          subscriberId: self.id,
          channelId: channelId,
        },
      },
      select: {
        tierName: true,
        status: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    if (!subscription) {
      return NextResponse.json({ subscription: null });
    }

    // Fetch the price of the subscribed tier
    const tier = await prisma.channelProduct.findFirst({
      where: {
        userId: channelId,
        name: subscription.tierName,
      },
      select: {
        price: true,
      },
    });

    return NextResponse.json({
      subscription: {
        ...subscription,
        price: tier?.price || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching channel subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch channel subscription' }, { status: 500 });
  }
}