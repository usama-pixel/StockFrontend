'use client'
import React, { useEffect, useState } from 'react'
import axios from '@/utils/axiosConfig';
import MyDataGrid from './MyDataGrid'
import { status } from '@/utils/enums'
import ReactPaginate from 'react-paginate'
import Pagination from '@/app/common/Pagination'
import TanStackTable from '@/app/common/TanStackTable/TanStackTable';
import MyTable from '@/app/common/MyTable';
import Modal from '@/app/common/Modal';
import { rowsPerPage } from '@/utils/constants';

function History() {
  const d = [
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
  const [data, setData] = useState([])
  const [totalPage, setTotalPage] = useState(9)
  const [currentPage, setCurrentPage] = useState(0)
  const [limit, setLimit] = useState(rowsPerPage)
  const [total, setTotal] = useState(0)
  useEffect(() => {
    getData()
  }, [currentPage])
  const handlePageChange = (i:number) => {
    console.log('clicked', i)
    setCurrentPage(i)
  }
  const [srchVal, setSrchVal] = useState('')
  const handleSearch = () => {
    // console.log({srchVal})
    getData()
    // axios.get(`/batch-sent?page=${currentPage}&limit=${limit}`)
    // .then(res => {

    // })
  }
  const getData = () => {
    axios.get(`/batch-sent?page=${currentPage}&limit=${limit}&search=${srchVal}`)
    .then(res => {
      console.log(res.data?.rows)
      setData(res.data?.rows)
      setTotal(res.data?.totalRows|0)
    })
    .catch(err => console.log(err))
  }
  // console.log({currentPage})
  return (
    <div className='p-4'>
      <h1>History</h1>
      <div className='flex flex-col gap-2'>
        <MyTable
          data={data}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total={total}
          limit={limit}
          srchVal={srchVal}
          setSrchVal={setSrchVal}
          handleSearch={handleSearch}
        />
        <Modal Body={() => <h1>Yo</h1>} />
        {/* <TanStackTable /> */}
        {/* {data.map((itm: any) => (
          <div className='flex flex-row gap-2 bg-accent'>
            <p>{itm?.to}</p>
            <p>{itm?.product_name}</p>
            <p>{itm?.discount}</p>
            <p>{itm?.expiry_date}</p>
            <p>{itm?.rate}</p>
            <p>{itm?.tax}</p>
            <p>{itm?.quantity}</p>
          </div>
        ))} */}
      </div>
      {/* <Table data={data} /> */}
      {/* <div className='mt-8 ml-auto mr-auto w-fit'>
        <Pagination currentPage={currentPage} handlePageChange={handlePageChange} totalPages={totalPage} />
      </div> */}
    </div>
  )
}

export default History