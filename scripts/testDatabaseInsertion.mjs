import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testInsert() {
  try {
    const result = await prisma.channelSubscription.create({
      data: {
        subscriberId: 'test-user-id',
        channelId: 'test-channel-id',
        status: 'active',
        tierName: 'Basic',
        stripeSubscriptionId: 'test-stripe-id',
        stripeCurrentPeriodEnd: new Date(),
      },
    });
    console.log('Test insert result:', result);
  } catch (error) {
    console.error('Error in test insert:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testInsert();