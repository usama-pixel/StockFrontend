'use client';
import React, { useState } from 'react';
import axios from '@/utils/axiosConfig';
import Toast from '@/app/common/Toast';
import { alertTypes } from '@/utils/enums';
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Signup() {
//     "firstname": "usama",
//   "lastname": "ali",
//   "email": "usamaali",
//   "password": "123"
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showToast, setShowToast] = useState(false)
    const [toastMsg, setToastMsg] = useState('')
    const [disabled, setDisabled] = useState(false)
    const router = useRouter()

    const handleLogin = () => {
        setDisabled(true)
        axios.post('/signup', {
            firstname: firstName,
            lastname: lastName,
            email,
            password
        }).then(res => {
            setDisabled(false)
            router.push('/login')
        }).catch(err => {
            setDisabled(false)
            setToastMsg(err?.response?.data?.message || 'Some Error Occured')
            setShowToast(true);
            setTimeout(() => {setShowToast(false)}, 10000)
            console.log(err)
        })
    }
  return (
    <div className='flex flex-col w-96 ml-auto mr-auto mt-52'>
        <input
            className='mb-5 p-2 rounded-lg'
            placeholder='First Name'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
        />
        <input
            className='mb-5 p-2 rounded-lg'
            placeholder='Last Name'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
        />
        <input
            className='mb-5 p-2 rounded-lg'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
        />
        <input
            className='mb-5 p-2 rounded-lg'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
        />
        <div className='flex flex-col gap-2'>
            <button onClick={handleLogin} disabled={disabled} className="btn btn-primary">Signup</button>
            {
                showToast &&
                <Toast message={toastMsg} type={alertTypes.error} />
            }
            <p>Already Have an account? <Link className='text-accent' href={'/login'}>Login</Link></p>
        </div>

    </div>
  )
}

export default Signup