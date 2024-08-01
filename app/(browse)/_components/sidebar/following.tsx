"use client";

import { useSidebar } from "@/store/use-sidebar";
import { Follow, User } from "@prisma/client";
import { UserItem, UserItemSkeleton } from "./useritem";
import { Heart } from 'lucide-react';

interface FollowingProps {
    data: (Follow & { 
        following: User & {
        stream: { isLive: boolean } | null;
    },
 })[];
}

export const Following = ({
    data,
}: FollowingProps) => {
    const { collapsed } = useSidebar((state) => state);

    if (!data.length) {
        return null;
    }

    return (
        <div>
            {!collapsed && (
                <div className="pl-3 pt-[13px] mb-3">
                    <p className="text-xs font-semibold text-clipwhite">
                        FOLLOWING
                    </p>
                </div>
            )}
            {collapsed && (
                <div className="flex justify-center items-center pt-[2px] mb-2">
                    <Heart className="h-4 w-4 text-[#585A70]" strokeWidth={3}/>
                </div>
            )}
            <div className='flex items-center justify-center w-full'>
            <ul className=" px-1">
                {data.map((follow) => (
                    <UserItem 
                    key={follow.following.id}
                    username={follow.following.username}
                    imageUrl={follow.following.imageUrl}
                    isLive={follow.following.stream?.isLive}
                    />
                ))}
            </ul>
            </div>
        </div>
    );
};

export const FollowingSkeleton = () => {
    return (
        <ul className="px-2 pt-2 lg:pt-0">
            {[...Array(3)].map((_, i) => (
                <UserItemSkeleton key={i} />
            ))}
        </ul>
    );
};