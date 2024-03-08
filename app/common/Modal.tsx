'use client'
import React from 'react'

type PropType = {
    Body: (({setData}: {setData: any}) => React.JSX.Element) | (() => React.JSX.Element)
    setData: any | null | undefined
}

function Modal({Body, setData}: PropType) {
  return (
    <div>
        {/* <button className="btn" onClick={()=>document.getElementById('my_modal_3').showModal()}>open modal</button> */}
        <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
                <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                {setData ? <Body setData={setData} /> : <Body setData={null} />}
                {/* <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">Press ESC key or click on ✕ button to close</p> */}
            </div>
        </dialog>
    </div>
  )
}

export default Modal