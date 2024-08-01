'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button"
import {
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CryptoPaymentDialog } from '@/app/(browse)/_components/navbar/_components/cryptoPaymentDialog';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Tier {
  name: string;
  price: number;
  rank: number;
}

interface ChannelSubscribeButtonProps {
  channelId: string;
  tiers: Tier[];
  currentSubscription: {
    tierName: string;
    price: number;
  } | null;
  selectedTier?: Tier;
  onSubscribeClick?: (tier: Tier) => void;
  onSubscriptionUpdate?: (newSubscription: { tierName: string; price: number }) => void;
  onDialogClose?: () => void;
}

function CheckoutForm({ tierName, amount, channelId, onSubscriptionComplete, isUpgrade }: { tierName: string, amount: number, channelId: string, onSubscriptionComplete: (data: any) => void, isUpgrade: boolean }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/channel-subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, tierName, amount, paymentType: 'stripe', isUpgrade }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const { clientSecret, subscriptionId } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      onSubscriptionComplete({ subscriptionId, tierName, amount });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Subscription failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" disabled={isLoading} className="mt-4">
        {isLoading ? 'Processing...' : `${isUpgrade ? 'Upgrade to' : 'Subscribe to'} ${tierName} ($${amount})`}
      </Button>
    </form>
  );
}

export const ChannelSubscribeButton = React.memo(({ 
    channelId, 
    tiers, 
    currentSubscription, 
    selectedTier,
    onSubscribeClick,
    onSubscriptionUpdate,
    onDialogClose
}: ChannelSubscribeButtonProps) => {
    const [cryptoChargeId, setCryptoChargeId] = useState('');
    const router = useRouter();

    const sortedTiers = useMemo(() => [...tiers].sort((a, b) => a.rank - b.rank), [tiers]);

    const availableTiers = useMemo(() => {
        if (!currentSubscription) return sortedTiers;
        const currentTier = sortedTiers.find(tier => tier.name === currentSubscription.tierName);
        if (!currentTier) return sortedTiers;
        return sortedTiers.filter(tier => tier.rank > currentTier.rank);
    }, [currentSubscription, sortedTiers]);

    const handleCryptoClick = useCallback(async () => {
        if (cryptoChargeId) return;
        try {
            const response = await fetch('/api/channel-subscriptions/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    channelId, 
                    tierName: selectedTier?.name,
                    amount: selectedTier?.price,
                    paymentType: 'crypto',
                    isUpgrade: !!currentSubscription,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create crypto charge');
            }
            const data = await response.json();
            setCryptoChargeId(data.chargeId);
        } catch (error) {
            console.error('Error creating crypto charge:', error);
            toast.error('Failed to create crypto payment. Please try again.');
        }
    }, [channelId, selectedTier, currentSubscription, cryptoChargeId]);

    const handleSubscriptionComplete = useCallback(async (data: { subscriptionId: string, tierName: string, amount: number }) => {
        if (onSubscriptionUpdate) {
            onSubscriptionUpdate({ tierName: data.tierName, price: data.amount });
        }
        if (onDialogClose) {
            onDialogClose();
        }
        toast.success('Subscription successful!');
        router.refresh();
    }, [router, onSubscriptionUpdate, onDialogClose]);

    const isUpgrade = !!currentSubscription;

    if (availableTiers.length === 0 && currentSubscription) {
        return <p>You are subscribed to the highest tier available.</p>;
    }

    if (selectedTier) {
        return (
            <>
                <DialogHeader>
                    <DialogTitle>
                        {isUpgrade
                            ? `Upgrade to ${selectedTier.name} ($${selectedTier.price})`
                            : `Subscribe to ${selectedTier.name} ($${selectedTier.price})`}
                    </DialogTitle>
                    <DialogDescription>
                        Choose your payment method below to {isUpgrade ? 'upgrade your subscription' : 'subscribe'}.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="card" className="w-full" onValueChange={(value) => {
                    if (value === 'crypto') handleCryptoClick();
                }}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="card">Card</TabsTrigger>
                        <TabsTrigger value="crypto">Crypto</TabsTrigger>
                    </TabsList>
                    <TabsContent value="card">
                        <Elements stripe={stripePromise}>
                            <CheckoutForm 
                                tierName={selectedTier.name}
                                amount={selectedTier.price}
                                channelId={channelId}
                                onSubscriptionComplete={handleSubscriptionComplete}
                                isUpgrade={isUpgrade}
                            />
                        </Elements>
                    </TabsContent>
                    <TabsContent className="flex m-auto items-center" value="crypto">
                        {cryptoChargeId ? (
                            <CryptoPaymentDialog chargeId={cryptoChargeId} amount={selectedTier.price} />
                        ) : (
                            <div className='flex p-6 m-auto items-center'>
                                <Image src="/load.svg" alt="loading" className='animate-spin' width={30} height={30}/>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </>
        );
    }

    return (
        <>
            {availableTiers.map((tier) => (
                <Button
                    key={tier.name}
                    variant="primary"
                    onClick={() => onSubscribeClick && onSubscribeClick(tier)}
                    className="mr-2"
                >
                    {isUpgrade ? `Upgrade to ${tier.name} ($${tier.price})` : `Subscribe to ${tier.name} ($${tier.price})`}
                </Button>
            ))}
        </>
    );
});