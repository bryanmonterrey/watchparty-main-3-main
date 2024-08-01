"use client";

import Image from 'next/image';
import { ChevronsRight, ChevronsLeft } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useChatSidebar } from "@/store/use-chat-sidebar";

export const ChatToggle = () => {
    const {
        collapsed,
        onExpand,
        onCollapse,
    } = useChatSidebar((state) => state);

    const onToggle = () => {
        if (collapsed) {
            onExpand();
        } else {
            onCollapse();
        }
    };

    const label = collapsed ? "Expand" : "Collapse";

    return (
        <Hint label={label} side="left" asChild>
            <Button 
            onClick={onToggle}
            variant="ghost"
            className="h-auto p-1 hover:bg-white/10 hover:text-primary bg-transparent"
            >
                {collapsed ? (
                    <ChevronsLeft
                    className='h-5 w-5 text-lightpurp'
                    strokeWidth={3}
                />
                ) : (
                    <ChevronsRight
                    className='h-5 w-5 text-white'
                    strokeWidth={3}
                />
                )}
            </Button>
        </Hint>
    );
};