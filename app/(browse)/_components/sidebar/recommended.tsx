"use client";

import { useSidebar } from '@/store/use-sidebar';
import { User } from '@prisma/client'
import React from 'react'
import { UserItem, UserItemSkeleton } from './useritem';
import { Crown } from 'lucide-react';

interface RecommendedProps {
    data: (User & {
        stream: { isLive: boolean } | null;
    })[];
};

const Recommended = ({
    data,
}: RecommendedProps) => {
    const { collapsed } = useSidebar((state) => state);


    const showLabel = !collapsed && data.length > 0;

  return (
    <div >
        {showLabel && (
            <div className="flex w-full justify-start mr-auto items-start pl-3 pt-[13px] mb-3">
                <p className="w-full flex justify-start items-start text-xs font-semibold  text-white">
                    TRENDING
                </p>
            </div> 
        )}
        {collapsed && (
                <div className="flex justify-center items-center mb-2">
                    <Crown className="h-4 w-4 text-purpgray/60" strokeWidth={3} />
                </div>
            )}
        <div className='flex items-center justify-center w-full'>
        <ul className="px-1">
            {data.map((user) => (
                <UserItem 
                 key={user.id}
                 username={user.username}
                 imageUrl={user.imageUrl} 
                 isLive={user.stream?.isLive}
                />
            ))}
        </ul>
        </div>
        </div>
  )
}

export default Recommended

export const RecommendedSkeleton = () => {
    return (
        <ul className='space-y-0 px-2'>
            {[...Array(11)].map((_, i) => (
                <UserItemSkeleton key={i} />
            ))}

        </ul>
    ) 
}