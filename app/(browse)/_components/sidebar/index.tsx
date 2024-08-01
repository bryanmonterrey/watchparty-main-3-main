import React from 'react';
import { Wrapper } from './wrapper';
import Toggle from './toggle';
import { Following, FollowingSkeleton } from './following';
import Recommended, { RecommendedSkeleton } from './recommended';
import ToggleSkeleton from './toggle';

import { getRecommended } from '@/lib/recommended-service';
import { getFollowedUsers } from '@/lib/follow-service';

const Sidebar = async () => {
    const recommended = await getRecommended();
    const following = await getFollowedUsers();

  return (
    <Wrapper>
        <div className='flex justify-end'>
             <Toggle />
        </div>
        <div className='space-y-3 pt-4 lg:pt-0'>
            <Following data={following} />
            <Recommended data={recommended} />
        </div>
    </Wrapper>
  )
}

export default Sidebar

export const SidebarSkeleton = () => {
    return (
        <aside className='fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background  z-50'>
            <ToggleSkeleton />
            <FollowingSkeleton />
            <RecommendedSkeleton />
        </aside>
    );
};
