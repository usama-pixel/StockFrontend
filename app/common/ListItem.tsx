import React from 'react'

type propType = {
    batch_no: string,
    product_name: string,
    packing: string,
    expiry: string,
    quanity: number
}

function ListItem({ batch_no, product_name, packing, expiry, quanity }: propType) {
  return (
    <div className='grid grid-cols-5 bg-secondary mb-5 p-5 rounded-xl'>
        <span>{batch_no}</span>
        <span>{product_name}</span>
        <span>{packing}</span>
        <span>{expiry}</span>
        <span>{quanity}</span>
    </div>
  )
}

export default ListItem