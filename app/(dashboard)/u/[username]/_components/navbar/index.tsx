import React from 'react'
import Logo from './logo';
import Actions from './actions';


const NavBar = () => {
  return (
    <nav className='absolute top-0 w-full z-50 bg-[#000] px-1 lg:px-2 flex justify-between items-center shadow-sm'>
        <Logo />

      
        <Actions />
        
    </nav>
  );
};

export default NavBar