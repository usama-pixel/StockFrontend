'use client'
import Card from '@/app/common/Card'
import LineChart from '@/app/common/LineChart'
import { dailyData, days, long_months, monthlyData, short_months } from '@/utils/constants'
import React, { BaseSyntheticEvent, SyntheticEvent, useEffect, useState } from 'react'
import axios from '@/utils/axiosConfig'
import DatePicker from '@/app/common/MySelector'
import MySelector from '@/app/common/MySelector'
import { getDate, parseISO } from 'date-fns'

function Dashboard() {
    const base_year = 2022
    const [data, setData] = useState([])
    const [hLine, setHLine] = useState(Object.values(short_months))
    enum mode {
        Monthly,
        Yearly
    }
    const [tax, setTax] = useState('-')
    const [rev, setRev] = useState('-')
    const [sales, setSales] = useState('-')
    const [toggle, setToggle] = useState<mode>(mode.Monthly)
    useEffect(() => {
        console.log({TGselectedYear: selectedYear})
        console.log({toggle})
    }, [toggle])
    const [dataMode, setDataMode] = useState('Monthly')
    let years:any = {}
    for(let i = 0; i < 28; i++) {years[i+""]=(i+2022)}
    const [selectedYear, setSelectedYear] = useState((new Date).getFullYear())
    const [selectedMonth, setSelectedMonth] = useState<number>((new Date()).getMonth())

    const getData = async () => {
        // const p1 = axios.get('/tax')
        // const p2 = axios.get('/revenue')
        console.log({myMan: +selectedYear})
        const d = await axios.get(`/tax?monthIndex=${selectedMonth}&year=${+selectedYear}&mode=${toggle}`)
        const s = await axios.get(`/sales?monthIndex=${selectedMonth}&year=${+selectedYear}&mode=${toggle}`)
        const r = await axios.get(`/revenue?monthIndex=${selectedMonth}&year=${+selectedYear}&mode=${toggle}`)
        // console.log({selectedYearBro: selectedYear})
        const p4 = await axios.get(`/datapoints?monthIndex=${selectedMonth}&year=${+selectedYear}&mode=${toggle}`)
        setTax(d.data)
        setSales(s.data)
        setRev(r.data)
        console.log({p4: p4.data})
        let revisedHline
        if(toggle == mode.Monthly)
            revisedHline = p4.data.map(({ date }: {date: string}) => date?.split('-')[2])
        else
            revisedHline = (p4.data.map(({ date }: {date: string}) => +date?.split('-')[1]))?.map((m: number) => short_months[m] as string)
        console.log({revisedHline})
        setHLine(revisedHline)
        const revised_d = p4.data.map((dd: any) => {
            // const dateObject = parseISO(dd?.date);
            // const dayOfMonth = getDate(dd);
            return dd.sum
        })
        setData(revised_d)
        // console.log('p4',p4.data)
        // Promise.
    }
    useEffect(() => {
        console.log('ran')
        getData()
        if(toggle === mode.Monthly) {
            setDataMode('Monthly')
            // setHLine(days)
            // setData(dailyData)
        }
        else {
            setDataMode('Yearly')
            // setHLine(Object.values(short_months))
            // setData(monthlyData)
        }
    }, [toggle, selectedMonth, selectedYear])
    
    const handleMonthChange = (e: BaseSyntheticEvent) => {
        setSelectedMonth(e.target.value)
    }

    const handleYearChange = (e: BaseSyntheticEvent) => {
        setSelectedYear(+e.target.value+base_year)
    }
    // console.log({selectedYearBefore: selectedYear})
  return (
    <div className="p-4 bg-primary" style={{width: '100%'}}>
        <div className='grid grid-cols-3 gap-5'>
            <Card title='Sales' body={sales} />
            <Card title='Revenue' body={rev} />
            <Card title='Tax' body={tax} />
        </div>
        <div className='flex flex-row mt-5'>
            <div className='flex flex-row gap-2'>
                <MySelector options={years} value={selectedYear-2022} handleChange={handleYearChange} />
                {
                    dataMode === 'Monthly' &&
                    <MySelector options={long_months} value={selectedMonth} handleChange={handleMonthChange} />
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