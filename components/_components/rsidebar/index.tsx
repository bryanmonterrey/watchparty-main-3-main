import React from 'react'
import { Wrapper } from './wrapper'
import { OnToggle } from './toggle'
import { Navigation } from './navigation'

const RSidebar = () => {
  return (
    <Wrapper >
        <OnToggle />
        <Navigation />
        <div className='absolute flex px-9 flex-col items-center justify-center mr-auto bottom-2'>
        <div className='flex items-center mr-2 justify-end gap-x-3 '>
        </div>
        </div>
    </Wrapper>
  )
}

export default RSidebar