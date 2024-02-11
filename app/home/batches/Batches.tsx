'use client'
import ListItem from '@/app/common/ListItem'
import React, { useState } from 'react'

function Batches() {
    const [items, setItems] = useState([
        {
            batch_no: '1',
            product_name: 'Brufan',
            packing: '10ml',
            expiry: '10-10-2024',
            quanity: 10
        },
        {
            batch_no: '2',
            product_name: 'Panadol',
            packing: '10ml',
            expiry: '10-10-2024',
            quanity: 20
        }
    ])
  return (
    <div className='p-4'>
        <div className='grid grid-cols-6 mb-3'>
            <p className='pr-1 text-center'>Batch No</p>
            <p className='pr-1 text-center'>Product Name</p>
            <p className='pr-1 text-center'>Packing</p>
            <p className='pr-1 text-center'>Expiry</p>
            <p className='pr-1 text-center'>Quantity</p>
            <p className='pr-1 text-center'>Actions</p>
        </div>
        <div className='flex flex-col'>
            {items.map(itm => (
                <ListItem
                    batch_no={itm.batch_no}
                    expiry={itm.expiry}
                    packing={itm.packing}
                    product_name={itm.product_name}
                    quanity={itm.quanity}
                    key={itm.batch_no}
                    onDelete={() => setItems(
                        items.filter(i => i.batch_no !== itm.batch_no)
                    )}
                    onEdit={() => {}}
                />
            ))}
        </div>
    </div>
  )
}

export default Batches