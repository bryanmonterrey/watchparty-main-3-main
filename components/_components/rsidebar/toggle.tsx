"use client";

import { Hint } from "@/components/hint";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const OnToggle = () => {
    const {
        collapsed,
        onExpand, 
        onCollapse,
    } = useChatSidebar((state) => state);

    const label = collapsed ? "Expand" : "Collapse";

    return (
        <>
            {collapsed && (
                <div className="transition-all w-full hidden lg:flex items-center justify-center pt-3 mb-4">
                    <Hint label={label} side="right" asChild>
                        <Button
                        onClick={onExpand}
                        variant="ghost"
                        className="h-auto p-2 "
                        >
                            <Image src="/arrowleft.svg" alt="expand" width={14} height={14}  className="text-lightpurp font-bold " />
                        </Button>
                    </Hint>
                </div>
            )}
            {!collapsed && (
                <div className="transition-all p-3 pl-4 mb-2 hidden lg:flex items-center justify-start w-full">
                    <Hint label={label} side="right" asChild >
                        <Button onClick={onCollapse} variant="ghost" className="h-auto p-2 ">
                            <Image src="/arrowrightt.svg" alt="collapse" width={14} height={14}  className="text-lightpurp "/>
                        </Button>
                    </Hint>
                    <p className="font-semibold pl-3 text-primary">
                        Channel Tools
                    </p>
                </div>
            )}
        </>
    );
};