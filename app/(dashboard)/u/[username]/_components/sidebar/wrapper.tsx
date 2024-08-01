"use client";

import { cn } from "@/lib/utils";
import { useCreatorSidebar } from "@/store/use-creator-sidebar";
import Link from 'next/link'; 
import { LogOut } from 'lucide-react';
import Logo from './logo'
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';    

interface WrapperProps {
    children: React.ReactNode;
};

export const Wrapper = ({
    children,
}: WrapperProps) => {
    const { collapsed } = useCreatorSidebar((state) => state);

    return (
        <aside className={cn(
            "transition-all fixed left-0 flex flex-col w-[50px] lg:w-60 h-full  bg-[#1c1b1e] z-50",
            collapsed && "transition-all lg:w-[50px]"
        )}>
            {children}
            <div className='flex items-end justify-center mt-auto mb-5 bottom-2'>
                <div className='flex items-end m-auto justify-center gap-x-3 '>
                <Button
                size="sm"
                variant="ghost"
                className='text-muted-foreground p-2 hover:text-primary '
                asChild >
                    <Link href="/">
                    <LogOut className='h-5 w-5 mr-2'/>
                        Exit
                    </Link>
                </Button>
                </div>
                </div>
        </aside>
    );
};