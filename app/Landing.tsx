'use client'
import React from 'react'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {}
function Landing({}: Props) {
    const router = useRouter()
  useEffect(() => {
    router.push('/login')
  }, [])
  return (
    <div></div>
  )
}

export default Landing