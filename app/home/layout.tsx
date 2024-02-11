import React from 'react'
import SideNavigation from '../common/SideNavigation';

function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className="grid grid-cols-6">
      <div className='bg-green-500 col-span-1'>
        <SideNavigation />
      </div>
      <div className='col-span-5'>
        {children}
      </div>
    </div>
  )
}

export default layout