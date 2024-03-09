'use client'
import React, { useEffect, useState } from 'react'
import axios from '@/utils/axiosConfig';
import Modal from '@/app/common/Modal';
import InvoiceTable from './InvoiceTable';
import { rowsPerPage } from '@/utils/constants';
import { alertTypes } from '@/utils/enums';
import Toast from '@/app/common/Toast';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

function Invoice() {
  const [data, setData] = useState([])
  const [totalPage, setTotalPage] = useState(9)
  const [currentPage, setCurrentPage] = useState(0)
  const [limit, setLimit] = useState(rowsPerPage)
  const [total, setTotal] = useState(2)
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
    axios.get(`/invoice?page=${currentPage}&limit=${limit}&search=${srchVal}`)
    .then(res => {
      console.log({rd: res.data})
      setData(res.data?.invoices)
      setTotal(res.data?.totalRows | 1)
    })
    .catch(err => {
      if(err.response.status === 401) {
        router.push('/login')
        Cookies.remove('token')
      }
    })
  }
  const [toast, setToast] = useState({
    type: alertTypes.success,
    msg: "",
    show: false
  })
  const ModalBody = ({setData: setItems}: {setData: any}) => {
    let [ids, setIds] = useState<string[]>([])
    console.log({ids})
    const [batches, setBatches] = useState([])
    const [formData, setFormData] = useState({
        party_acc_no: '',
        party_name: '',
        address: '',
        proreitor: '',
        phone: '',
        licence_no: '',
        salesman: '',
        town: '',
        cnic_no: '',
    })
    const [disabled, setDisabled] = useState(false)
    const handleGenerate = (e: any) => {
      if(!(req.licence_no && req.party_acc && req.party_name && req.phone && req.proreitor && req.salesman && req.town)) {
        console.log('Some false')
        return
      }
      setDisabled(true)
      axios.post('/invoice', {data: formData, batch_ids: ids})
      .then(res => {
        console.log(res.data)
        if(res.status === 200) {
          setToast(prev => ({...prev, show: true, msg: 'Invoice Generated Sucessfully'}))
          console.log({RES: res.data})
          setItems((prev: any) => ([res.data, ...prev]))
          const modalElement = document.getElementById('my_modal_3') as HTMLDialogElement;
          if (modalElement !== null) {
            modalElement.close();
          }
        }
        setTimeout(() => {
          setDisabled(false)
          setToast(prev => ({...prev, show: false}))
        }, 5000)
      })
      .catch(err => {
        console.log(err)
        const modalElement = document.getElementById('my_modal_3') as HTMLDialogElement;
          if (modalElement !== null) {
            modalElement.close();
          }
        setToast(prev => ({...prev, type: alertTypes.error, show: true, msg: 'Some error occured'}))
        setTimeout(() => {
          setDisabled(false)
          setToast(prev => ({...prev, show: false}))
        }, 5000)
      })
    }
    useEffect(() => console.log('usef ran'), [])
    const [currentPage2, setCurrentPage2] = useState(0)
    const [total2, setTotal2] = useState(0)
    const [limit2, setLimit2] = useState(rowsPerPage)
    useEffect(() => {
        axios.get(`/batch-sent?page=${currentPage2}&limit=${limit2}`)
        .then(res => {
          setTotal2(res.data?.totalRows|0)
          setBatches(res.data?.rows)
        })
        .catch(err => console.log(err))
    }, [currentPage2])
    const [req, setReq] = useState({
      party_acc: false,
      party_name: false,
      // address: false,
      proreitor: false,
      phone: false,
      licence_no: false,
      salesman: false,
      town: false,
      // cnic_no: false
    })
    console.log(req.party_acc, formData.party_acc_no.length === 0)
    return (
      <div className='flex flex-col gap-4'>
        <input
            className='input border-secondary'
            placeholder='Party Account'
            value={formData.party_acc_no}
            onChange={e => {
              setFormData(prev => ({...prev, party_acc_no: e.target.value}))
              if(!req.party_acc)
                setReq(prev => ({...prev, party_acc: true}))
            }}
            onBlur={() => {
              if(!req.party_acc)
                setReq(prev => ({...prev, party_acc: true}))
            }}
        />
        {(req.party_acc && formData.party_acc_no.length === 0) && <span>Required</span> }
        <input
            className='input border-secondary'
            placeholder='Party Name'
            value={formData.party_name}
            onChange={e => {
              setFormData(prev => ({...prev, party_name: e.target.value}))
              if(!req.party_name)
                setReq(prev => ({...prev, party_name: true}))
            }}
            onBlur={() => {
              if(!req.party_name)
                setReq(prev => ({...prev, party_name: true}))
            }}
        />
        {(req.party_name && formData.party_name.length === 0) && <span>Required</span> }
        <input
            className='input border-secondary'
            placeholder='Address'
            value={formData.address}
            onChange={e => {
              setFormData(prev => ({...prev, address: e.target.value}))
              // if(!req.address)
              //   setReq(prev => ({...prev, address: true}))
            }}
            // onBlur={() => {
            //   if(!req.address)
            //     setReq(prev => ({...prev, address: true}))
            // }}
        />
        {/* {(req.address && formData.address.length === 0) && <span>Required</span> } */}
        <input
            className='input border-secondary'
            placeholder='Prorietor'
            value={formData.proreitor}
            onChange={e => {
              setFormData(prev => ({...prev, proreitor: e.target.value}))
              if(!req.proreitor)
                setReq(prev => ({...prev, proreitor: true}))
            }}
            onBlur={() => {
              if(!req.proreitor)
                setReq(prev => ({...prev, proreitor: true}))
            }}
        />
        {(req.proreitor && formData.proreitor.length === 0) && <span>Required</span> }
        <input
            className='input border-secondary'
            placeholder='Phone No'
            value={formData.phone}
            onChange={e => {
              setFormData(prev => ({...prev, phone: e.target.value}))
              if(!req.phone)
                setReq(prev => ({...prev, phone: true}))
            }}
            onBlur={() => {
              if(!req.phone)
                setReq(prev => ({...prev, phone: true}))
            }}
        />
        {(req.phone && formData.phone.length === 0) && <span>Required</span> }
        <input
            className='input border-secondary'
            placeholder='Licence No'
            value={formData.licence_no}
            onChange={e => {
              setFormData(prev => ({...prev, licence_no: e.target.value}))
              if(!req.licence_no)
                setReq(prev => ({...prev, licence_no: true}))
            }}
            onBlur={() => {
              if(!req.licence_no)
                setReq(prev => ({...prev, licence_no: true}))
            }}
        />
        {(req.licence_no && formData.licence_no.length === 0) && <span>Required</span> }
        <input
            className='input border-secondary'
            placeholder='Salesman'
            value={formData.salesman}
            onChange={e => {
              setFormData(prev => ({...prev, salesman: e.target.value}))
              if(!req.salesman)
                setReq(prev => ({...prev, salesman: true}))
            }}
            onBlur={() => {
              if(!req.salesman)
                setReq(prev => ({...prev, salesman: true}))
            }}
        />
        {(req.salesman && formData.salesman.length === 0) && <span>Required</span> }
        <input
            className='input border-secondary'
            placeholder='Town'
            value={formData.town}
            onChange={e => {
              setFormData(prev => ({...prev, town: e.target.value}))
              if(!req.town)
                setReq(prev => ({...prev, town: true}))
            }}
            onBlur={() => {
              if(!req.town)
                setReq(prev => ({...prev, town: true}))
            }}
        />
        {(req.town && formData.town.length === 0) && <span>Required</span> }
        <input
            className='input border-secondary'
            placeholder='CNIC'
            value={formData.cnic_no}
            onChange={e => {
              setFormData(prev => ({...prev, cnic_no: e.target.value}))
              // if(!req.cnic_no)
              //   setReq(prev => ({...prev, cnic_no: true}))
            }}
            // onBlur={() => {
            //   if(!req.cnic_no)
            //     setReq(prev => ({...prev, cnic_no: true}))
            // }}
        />
        {/* {(req.cnic_no && formData.cnic_no.length === 0) && <span>Required</span> } */}
        <div className='border border-collapse p-3 border-solid border-primary rounded-md mt-5'>
          <div className='grid grid-cols-5'>
            <span className='col-span-1'></span>
            <span className='col-span-2 p-2 font-bold'>Batch Id</span>
            <span className='col-span-2 p-2 font-bold'>To</span>
          </div>
          <div>
            {batches?.map((itm: any, indx) => {
                return (
                  <label className='grid grid-cols-5' key={indx}>
                    <input
                      className='col-span-1'
                      type="checkbox"
                      checked={ids.includes(itm.id as string)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setIds(prev => [...prev, itm.id])
                        } else {
                          setIds(prev => prev.filter(id => id !== itm.id))
                        }
                      }}
                    />
                    <span className='col-span-2 px-2'>{itm.id}</span>
                    <span className='col-span-2 px-2'>{itm.to}</span>
                  </label>
                )
            })}
            <div className='flex flex-row items-center gap-5 mt-5 w-fit'>
                <span>Page: {currentPage2+1}/{Math.ceil(total2/limit2)}</span>
                <div className='flex flex-row gap-3'>
                    <button disabled={currentPage2 === 0} className='btn btn-primary' onClick={() => setCurrentPage2(prev => prev-1)}>&lt;</button>
                    <button disabled={currentPage2 === Math.floor(total2/limit2)} className='btn btn-primary' onClick={() => setCurrentPage2(prev => prev+1)}>&gt;</button>
                </div>
            </div>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={disabled} className='btn btn-primary'>Generate</button>
      </div>
    )
  }
  return (
    <div className='p-4'>
      <h1>Invoice</h1>
      <div className='flex flex-col gap-2'>
        <InvoiceTable
          data={data}
          setData={setData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total={total}
          limit={limit}
          srchVal={srchVal}
          setSrchVal={setSrchVal}
        />
        {toast.show && <Toast message={toast.msg} type={toast.type} />}
        <Modal setData={setData} Body={ModalBody} />
      </div>
    </div>
  )
}

export default Invoice