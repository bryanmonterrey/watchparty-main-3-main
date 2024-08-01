"use client";

import { useState, useTransition, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { onFollow, onUnfollow } from "@/actions/follow";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { ChannelSubscribeButton } from "./_components/channelSubButton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ActionProps {
    hostIdentity: string;
    isFollowing: boolean;
    isHost: boolean;
}

interface Tier {
    name: string;
    price: number;
    rank: number;
}

export const Actions = ({
    hostIdentity,
    isFollowing,
    isHost,
}: ActionProps) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { userId } = useAuth();
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [currentSubscription, setCurrentSubscription] = useState<{ tierName: string; price: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [tiersResponse, subscriptionResponse] = await Promise.all([
                    fetch(`/api/channel-tiers/${hostIdentity}`),
                    fetch(`/api/channel-subscriptions/${hostIdentity}`)
                ]);

                if (!isMounted) return;

                if (tiersResponse.ok) {
                    const tiersData = await tiersResponse.json();
                    setTiers(tiersData.tiers.map((tier: any, index: number) => ({
                        ...tier,
                        rank: index + 1
                    })));
                } else {
                    console.error('Failed to fetch tiers');
                }

                if (subscriptionResponse.ok) {
                    const subscriptionData = await subscriptionResponse.json();
                    setCurrentSubscription(subscriptionData.subscription);
                } else if (subscriptionResponse.status !== 404) {
                    console.error('Failed to fetch current subscription');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [hostIdentity]);

    const handleFollow = useCallback(() => {
        startTransition(() => {
            onFollow(hostIdentity)
            .then((data) => toast.success(`You are now following ${data.following.username}`))
            .catch(() => toast.error("Something went wrong"))
        });
    }, [hostIdentity]);

    const handleUnfollow = useCallback(() => {
        startTransition(() => {
            onUnfollow(hostIdentity)
            .then((data) => toast.success(`Unfollowed ${data.following.username}`))
            .catch(() => toast.error("Something went wrong"))
        });
    }, [hostIdentity]);
    
    const toggleFollow = useCallback(() => {
        if (!userId) {
            return router.push("/sign-in")
        }

        if (isHost) return;

        if (isFollowing) {
            handleUnfollow();
        } else {
            handleFollow();
        }
    }, [userId, isHost, isFollowing, handleUnfollow, handleFollow, router]);

    const handleClosePopover = useCallback(() => {
        setIsPopoverOpen(false);
    }, []);

    const handleDialogChange = useCallback((open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setSelectedTier(null);
        }
    }, []);

    const handleSubscriptionUpdate = useCallback((newSubscription: { tierName: string; price: number }) => {
        setCurrentSubscription(newSubscription);
        setIsDialogOpen(false);
        setSelectedTier(null);
    }, []);

    const handleSubscribeClick = useCallback((tier: Tier) => {
        setSelectedTier(tier);
        setIsDialogOpen(true);
        setIsPopoverOpen(false);
    }, []);

    return (
        <div className="space-x-3 inline-flex">
            <div>
                <Button
                disabled={isPending || isHost}
                onClick={toggleFollow}
                variant="primary"
                size="sm"
                className="lg:auto px-1 "
                >
                    <Image src="/broken.svg" width={20} height={20} alt="heart" className={cn(
                        "h-5 w-5",
                        isFollowing ? "fill-white" : "hidden mx-3"
                    )}/>
                    {isFollowing ? "" : "Follow"}
                </Button>
            </div>
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
                <PopoverContent side="top" className="mr-24 inline-block items-center border-none space-y-2 bg-[#25252C] backdrop-blur-custom backdrop-filter backdrop-blur-lg z-[2000]">
                    <Image src="/greeny.svg" alt="room" width={300} height={100} className='rounded-lg'/>
                    <p className=''>Premium gives you access to exclusive features, exclusive content, and ad-free streaming.</p>
                    <div className='flex items-end mr-auto'>
                        {isLoading ? (
                            <Skeleton className="h-10 w-32" />
                        ) : (
                            <ChannelSubscribeButton 
                                channelId={hostIdentity} 
                                tiers={tiers} 
                                currentSubscription={currentSubscription}
                                onSubscribeClick={handleSubscribeClick}
                            />
                        )}
                    </div>
                </PopoverContent>
            </Popover>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
                <DialogContent>
                    {selectedTier && (
                        <ChannelSubscribeButton 
                            channelId={hostIdentity}
                            tiers={[selectedTier]}
                            currentSubscription={currentSubscription}
                            selectedTier={selectedTier}
                            onSubscriptionUpdate={handleSubscriptionUpdate}
                            onDialogClose={() => setIsDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
};

export const ActionsSkeleton = () => {
    return (
        <Skeleton className="h-10 w-full lg:w-24"/>
    );
};