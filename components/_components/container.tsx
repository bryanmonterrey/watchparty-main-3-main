"use client";

import { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { useChatSidebar } from '@/store/use-chat-sidebar';
import React from 'react'



interface ContainerProps {
    children: React.ReactNode;
};

const Container = ({
  children,
}: ContainerProps) => {
    const matches = useMediaQuery("(max-width: 1024px)");
    const {
        collapsed,
        onCollapse,
        onExpand,
    } = useChatSidebar((state) => state);

    useEffect(() => {
        if (matches) {
            onCollapse();
        } else {
            onExpand();
        }
    }, [matches, onCollapse, onExpand]); 

  return (
    <div className={cn(
        "flex-1 rounded-r-[15px] transition",
        collapsed ? "mr-[50px]": "mr-[50px] lg:mr-60 transition "
    )}>
        {children}
    </div>
  )
}

export default Container