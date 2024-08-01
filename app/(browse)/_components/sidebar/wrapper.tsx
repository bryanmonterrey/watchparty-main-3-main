"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";
import React, { useState, useEffect } from "react";
import { ToggleSkeleton } from "./toggle";
import { RecommendedSkeleton } from "./recommended";
import { FollowingSkeleton } from "./following";

interface WrapperProps {
    children: React.ReactNode
}

export const Wrapper = ({
    children,
}: WrapperProps) => {
    const [isClient, setIsClient] = useState(false);
    const { collapsed } = useSidebar((state) => state);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return ( 
            <aside 
            className="fixed left-0 flex flex-col w-60 h-full z-[1000] backdrop-blur-custom backdrop-filter backdrop-blur-xl bg-opacity-80 bg-[#1c1b1e]">
                <ToggleSkeleton />
                <FollowingSkeleton />
                <RecommendedSkeleton />

            </aside>

        )
    };

    return (
        <aside className={cn("transition-all fixed left-0 z-[1000] flex-col backdrop-blur-custom backdrop-filter backdrop-blur-xl bg-opacity-80 w-60 h-full bg-[#1c1b1e]",
            collapsed && "transition-all backdrop-blur-custom z-[1000] backdrop-filter backdrop-blur-xl bg-opacity-80 w-[50px]"
        )}
        >
            {children}
        </aside>
    );

};