"use client";

import { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/store/use-sidebar';



interface ContainerProps {
    children: React.ReactNode;
};

export const Container = ({
  children,
}: ContainerProps) => {
    const matches = useMediaQuery("(max-width: 1024px)");
    const {
        collapsed,
        onCollapse,
        onExpand,
    } = useSidebar((state) => state);

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
        collapsed ? "ml-[50px]": "ml-[50px] lg:ml-60 transition "
    )}>
        {children}
    </div>
  );
};
