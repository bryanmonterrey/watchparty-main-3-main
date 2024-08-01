"use client";

import { cn } from "@/lib/utils";
import { useCreatorSidebar } from "@/store/use-creator-sidebar";

interface WrapperProps {
    children: React.ReactNode;
};

export const Wrapper = ({
    children,
}: WrapperProps) => {
    const { collapsed } = useCreatorSidebar((state) => state);

    return (
        <aside className={cn(
            "transition-all fixed right-0 flex flex-col bottom-0 pt-[46px] w-[55px] lg:w-[330px] h-full border-[#191919] bg-background z-50",
            collapsed && "transition-all lg:w-[55px]"
        )}>
            {children}
        </aside>
    );
};