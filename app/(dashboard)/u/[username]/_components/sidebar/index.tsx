import React from 'react'
import { Wrapper } from './wrapper'
import { Toggle } from './toggle'
import { Navigation } from './navigation'
import { Button } from '@/components/ui/button';
import Link from 'next/link'; 
import { LogOut } from 'lucide-react';
import Logo from './logo'
import { UserButton } from '@clerk/nextjs';


const Sidebar = () => {
  return (
    <Wrapper >
        <Toggle />
        <Navigation />
    </Wrapper>
  )
}

export default Sidebar