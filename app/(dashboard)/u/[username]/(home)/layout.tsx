import React from 'react'
import Container from '@/components/_components/container';
import RSidebar from '@/components/_components/rsidebar';

const HomeLayout = ({ 
    children, 
}: {
    children: React.ReactNode;
}) => {
  return (
    <>
        <div className="transition-all flex h-full" >   
            <RSidebar /> 
            <Container>
                {children}
            </Container>
        </ div>
    </>
  )
}

export default HomeLayout