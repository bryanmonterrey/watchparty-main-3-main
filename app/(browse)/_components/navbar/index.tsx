import React from 'react'
import Logo from './logo';
import Search from './search';
import Actions from './actions';
import Link from 'next/link';
import { SignedIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Image from 'next/image';


const NavBar = () => {
  return (
    <nav className='fixed top-0 w-full h-[44px] backdrop-blur-custom backdrop-filter backdrop-blur-lg bg-opacity-80 z-[1000] bg-[#1c1b1e] lg:px-2 flex justify-center items-center shadow-sm'>
        <Logo />
            <Link href={"/browse"} className='hover:transition-all hover:ease-in-out hover:duration-300 ml-7 text-white font-medium text-[18px] active:text-lightpurp hover:text-lightpurp active:scale-95 active:duration-100 active:transition-none'>
                <p>Browse</p>
            </Link>
            <SignedIn>
                <Link href={"/following"} className='hover:transition-all hover:ease-in-out hover:duration-300 ml-5 text-white font-medium text-[18px] active:text-lightpurp hover:text-lightpurp active:scale-95 active:duration-100'>
                    <p>Following</p>
                </Link>
            </SignedIn>
            <Button variant="ghost" size="sm" className='h-7 rounded-sm ml-4 px-2 active:scale-90' >
                <Image src="/fda.svg" alt="menu" width={14} height={14} className='h-[14px] w-[14px] p-0 active:scale-90'/>
            </Button>
            <div className='relative z-[50] mr-auto ml-auto flex-grow flex items-center justify-center '>
                <div className='transition-all ease-in-out duration-500 m-auto pl-2 pr-3 focus-within:bg-accent focus:bg-accent hover:bg-accent rounded-full focus-within:border-4 focus-within:border-lightpurp hover:border-4 hover:border-lightpurp bg-litepurp/30'>
                    <Search />
                </div>
            </div>
        <Actions />
    </nav>
  );
};

export default NavBar