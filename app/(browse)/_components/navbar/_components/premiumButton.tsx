'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { SubscribeButton } from "@/components/subscribeButton"
import { CryptoPaymentDialog } from "./cryptoPaymentDialog"
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StripeData {
  customerId: string;
  subscriptionId: string;
  priceId: string;
}

export const PremiumButton = () => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cryptoChargeId, setCryptoChargeId] = useState('');
    const router = useRouter();

    const handleSubscribeClick = () => {
        setIsPopoverOpen(false);
        setIsDialogOpen(true);
    };

    const handleCryptoClick = async () => {
        if (cryptoChargeId) return;
        try {
            const response = await fetch('/api/create-crypto-charge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: 9.99 }), // Set your subscription amount
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
    };

    const handleSubscriptionComplete = async (stripeData: StripeData) => {
        setIsDialogOpen(false);
        try {
            const response = await fetch('/api/update-subscription-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscribed: true,
                    stripeCustomerId: stripeData.customerId,
                    stripeSubscriptionId: stripeData.subscriptionId,
                    stripePriceId: stripeData.priceId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update subscription status');
            }
            toast.success('Subscription successful!');
            router.refresh();
        } catch (error) {
            console.error('Error updating subscription status:', error);
            toast.error('Failed to update subscription status. Please try again.');
        }
    };

    return (
        <>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex h-7 px-1.5 "
                    >
                       <Image src="/bolt.svg" width={18} height={18} alt="Premium"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="mr-24 inline-block items-center border-none space-y-2 bg-[#25252C] backdrop-blur-custom backdrop-filter backdrop-blur-lg z-[2000]">
                <Image src="/greeny.svg" alt="room" width={300} height={100} className='rounded-lg'/>
                <p className=''>Premium gives you access to exclusive features, exclusive content, and ad-free streaming.</p>
                <div className='flex items-end mr-auto'>
                    <Button variant="primary" className="focus-visible:ring-none ml-auto  ring-none h-7 px-2" onClick={handleSubscribeClick}>
                        Subscribe
                    </Button>
                    </div>
                </PopoverContent>
            </Popover>
            <Dialog  open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className='flex m-auto items-center'>
                    <DialogTitle>Upgrade to Premium</DialogTitle>
                    </div>
                    <Tabs defaultValue="card" className="w-full" onValueChange={(value) => {
                        if (value === 'crypto') handleCryptoClick();
                    }}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger  value="card">Card</TabsTrigger>
                            <TabsTrigger  value="crypto">Crypto</TabsTrigger>
                        </TabsList>
                        <TabsContent value="card">
                            <SubscribeButton 
                                priceId="price_1PgpwRKDe4EvwXQZHsQWGUyO"
                                onSubscriptionComplete={handleSubscriptionComplete}
                            />
                        </TabsContent>
                        <TabsContent className="flex m-auto items-center" value="crypto">
                            {cryptoChargeId ? (
                                <CryptoPaymentDialog chargeId={cryptoChargeId} />
                            ) : (
                                <div className='flex p-6 m-auto items-center'>
                                <Image src="/load.svg" alt="loading" className='animate-spin' width={30} height={30}/>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    )
}