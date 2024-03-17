import React from 'react'

type DataType = {
    id: string | number
    product_name: string
    to: string
    rate: number
    discount: number
    tax: number
    packing: string
    // expiry
}

type PropType = {
    data: DataType[],
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    total: number
    limit: number
    srchVal: string
    setSrchVal: React.Dispatch<React.SetStateAction<string>>
}

function MyTable({
    data,
    currentPage,
    setCurrentPage,
    total,
    limit,
    srchVal,
    setSrchVal,
}: PropType) {
  return (
    <div
        className='border border-collapse p-3 border-solid border-primary rounded-md mt-5'
        style={{minWidth: '540px'}}
    >
        <div className='flex flex-row mb-5 justify-between'>
            <div className='gap-2 flex flex-row'>
                <input className='input bg-primary text-white placeholder:text-gray-700' placeholder='Search' value={srchVal} onChange={e => setSrchVal(e.target.value)} />
            </div>
        </div>
        <div className='grid grid-cols-6'>
            <span className='col-span-1 p-2 font-bold'>Batch Id</span>
            <span className='col-span-2 p-2 font-bold'>Product Name</span>
            <span className='col-span-1 p-2 font-bold'>To</span>
            <span className='col-span-1 p-2 font-bold'>Rate</span>
            <span className='col-span-1 p-2 font-bold'>Packing</span>
            {data.map(itm => {
                return (
                    // <div className='flex flex-row gap-2'>
                    <>
                        <span className='col-span-1 px-2'>{itm.id}</span>
                        <span className='col-span-2 px-2'>{itm.product_name}</span>
                        <span className='col-span-1 px-2'>{itm.to}</span>
                        <span className='col-span-1 px-2'>{itm.rate}</span>
                        <span className='col-span-1 px-2'>{itm.packing}</span>
                    </>
                    // </div>
                )
            })}
            <div className='flex flex-row items-center gap-5 mt-5 w-fit'>
                <span>Page: {currentPage+1}/{Math.ceil(total/limit)}</span>
                <div className='flex flex-row gap-3'>
                    <button disabled={currentPage === 0} className='btn btn-primary' onClick={() => setCurrentPage(prev => prev-1)}>&lt;</button>
                    <button disabled={currentPage === Math.floor(total/limit)} className='btn btn-primary' onClick={() => setCurrentPage(prev => prev+1)}>&gt;</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MyTable