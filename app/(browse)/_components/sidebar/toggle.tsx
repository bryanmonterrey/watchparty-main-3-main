"use client";


import { Button } from '@/components/ui/button';
import { Hint } from '@/components/hint';
import { useSidebar } from '@/store/use-sidebar';
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const Toggle = () => {
    const {
        collapsed,
        onExpand,
        onCollapse,

    } = useSidebar((state) => state);

    const label = collapsed ? "Expand" : "Collapse";

  return (
    <>
    { collapsed && (
        <div 
        className='hidden lg:flex w-full items-center justify-center pt-2 mb-1'>
            <Hint label={label} side="right" asChild>
            <Button 
            onClick={onExpand}
            variant="ghost" 
            className="h-auto rounded-sm p-2">

                <Image src="/arrowleft.svg" alt="expand" width={14} height={14} className='text-lightpurp hover:fill-[#FF2D49] font-bold h-3.5 w-3.5'/>
            </Button>
            </Hint>

        </div>
    )}
     {!collapsed && (
        <div className='cursor-pointer pb-2 pr-1.5 pt-2 pl-5 mb-2 flex items-center z-51 absolute'>
            
            <Hint label={label} side='right' asChild>
            <Button 
            onClick={onCollapse}
            className='cursor-pointer rounded-sm h-auto p-2 ml-auto' 
            variant="ghost">
                <Image src="/arrowrightt.svg" alt="collapse" width={14} height={14} className='cursor-pointer hover:text-[#FF2D49] text-lightpurp font-bold h-3.5 w-3.5' />
            </Button>
            </Hint>

        </div>
     )}
    </> 
  )
}

export default Toggle

export const ToggleSkeleton = () => {
    return (
        <div className='p-3 pl-6 mb-2 hidden lg:flex items-center justify-between w-full'>
            <Skeleton className='h-6 w-[100px]' />
            <Skeleton className='h-6 w-6'/>
        </div>
    )
}