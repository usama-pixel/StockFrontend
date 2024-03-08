import { alertTypes } from '@/utils/enums'
import React from 'react'

type propType = {
    message: string
    type: alertTypes
}

function Toast({ message, type }: propType) {
  return (
    <div className="toast toast-center toast-top" style={{zIndex: 20}}>
        <div className={`alert ${type}`}>
            <span>{ message }</span>
        </div>
    </div>
  )
}

export default Toast