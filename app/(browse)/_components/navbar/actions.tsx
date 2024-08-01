import React from 'react'
import { currentUser } from '@clerk/nextjs/server'; 
import { SignInButton, UserButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clapperboard, Crown } from 'lucide-react';
import { getSubscriptionStatus } from '@/lib/auth-service';
import { PremiumButton } from './_components/premiumButton';

const Actions = async () => {
    const user = await currentUser();
    const subscriptionStatus = user ? await getSubscriptionStatus() : null;

    return (
        <div className='flex items-center justify-end gap-x-2 ml-4 lg:ml-0'>
            {!user && (
                <>
                    <SignInButton>
                        <Button size="sm" className="px-2 h-7 hover:bg-[#009355]" variant="primary">
                            Log in
                        </Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button size="default" className="hover:bg-transparent bg-[#333337] px-2 h-7 hover:text-lightpurp" variant="ghost">
                            Sign up
                        </Button>
                    </SignUpButton>
                </>
            )}
            
            {!!user && (
                <>
                    {subscriptionStatus === null ? (
                        <p>Loading subscription status...</p>
                    ) : subscriptionStatus.isSubscribed ? (
                        <Button
                            size="sm"
                            variant="ghost"
                            className='text-muted-foreground hover:text-primary hover:text-[#00ED89] px-2 h-7 active:scale-90'
                        >
                            <Crown className='h-5 w-5 mr-2' />
                            Premium
                        </Button>
                    ) : (
                        <PremiumButton />
                    )}
                    <div className='flex hover:text-[#00ED89] items-center gap-x-4 mr-2'>
                        <Button
                            size="sm"
                            variant="ghost"
                            className='text-muted-foreground h-7 hover:text-primary hover:text-[#00ED89] px-1.5 active:scale-90'
                            asChild
                        >
                            <Link href={`/u/${user.username}`} >
                                <Clapperboard className='text-litepurp h-[20px] w-[20px] active:scale-90' strokeWidth={3} />
                            </Link>
                        </Button>
                        <UserButton />
                    </div>
                </>
            )}
        </div>
    )
}

export default Actions