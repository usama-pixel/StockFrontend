'use client'
import React, { useEffect, useState } from 'react'
import Table from './Table'
import { status } from '@/utils/enums'
import ReactPaginate from 'react-paginate'
import Pagination from '@/app/common/Pagination'

function History() {
  const data = [
    {
      id: 1,
      person: 'Ismael',
      amount: '100',
      batchId: '202310',
      status: 'Sent',
      date: '10-09-2022'
    },
    {
      id: 2,
      person: 'Shafqat',
      amount: '100',
      batchId: '202311',
      status: 'Recieved',
      date: '10-09-2022'
    },
  ]
  const [totalPage, setTotalPage] = useState(9)
  const [currentPage, setCurrentPage] = useState(1)
  useEffect(() => {
  }, [])
  const handlePageChange = (i:number) => {
    console.log('clicked', i)
    setCurrentPage(i)
  }
  // console.log({currentPage})
  return (
    <div className='p-4'>
      <h1>History</h1>
      <div>
        <Table data={data} />
      </div>
      {/* <Table data={data} /> */}
      {/* <div className='mt-8 ml-auto mr-auto w-fit'>
        <Pagination currentPage={currentPage} handlePageChange={handlePageChange} totalPages={totalPage} />
      </div> */}
    </div>
  )
}

export default History