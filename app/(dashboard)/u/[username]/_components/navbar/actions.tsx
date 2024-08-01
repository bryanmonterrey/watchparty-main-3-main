import React from 'react'
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

const actions = () => {
  return (
    <div className='flex items-center mr-2 justify-end gap-x-3 '>
        <Button
        size="sm"
        variant="ghost"
        className='text-muted-foreground hover:text-primary '
        asChild >
            <Link href="/">
            <LogOut className='h-5 w-5 mr-2'/>
                Exit
            </Link>
        </Button>
        <UserButton        
        />
    </div>
  )
}

export default actions