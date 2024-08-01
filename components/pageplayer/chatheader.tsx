"use client";

import { Skeleton } from "../ui/skeleton";
import { ChatToggle } from "./chatToggle";
import { VariantToggle } from "./variantToggle";

export const ChatHeader = () => {
    return (
        <div className="relative p-2.5 border-b border-background bg-bgblack">
            <div className="absolute left-1 top-1 hidden lg:block">
            <ChatToggle />
            </div>
            <p className="font-semibold pt-0.5 text-xs text-primary text-center">
            CHAT
            </p>
            <div className="absolute right-2 top-1">
             <VariantToggle />
            </div>
        </div>
    );
};

export const ChatHeaderSkeleton = () => {
    return (
        <div className="relative p-3 border-b hidden md-block">
            <Skeleton className="absolute h-6 w-6 left-3 top-3"/>
            <Skeleton className="w-28 h-6 mx-auto" />
        </div>
    )
}