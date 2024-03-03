'use client';
import React, { useState } from 'react';
import axios from '@/utils/axiosConfig';
import Toast from '@/app/common/Toast';
import { alertTypes } from '@/utils/enums';
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation';

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
    const router = useRouter()

    const handleLogin = () => {
        axios.post('/signup', {
            firstname: firstName,
            lastname: lastName,
            email,
            password
        }).then(res => {
            Cookie.set('token', res.data?.user?.token)
            router.push('/home')
            console.log('hah:',res.data)
        }).catch(err => {
            setShowToast(true);
            setTimeout(() => {setShowToast(false)}, 10000)
            setToastMsg(err?.response?.data?.message)
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
        <button onClick={handleLogin} className="btn btn-primary">Login</button>
        {
            showToast &&
            <Toast message={toastMsg} type={alertTypes.error} />
        }
    </div>
  )
}

export default Signup