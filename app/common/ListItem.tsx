'use client'
import React from 'react'

type propType = {
    batch_no: string,
    product_name: string,
    packing: string,
    expiry: string,
    quanity: number,
    onDelete: () => void,
    onEdit: () => void,
}

function ListItem({
  batch_no,
  product_name,
  packing,
  expiry,
  quanity,
  onDelete,
  onEdit }: propType) {
  return (
    <div className='grid grid-cols-6 bg-primary mb-5 p-5 rounded-xl'>
        <span className='text-center'>{batch_no}</span>
        <span className='text-center'>{product_name}</span>
        <span className='text-center'>{packing}</span>
        <span className='text-center'>{expiry}</span>
        <span className='text-center'>{quanity}</span>
        <div className='text-center'>
          <button className='btn btn-accent' onClick={onEdit}>Edit</button>
          <button className='btn bg-red-600 text-white border-none ml-2' onClick={onDelete}>Delete</button>
        </div>
    </div>
  )
}

export default ListItem