'use client'
import Card from '@/app/common/Card'
import LineChart from '@/app/common/LineChart'
import { dailyData, days, long_months, monthlyData, short_months } from '@/utils/constants'
import React, { BaseSyntheticEvent, SyntheticEvent, useEffect, useState } from 'react'
import axios from '@/utils/axiosConfig'
import DatePicker from '@/app/common/MySelector'
import MySelector from '@/app/common/MySelector'

function Dashboard() {
    const baseDate = 2022
    const [data, setData] = useState(monthlyData)
    const [hLine, setHLine] = useState(Object.values(short_months))
    enum mode {
        Monthly,
        Yearly
    }
    const [tax, setTax] = useState('-')
    const [rev, setRev] = useState('-')
    const [sales, setSales] = useState('-')
    const [toggle, setToggle] = useState<mode>(mode.Monthly)
    const [dataMode, setDataMode] = useState('Monthly')
    let years:any = {}
    for(let i = 0; i < 28; i++) {years[i+""]=(i+2022)}
    const [selectedYear, setSelectedYear] = useState((new Date).getFullYear())
    const [selectedMonth, setSelectedMonth] = useState<number>((new Date()).getMonth())

    const getData = async () => {
        // const p1 = axios.get('/tax')
        // const p2 = axios.get('/revenue')
        const d = await axios.get(`/tax?monthIndex=${selectedMonth}&year=${selectedYear+baseDate}`)
        const s = await axios.get(`/sales?monthIndex=${selectedMonth}&year=${selectedYear+baseDate}`)
        const r = await axios.get(`/revenue?monthIndex=${selectedMonth}&year=${selectedYear+baseDate}`)
        setTax(d.data)
        setSales(s.data)
        setRev(r.data)
        // Promise.
    }
    useEffect(() => {
        console.log('ran')
        getData()
        if(toggle === mode.Monthly) {
            setDataMode('Monthly')
            setHLine(days)
            setData(dailyData)
        }
        else {
            setDataMode('Yearly')
            setHLine(Object.values(short_months))
            setData(monthlyData)
        }
    }, [toggle, selectedMonth, selectedYear])
    
    const handleMonthChange = (e: BaseSyntheticEvent) => {
        console.log(e.target.value)
        setSelectedMonth(e.target.value)
    }
    const handleYearChange = (e: BaseSyntheticEvent) => {
        const selectedYearValue = (+e.target.value) ;
        setSelectedYear(selectedYearValue);
    }
  return (
    <div className="p-4 bg-primary" style={{width: '100%'}}>
        <div className='grid grid-cols-3 gap-5'>
            <Card title='Sales' body={sales} />
            <Card title='Revenue' body={rev} />
            <Card title='Tax' body={tax} />
        </div>
        <div className='flex flex-row mt-5'>
            <div className='flex flex-row gap-2'>
                <MySelector options={years} defaultOp={2} handleChange={handleYearChange} />
                {
                    dataMode === 'Monthly' &&
                    <MySelector options={long_months} defaultOp={selectedMonth} handleChange={handleMonthChange} />
                }
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
        </div>
        <div className='bg-amber-50 rounded-xl mt-5'>
            <LineChart data={data} horizontalLabels={hLine} width={1200} />
        </div>
    </div>
  )
}

export default Dashboard