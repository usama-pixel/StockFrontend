import React from 'react'
import SideNavigation from '../common/SideNavigation';

function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className="flex flex-row justify-between">
        <SideNavigation />
        <div style={{width: '100%'}}>
          {children}
        </div>
    </div>
  )
}

export default layout