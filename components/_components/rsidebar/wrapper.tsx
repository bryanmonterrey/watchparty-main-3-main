"use client";

import { cn } from "@/lib/utils";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { useEffect, useState } from "react";

interface WrapperProps {
    children: React.ReactNode;
};

export const Wrapper = ({
    children,
}: WrapperProps) => {
    const [isClient, setIsClient] = useState(false);
    const { collapsed } = useChatSidebar((state) => state);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return ( 
            <aside 
            className="fixed right-0 flex flex-col w-60 h-full bg-[#1c1b1e] z-50">
            </aside>

        )
    };


    return (
        <aside className={cn(
            "transition-all fixed right-0 flex flex-col lg:w-60 w-[50px] h-full bg-[#1c1b1e] z-50",
            collapsed && "transition-all w-[50px] lg:w-[50px]"
        )}>
            {children}
        </aside>
    );
};