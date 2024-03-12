import React from 'react'
import SideNavigation from '../common/SideNavigation';

function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    // <div className="grid grid-cols-6 gap-1">
    <div className='flex flex-row w-full'>
      <div>
        <SideNavigation />
      </div>
      <div className='w-full sm:ml-36'>
        {children}
      </div>
    </div>
  )
}

export default layout