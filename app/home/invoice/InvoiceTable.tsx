import React, { useState } from 'react'
import axios from '@/utils/axiosConfig'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete'
import { alertTypes } from '@/utils/enums'
import Toast from '@/app/common/Toast'
import styles from './invoice.module.scss'

type DataType = {
    id: string,
    party_acc_no: string
    party_name: string
    cnic_no: string
    proreitor: number
    town: number
    salesman: number
}

type PropType = {
    data: DataType[],
    setData: any
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    total: number
    limit: number
    srchVal: string
    setSrchVal: React.Dispatch<React.SetStateAction<string>>
}

function InvoiceTable({
    data,
    setData,
    currentPage,
    setCurrentPage,
    total,
    limit,
    srchVal,
    setSrchVal,
}: PropType) {
    const handleGenerateInvoice = () => {
        const modalElement = document.getElementById('my_modal_3') as HTMLDialogElement;
        if (modalElement !== null) {
            modalElement.showModal();
        }
    }
    const [pdf, setPdf] = useState<Blob | null>()
    const handleDownload = (invoice_id: string) => {
        axios.get(`/getpdf?invoice_id=${invoice_id}`, {
            responseType: 'blob' // Set the response type to blob
        })
        .then(res => {
            // Create a Blob from the response data
            const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
            // Create a temporary URL for the Blob
            const url = window.URL.createObjectURL(pdfBlob);
    
            // Create a temporary link element
            const link = document.createElement('a');
            // Set the href attribute to the URL
            link.href = url;
            // Set the download attribute to specify filename
            link.setAttribute('download', 'hello_world.pdf');
            // Simulate click on the link to trigger download
            document.body.appendChild(link);
            link.click();
            // Clean up resources
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url); // Revoke the Object URL
        })
        .catch(err => console.log(err));
    }
    const [invoiceId, setInvoiceId] = useState<string>()
    const handleDelete = (invoice_id: string) => {
        setInvoiceId(invoice_id)
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
    const [toast, setToast] = useState({
        type: alertTypes.success,
        msg: "",
        show: false
    })
    const [btnDisabled, setBtnDisabled] = useState(false)
    const handleConfirmDelete = () => {
        setBtnDisabled(true)
        axios.delete(`/invoice?id=${invoiceId}`)
        .then(res => {
            setToast(prev => ({...prev, show: true, msg: 'Deleted Sucessfully'}))
            setData((prev: any[]) => prev.filter(itm => itm.id !== invoiceId))
            handleCancel()
            setTimeout(() => {
                setToast(prev => ({...prev, show: false}))
                setBtnDisabled(false)
                handleCancel()
            }, 5000)
        })
        .catch(err => {
            // setToast
            setToast(prev => ({...prev, show: true, msg: 'Some error occured while deleting'}))
            handleCancel()
            setTimeout(() => {
                setToast(prev => ({...prev, show: false}))
                setBtnDisabled(false)
                handleCancel()
            }, 5000)
            setBtnDisabled(false)
        })
    }
  return (
    <div className='border border-collapse p-3 border-solid border-primary rounded-md mt-5' style={{minWidth: '532px'}}>
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className='flex flex-col gap-5 justify-center items-center'>
                    <h1>Delete the invoice(id: {invoiceId}) ?</h1>
                    <div className='flex flex-row gap-2'>
                        <button className='btn border-warning w-fit' disabled={btnDisabled} onClick={handleConfirmDelete}>Confirm</button>
                        <button className='btn border-secondary w-fit' onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </dialog>
        {toast.show && <Toast message={toast.msg} type={toast.type} />}
        <div className='flex flex-col mb-5 md:justify-between md:flex-row'>
            <div className='mb-2 gap-2 flex flex-row md:mb-0'>
                <input className='input bg-primary text-white placeholder:text-gray-700' placeholder='Search' value={srchVal} onChange={e => setSrchVal(e.target.value)} />
            </div>
            <button className='btn btn-primary w-fit' onClick={handleGenerateInvoice}>Generate Invoice</button>
        </div>
        <div className='grid grid-cols-7 lg:grid-cols-8 mt-4'>
            <span className='col-span-1 p-2 font-bold mb-3'>Invoice Id</span>
            <span className='col-span-1 p-2 font-bold mb-3'>Party Account</span>
            <span className='col-span-1 p-2 font-bold mb-3'>Party Name</span>
            <span className='hidden lg:block col-span-1 p-2 font-bold mb-3'>CNIC</span>
            <span className='col-span-1 p-2 font-bold mb-3'>Prorietor</span>
            <span className='col-span-1 p-2 font-bold mb-3'>Town</span>
            <span className='col-span-1 p-2 font-bold mb-3 text-right md:text-left'>Salesman</span>
            <span className='col-span-1 p-2 font-bold mb-3 text-right md:text-left'>Action</span>
            {data?.map(itm => {
                return (
                    <>
                        <span className='col-span-1 px-2 mt-1'>{itm.id}</span>
                        <span className='col-span-1 px-2 mt-1'>{itm.party_acc_no}</span>
                        <span className='col-span-1 px-2 mt-1'>{itm.party_name}</span>
                        <span className='hidden lg:block col-span-1 px-2 mt-1'>{itm.cnic_no}</span>
                        <span className='col-span-1 px-2 mt-1'>{itm.proreitor}</span>
                        <span className='col-span-1 px-2 mt-1'>{itm.town}</span>
                        <span className='col-span-1 px-2 mt-1'>{itm.salesman}</span>
                        <span className='col-span-1 w-fit grid mt-1 grid-cols-2 gap-1' >
                            
                            <button className={styles.btn} onClick={e => handleDownload(itm.id)}>
                                <DownloadIcon />
                            </button>
                            <button className={styles.btn} onClick={e => handleDelete(itm.id)}>
                                <DeleteIcon />
                            </button>
                            {/* <button className='col-span-1 btn btn-primary w-fit' onClick={e => handleDownload(itm.id)}>Download</button> */}
                        </span>
                        {/* <button className='col-span-1 btn btn-primary w-fit' onClick={e => console.log(itm.id)}>Download</button> */}
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
  )
}

export default InvoiceTable