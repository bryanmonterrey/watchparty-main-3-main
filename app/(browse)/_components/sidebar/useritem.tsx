"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/store/use-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link"
import { UserAvatar } from "@/components/useravatar";
import { LiveBadge } from "@/components/livebadge";
import { CloudOff } from "lucide-react";
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from "next/image";

interface UserItemProps {
    username: string;
    imageUrl: string;
    isLive?: boolean;
};

export const UserItem = ({
    username,
    imageUrl,
    isLive,
}: UserItemProps) => {
    const pathname = usePathname();

    const { collapsed } = useSidebar((state) => state);

    const href = `/${username}`;
    const isActive = pathname === href;


    return (
        <Button
         asChild 
         variant="ghost"
         className={cn(
            "w-[232px] h-10 px-2 rounded-[3px]",
            collapsed ? "justify-center my-0.5 h-8 w-8 hover:bg-lightpurp items-center flex rounded-full" : "items-center flex justify-center",
            isActive && "bg-white/5",
         )}
        >
            <Link href={href}>
            <div className={cn(
                "flex flex-row items-center w-full gap-x-3 ",
                collapsed && "flex justify-center items-center",
            )}>
                <UserAvatar 
                imageUrl={imageUrl}
                username={username}
                isLive={isLive}
                
                />
                {!collapsed && isLive && (
                    <div className="-space-y-[5px] text-md">
                    <p className="truncate font-extrabold  mb-0">
                        {username}
                    </p>
                    <p className="truncate font-medium  mt-0 text-gray-300">
                        {username}   
                    </p>
                    </div>
                    
                )}
                {!collapsed && !isLive && (
                    <p className="truncate font-bold  mb-0 text-[#585A70]">
                        {username}
                    </p>
                )}
                {!collapsed && isLive && (
                    <Image src="/live.svg" alt="live" width={10} height={10} className="h-2.5 w-2.5 ml-auto text-black" />
                )}
                {!collapsed && !isLive &&(
                    <Image src="/off.svg" alt="offline" width={16} height={16} className="h-[16px] w-[16px] ml-auto "/>
                    
                )}
            </div>
            </Link>
            
        </Button>
    );
};

export const UserItemSkeleton = () => {
    return (
        <li className="flex items-center gap-x-4 px-3 py-4">
            <Skeleton className="min-h-[32px] min-w-[32px] rounded-full"/>
            <div className="flex-1">
                <Skeleton className="h-6 " />

            </div>
        </li>
    )
}