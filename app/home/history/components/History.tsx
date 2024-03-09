'use client'
import React, { useEffect, useState } from 'react'
import axios from '@/utils/axiosConfig';
import MyTable from '@/app/common/MyTable';
import { rowsPerPage } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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
  const [currentPage, setCurrentPage] = useState(0)
  const [limit, setLimit] = useState(rowsPerPage)
  const [total, setTotal] = useState(0)
  const [srchVal, setSrchVal] = useState('')
  const router = useRouter()
  useEffect(() => {
    if(!Cookies.get('token')) {
      router.push('/login')
    }
  }, [])
  useEffect(() => {
    if(!Cookies.get('token')) return
    getData()
  }, [currentPage, srchVal])
  const getData = () => {
    axios.get(`/batch-sent?page=${currentPage}&limit=${limit}&search=${srchVal}`)
    .then(res => {
      console.log(res.data?.rows)
      setData(res.data?.rows)
      setTotal(res.data?.totalRows|0)
    })
    .catch(err => {
      if(err.response.status === 401) {
          router.push('/login')
          Cookies.remove('token')
      }
    })
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
        />
      </div>
    </div>
  )
}

export default History