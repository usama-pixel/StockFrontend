import ListItem from '@/app/common/ListItem'
import React from 'react'

function Batches() {
    const items = [
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
    ]
  return (
    <div className='pt-5' style={{width: '80%', marginLeft: 'auto', marginRight: '20px'}}>
        {/* <div className='flex flex-row justify-between'> */}
        <div className='grid grid-cols-5'>
            <p className='pr-1'>Batch No</p>
            <p className='pr-1'>Product Name</p>
            <p className='pr-1'>Packing</p>
            <p className='pr-1'>Expiry</p>
            <p className='pr-1'>Quantity</p>
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
                />
            ))}
        </div>
    </div>
  )
}

export default Batches