'use client'
import Card from '@/app/common/Card'
import LineChart from '@/app/common/LineChart'
import { dailyData, days, monthlyData, months } from '@/utils/constants'
import React, { useEffect, useState } from 'react'

function Dashboard() {
    const [data, setData] = useState(monthlyData)
    const [hLine, setHLine] = useState(months)
    enum mode {
        Monthly,
        Yearly
    }

    const [toggle, setToggle] = useState<mode>(mode.Monthly)
    const [dataMode, setDataMode] = useState('Monthly')
    useEffect(() => {
        if(toggle === mode.Monthly) {
            setDataMode('Monthly')
            setHLine(days)
            setData(dailyData)
        }
        else {
            setDataMode('Yearly')
            setHLine(months)
            setData(monthlyData)
        }
    }, [toggle])
  return (
    <div className="p-4 bg-primary" style={{width: '100%'}}>
        <div className='grid grid-cols-3 gap-5'>
            <Card title='Sales' body='2020010' />
            <Card title='Revenue' body='30100000' />
            <Card title='Tax' body='891919' />
        </div>
        <div className='mt-5 flex gap-2 ml-auto w-fit'>
            <p>{dataMode}</p>
            <input
                type="checkbox"
                className="toggle [--tglbg:white] bg-blue-500 hover:bg-blue-700 border-blue-500"
                checked={toggle === mode.Monthly ? true: false}
                onChange={() => {
                    setToggle(prev => prev === mode.Monthly ? mode.Yearly: mode.Monthly)
                }}
            />
        </div>
        <div className='bg-amber-50 rounded-xl mt-5'>
            <LineChart data={data} horizontalLabels={hLine} width={1200} />
        </div>
    </div>
  )
}

export default Dashboard