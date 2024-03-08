'use client'
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'
import {parseISO, format, parse} from 'date-fns';
import { ErrorMessage, Field, Form, Formik } from 'formik'
import axios from '@/utils/axiosConfig'
import Modal from '@/app/common/Modal'
import Toast from '@/app/common/Toast'
import { alertTypes, status } from '@/utils/enums'
import { BatchDataType } from '@/utils/types';
import { rowsPerPage } from '@/utils/constants';
import { AxiosResponse } from 'axios';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'

type StatusType = {
    name: string
}

type ItemsType = {
    id: string,
    product_name: string,
    packing: string,
    expiry_date: string,
    quantity: number,
    Status: StatusType
}

function Batches() {
    const [data, setData] = useState<BatchDataType[]>([])
    const [toast, setToast] = useState({
        type: alertTypes.success,
        msg: "",
        show: false
    })
    const pageSizeOptions = [3, 4, 100]
    // const [pageNumber, setPageNumber] = useState(0)
    const [limit, setLimit] = useState(rowsPerPage)
    const [total, setTotal] = useState(rowsPerPage)
    const [currentPage, setCurrentPage] = useState(0)
    const [srchVal, setSrchVal] = useState('')
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [to, setTo] = React.useState('')
    const [sendDisable, setSendDisable] = useState(false)
    // const [batch_id, setBatch_id] = useState('')
    const [batchId, setBatchId] = useState<string>()
    const getData = () => {
    axios.get(`/batch?page=${currentPage}&limit=${limit}&search=${srchVal}`)
    .then(res => {
        setData(res.data?.rows?.map((d: any) => {
            d.id === 28 && console.log(d)
            const revised_data = {
                id: d.id,
                status: d?.Status?.name[0]?.toUpperCase() + d?.Status?.name.slice(1),
                product_name: d.product_name,
                quantity: d.quantity,
                rate: d.rate,
                tax: d.tax,
                discount: d.discount,
                expiry_date: d.expiry_date,
                packing: d.packing,
            }
            return revised_data;
        }))
        setTotal(res?.data?.totalRows||0)
    })
    .catch(err => console.log(err))
    }
    useEffect(() => {
        getData()
    }, [currentPage, limit, srchVal])
    const convertDate = (dateString: string): string => {
        if(!dateString) return ''
        const parsedDate = parseISO(dateString);
        const formattedDate = format(parsedDate, 'MMM-dd-yyyy');
        return formattedDate;
    }
    const ModalBody = () => {
        const [btnDisabled, setBtnDisabled] = useState(false);
        const handleAdd = (values: any) => {
            setBtnDisabled(true)
            axios.post('/batch', {
                ...values
            })
            .then((res: AxiosResponse<any, any>) => {
                if(res.status === 200) {
                    setToast(prev => ({...prev, show: true, msg: 'Batch Added Sucessfully'}))
                    const modalElement = document.getElementById('my_modal_3') as HTMLDialogElement;
                    setData(prev => ([{...res.data, status: res.data?.Status?.name === 'recieved' ? 'Recieved': 'Returned'}, ...prev]))
                    if (modalElement !== null) {
                        modalElement.close();
                    }
                    setTimeout(() => {
                        setToast(prev => ({...prev, show: false}))
                        setBtnDisabled(false)
                    }, 5000)
                    return
                }
                setToast(prev => ({...prev, show: true, msg: 'Some error occured'}))
                setTimeout(() => {
                    setToast(prev => ({...prev, show: false}))
                    setBtnDisabled(false)
                }, 5000)
            })
            .catch(err => {
                setBtnDisabled(false)
                console.log(err.response.data)
            })
        }
        return (
            <>
            <Formik
                initialValues={{
                    product_name: "",
                    packing: "",
                    quantity: "",
                    rate: "",
                    expiry_date: "",
                    discount: "",
                    tax: "",
                }}
                validate={values => {
                    let errors = {};
                    if (!values.product_name) {
                        errors = {...errors, product_name: 'Required'}
                    }
                    if(!values.quantity) {
                        errors = {...errors, quantity: 'Required'}
                    }
                    if(!values.rate) {
                        errors = {...errors, rate: 'Required'}
                    }
                    if(!values.expiry_date) {
                        errors = {...errors, expiry_date: 'Required'}
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    values.rate = (+values.rate).toFixed(2)
                    values.discount = (+values.discount).toFixed(2)
                    values.tax = (+values.tax).toFixed(2)
                    handleAdd(values)
                    setSubmitting(false);
                }}
                >
                {({ isSubmitting }) => (
                    <Form className='flex flex-col justify-center items-center'>
                        <Field type="text" name="product_name" placeholder="Product Name" className="input input-bordered w-full max-w-xs mt-2" />
                        <ErrorMessage name="product_name" component="div" />
                        <Field type="text" name="packing" placeholder="Packing" className="input input-bordered w-full max-w-xs mt-2" />
                        <Field type="number" name="quantity" placeholder="Quantity" className="input input-bordered w-full max-w-xs mt-2" />
                        <ErrorMessage name="quantity" component="div" />
                        <Field type="number" name="rate" placeholder="Rate" className="input input-bordered w-full max-w-xs mt-2" />
                        <ErrorMessage name="rate" component="div" />
                        <Field type="date" name="expiry_date" placeholder="Expiry Date" className="input input-bordered w-full max-w-xs mt-2" />
                        <ErrorMessage name="expiry_date" component="div" />
                        <Field type="number" name="discount" placeholder="Discount" className="input input-bordered w-full max-w-xs mt-2" />
                        <Field type="number" name="tax" placeholder="Tax" className="input input-bordered w-full max-w-xs mt-2" />
                        <ErrorMessage name="password" component="div" />
                        <button className='btn btn-primary w-full max-w-xs mt-2' type="submit" disabled={btnDisabled}>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
            </>
        )
    }
    
    const handleDelete = (batch_id: string) => {
        setBatchId(batch_id)
        const modalElement = document.getElementById('my_modal_1') as HTMLDialogElement;
        if (modalElement !== null) {
            modalElement.showModal();
        }
    }
    const handleCancel = () => {
        const modalElement = document.getElementById('my_modal_1') as HTMLDialogElement;
        if (modalElement !== null) {
            modalElement.close();
        }
    }
    const handleConfirmDelete = () => {
        setBtnDisabled(true)
        axios.delete(`/batch/${batchId}`)
        .then(res => {
            setToast(prev => ({...prev, show: true, msg: 'Deleted Sucessfully'}))
            setData((prev: any[]) => prev.filter(itm => itm.id !== batchId))
            handleCancel()
            setTimeout(() => {
                setToast(prev => ({...prev, show: false}))
                setBtnDisabled(false)
            }, 5000)
        })
        .catch(err => {
            console.log(err)
            setToast(prev => ({...prev, show: true, msg: 'Some error occured while deleting'}))
            handleCancel()
            setTimeout(() => {
                setToast(prev => ({...prev, show: false}))
                setBtnDisabled(false)
            }, 5000)
            setBtnDisabled(false)
        })
    }
    const handleSend = (id: string)  => {
        setBatchId(id)
        const modalElement = document.getElementById('send_modal') as HTMLDialogElement;
        if (modalElement !== null) {
          modalElement.showModal();
        }
    }
    const handleSend2 = () => {
        setSendDisable(true)
        axios.post('/send-batch', {
            to,
            batchId
        })
        .then(res => {
        if(res.status === 200) {
            setToast({msg: 'Sent sucessfully', show: true, type: alertTypes.info})
            setData((prev: any) => {
                const rev = data.filter((itm: any) => itm.id !== batchId)
                return rev
            })
            const modalElement = document.getElementById('send_modal') as HTMLDialogElement;
            if (modalElement !== null) {
                modalElement.close();
            }
            setTimeout(() => {
                setToast(prev => ({...prev, show: false}))
            }, 5000)
            setTo('');
            setSendDisable(false)
        }
        })
        .catch(err => {
            setToast({
                msg: "Some Error Occured while performing this action",
                show: true,
                type: alertTypes.error
            })
            setTimeout(() => {
                setToast(prev => ({...prev, show: false}))
            }, 5000)
            const modalElement = document.getElementById('send_modal') as HTMLDialogElement;
            if (modalElement !== null) {
                modalElement.close();
            }
            setTo('');
            setSendDisable(false)
        })
    }
    const handleAddBatch = () => {
        const modalElement = document.getElementById('my_modal_3') as HTMLDialogElement;
        if (modalElement !== null) {
            modalElement.showModal();
        }
    }
    const [editData, setEditData] = useState({
        product_name: '',
        quantity: 0,
        status: status.recieved,
        rate: 0,
        tax: 0,
        discount: 0,
        expiry_date: '',
        packing: ''
    })
    const handleEdit = (id: string) => {
        setBatchId(id)
        const d = data.find(d => d.id === id)
        setEditData((prev: any): any => ({
            discount: d?.discount,
            expiry_date: d?.expiry_date,
            packing: d?.packing,
            product_name: d?.product_name,
            quantity: d?.quantity,
            rate: d?.rate,
            status: d?.status,
            tax: d?.tax
        }))
        const modalElement = document.getElementById('edit_modal') as HTMLDialogElement;
        if (modalElement !== null) {
            modalElement.showModal();
        }
    }
    const handleSaveEdit = () => {
        setBtnDisabled(true)
        const revised_data = {...editData, id: batchId, }
        axios.put('/batch', {
            ...revised_data
        })
        .then(res => {
            setToast({
                msg: 'Edit saved successfully',
                show: true,
                type: alertTypes.success
            })
            setTimeout(() => {
                setToast(prev => ({
                    ...prev,
                    show: false,
                }))
            }, 5000)
            const modalElement = document.getElementById('edit_modal') as HTMLDialogElement;
            if (modalElement !== null) {
                modalElement.close();
            }
            setBtnDisabled(false)
            setData((prev: any[]) => {
                const revised_d = prev.map((d: any) => {
                    if(d.id === batchId) {
                        return {...revised_data}
                    } return d
                })
                return revised_d
            })
        })
        .catch(err => {
            const modalElement = document.getElementById('edit_modal') as HTMLDialogElement;
            if (modalElement !== null) {
                modalElement.close();
            }
            setBtnDisabled(false)
            setToast({
                msg: 'Some error occured while updating the data',
                show: true,
                type: alertTypes.error
            })
            setTimeout(() => {
                setToast((prev) => ({
                    ...prev,
                    show: false,
                }))  
            }, 5000)
            console.log(err)
        })
    }
    const convertEditDate = (str: string) => {
        if(!str) return
        const date = new Date(str);
        return format(date, 'yyyy-MM-dd');
    }
  return (
    <div className="p-4" style={{width: '100%', marginLeft: 'auto', marginRight: 'auto'}}>
        {toast.show && <Toast message={toast.msg} type={toast.type} />}
        <Modal setData={null} Body={ModalBody}/>
        <dialog id="edit_modal" className="modal" style={{zIndex: 10}}>
            <div className="modal-box">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h3 className="font-bold text-lg">Edit the Batch with Id ({batchId})</h3>
                    <div className='flex flex-col gap-1'>
                        <label className='form-control w-full max-w-xs'>
                            <div className='label'>
                                <span className='label-text-alt'>Product Name</span>
                            </div>
                            <input
                                placeholder='Product Name'
                                className='input input-bordered'
                                type='text'
                                name='product_name'
                                value={editData.product_name}
                                onChange={e => setEditData(prev => ({...prev, product_name: e.target.value}))}
                            />
                        </label>
                        <label className='form-control w-full max-w-xs'>
                            <div className='label'>
                                <span className='label-text-alt'>Quantity</span>
                            </div>
                            <input
                                placeholder='Quantity'
                                className='input input-bordered'
                                type='number'
                                value={editData.quantity}
                                onChange={e => setEditData((prev: any) => ({...prev, quantity: e.target.value}))}
                            />
                        </label>
                        <label className='form-control w-full max-w-xs'>
                            <div className='label'>
                                <span className='label-text-alt'>Status</span>
                            </div>
                            <select className='select select-bordered w-full max-w-xs' onChange={(e) => setEditData((prev: any) => ({...prev, status: e.target.value}))}>
                                <option selected={editData.status === status.recieved}>Recieved</option>
                                {/* <option selected={editData.status === status.sent}>Sent</option> */}
                                <option selected={editData.status === status.returned}>Returned</option>
                            </select>
                        </label>
                        <label className='form-control w-full max-w-xs'>
                            <div className='label'>
                                <span className='label-text-alt'>Rate</span>
                            </div>
                            <input
                                placeholder='Rate'
                                className='input input-bordered'
                                type='number'
                                value={editData.rate}
                                onChange={e => setEditData((prev: any) => ({...prev, rate: e.target.value}))}
                            />
                        </label>
                        <label className='form-control w-full max-w-xs'>
                            <div className='label'>
                                <span className='label-text-alt'>Tax</span>
                            </div>
                            <input
                                placeholder='Tax'
                                className='input input-bordered'
                                type='number'
                                value={editData.tax}
                                onChange={e => setEditData((prev: any) => ({...prev, tax: e.target.value}))}
                            />
                        </label>
                        <label className='form-control w-full max-w-xs'>
                            <div className='label'>
                                <span className='label-text-alt'>Discount</span>
                            </div>
                            <input
                                placeholder='Discount'
                                className='input input-bordered'
                                type='number'
                                value={editData.discount}
                                onChange={e => setEditData((prev: any) => ({...prev, discount: e.target.value}))}
                            />
                        </label>
                        <label className='form-control w-full max-w-xs'>
                            <div className='label'>
                                <span className='label-text-alt'>Expiry</span>
                            </div>
                            <input
                                placeholder='Expiry'
                                className='input input-bordered'
                                type='date'
                                value={convertEditDate(editData.expiry_date)}
                                onChange={e => setEditData((prev: any) => ({...prev, expiry_date: e.target.value}))}
                            />
                        </label>
                        <label className='form-control w-full max-w-xs'>
                            <div className='label'>
                                <span className='label-text-alt'>Packing</span>
                            </div>
                            <input
                                placeholder='Packing'
                                className='input input-bordered'
                                type='text'
                                value={editData.packing}
                                onChange={e => setEditData((prev: any) => ({...prev, packing: e.target.value}))}
                            />
                        </label>
                    </div>

                    <div className='flex flex-row gap-2'>
                        <button className='btn btn-primary' disabled={btnDisabled} onClick={() => handleSaveEdit()}>Save Changes</button>
                        <button className='btn btn-primary' disabled={false} onClick={() => {
                            const modalElement = document.getElementById('edit_modal') as HTMLDialogElement;
                            if (modalElement !== null) {
                                modalElement.close();
                            }
                        }}>Cancel</button>
                    </div>
                </div>
            </div>
        </dialog>
        <dialog id="send_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h3 className="font-bold text-lg">Who to send the batch to?</h3>
                    <input placeholder='Name' value={to} onChange={e => setTo(e.target.value)} />
                    <button className='btn btn-primary' disabled={sendDisable} onClick={handleSend2}>Send</button>
                </div>
            </div>
        </dialog>
        <div className='border border-collapse p-3 border-solid border-primary rounded-md mt-5'>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className='flex flex-col gap-5 justify-center items-center'>
                        <h1>Delete the Batch(id: {batchId}) ?</h1>
                        <div className='flex flex-row gap-2'>
                            <button className='btn border-warning w-fit' disabled={btnDisabled} onClick={handleConfirmDelete}>Confirm</button>
                            <button className='btn border-secondary w-fit' onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            </dialog>
            {toast.show && <Toast message={toast.msg} type={toast.type} />}
            <div className='flex flex-row mb-5 justify-between'>
                <div className='gap-2 flex flex-row'>
                    <input className='input bg-primary text-white placeholder:text-gray-700' placeholder='Search' value={srchVal} onChange={e => setSrchVal(e.target.value)} />
                </div>
                <button className='btn btn-primary' onClick={handleAddBatch}>Add Batch</button>
            </div>
            <div className='grid grid-cols-12 mt-4'>
                <span className='col-span-1 p-2 font-bold mb-3'>Batch Id</span>
                <span className='col-span-1 p-2 font-bold mb-3'>Product Name</span>
                <span className='col-span-1 p-2 font-bold mb-3'>Quantity</span>
                <span className='col-span-1 p-2 font-bold mb-3'>Status</span>
                <span className='col-span-1 p-2 font-bold mb-3'>Rate</span>
                <span className='col-span-1 p-2 font-bold mb-3'>Tax</span>
                <span className='col-span-1 p-2 font-bold mb-3'>Discount</span>
                <span className='col-span-2 p-2 font-bold mb-3'>Expiry</span>
                <span className='col-span-1 p-2 font-bold mb-3'>Packing</span>
                <span className='col-span-2 p-2 font-bold mb-3'>Actions</span>
                {data?.map(itm => {
                    return (
                        <>
                            <span className='col-span-1 px-2 mt-1'>{itm.id}</span>
                            <span className='col-span-1 px-2 mt-1'>{itm.product_name}</span>
                            <span className='col-span-1 px-2 mt-1'>{itm.quantity}</span>
                            <span className='col-span-1 px-2 mt-1'>{itm.status}</span>
                            <span className='col-span-1 px-2 mt-1'>{itm.rate}</span>
                            <span className='col-span-1 px-2 mt-1'>{itm.tax}</span>
                            <span className='col-span-1 px-2 mt-1'>{itm.discount}</span>
                            <span className='col-span-2 px-2 mt-1'>{convertDate(itm.expiry_date)}</span>
                            <span className='col-span-1 px-2 mt-1'>{itm.packing}</span>
                            <span className='col-span-2 mt-1 w-fit grid grid-cols-3 gap-1' >
                                <button className='btn btn-primary w-fit' onClick={e => handleEdit(itm.id)}>
                                    <EditIcon />
                                </button>
                                <button className='btn btn-primary w-fit' onClick={e => handleSend(itm.id)}>
                                    <SendIcon />
                                </button>
                                <button className='btn btn-primary w-fit' onClick={e => handleDelete(itm.id)}>
                                    <DeleteIcon />
                                </button>
                            </span>
                        </>
                    )
                })}
                <div className='flex flex-col items-center gap-2 mt-5 w-fit'>
                    <span className='flex flex-row gap-2'>
                        <p>Page: </p>
                        <p>{currentPage+1}/{Math.ceil(total/limit)}</p>
                    </span>
                    <div className='flex flex-row gap-3'>
                        <button disabled={currentPage === 0} className='btn btn-primary' onClick={() => setCurrentPage(prev => prev-1)}>&lt;</button>
                        <button disabled={currentPage === Math.floor(total/limit)} className='btn btn-primary' onClick={() => setCurrentPage(prev => prev+1)}>&gt;</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Batches