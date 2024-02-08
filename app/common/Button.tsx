import React from 'react'

function Button({children}: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <button className='btn btn-primary'>{children}</button>
  )
}

export default Button