"use client";

import { Hint } from "@/components/hint";
import { useCreatorSidebar } from "@/store/use-creator-sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Toggle = () => {
    const {
        collapsed,
        onExpand, 
        onCollapse,
    } = useCreatorSidebar((state) => state);

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
                            <Image src="/arrowleft.svg" alt="expand" width={14} height={14} className="text-lightpurp font-bold h-3.5 w-3.5" />
                        </Button>
                    </Hint>
                </div>
            )}
            {!collapsed && (
                <div className="transition-all p-3 pl-6 mb-2 hidden lg:flex items-center w-full">
                    <p className="font-semibold text-primary">
                      Dashboard
                    </p>
                    <Hint label={label} side="right" asChild >
                        <Button onClick={onCollapse} variant="ghost" className="h-auto p-2 ml-auto">
                            <Image src="/arrowrightt.svg" alt="collapse" width={14} height={14} className="text-lightpurp h-3.5 w-3.5"/>
                        </Button>
                    </Hint>
                </div>
            )}
        </>
    );
};