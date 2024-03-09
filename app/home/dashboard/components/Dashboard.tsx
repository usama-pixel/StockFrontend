'use client'
import Card from '@/app/common/Card'
import LineChart from '@/app/common/LineChart'
import { dailyData, days, long_months, monthlyData, short_months } from '@/utils/constants'
import React, { BaseSyntheticEvent, SyntheticEvent, useEffect, useLayoutEffect, useState } from 'react'
import axios from '@/utils/axiosConfig'
import MySelector from '@/app/common/MySelector'
import { endOfMonth, getDate, parseISO } from 'date-fns'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { AxiosError } from 'axios'

function Dashboard() {
    const base_year = 2022
    const [data, setData] = useState<number[]>()
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
    const router = useRouter()
    useEffect(() => {
      if(!Cookies.get('token')) {
        // router.replace('/login')
        router.push('/login')
      }
    }, [])
    useEffect(() => {
        if(!data) return;
        console.log({selectedYear})
        if(toggle === mode.Yearly) {
            setHLine(Object.values(short_months))
            for(let i = data.length; i < Object.values(short_months).length; i++) {
                console.log('jessy',Object.values(short_months)[i])
            }
        }
    }, [toggle])
    const getData = async () => {
        try {
            const d = await axios.get(`/tax?monthIndex=${selectedMonth}&year=${+selectedYear}&mode=${toggle}`)
            const s = await axios.get(`/sales?monthIndex=${selectedMonth}&year=${+selectedYear}&mode=${toggle}`)
            const r = await axios.get(`/revenue?monthIndex=${selectedMonth}&year=${+selectedYear}&mode=${toggle}`)
            const p4 = await axios.get(`/datapoints?monthIndex=${selectedMonth}&year=${+selectedYear}&mode=${toggle}`)
            setTax(d.data)
            setSales(s.data)
            setRev(r.data)
            if(toggle == mode.Monthly) {
                const d: {[key: number]: number} = {}
                console.log({aa: p4?.data})
                p4?.data?.map(({sum, date}: {sum: number, date:string}) => {
                    console.log({sum, date})
                    const day = +date.split('-')[2]
                    if(!d[day])
                        return d[day] = sum
                    return d[day] += sum
                })
                const lastDay = endOfMonth(new Date(selectedYear, selectedMonth)).getDate()
                const tempHline: number[] = []
                for(let i = 1; i <= lastDay; i++) {
                    tempHline.push(i)
                }
                setHLine(tempHline)
                const temp: number[] = []
                for(let i = 0; i < lastDay; i++) {
                    if(d[i]) {
                        temp.push(d[i])
                        continue;
                    }
                    temp.push(0)
                }
                setData(temp)
            }
            else if(toggle === mode.Yearly) {
                const d: {[key: number]: number} = {}
                p4.data.map(({sum, date}: { sum: number, date: string }, i: number) => {
                    const month = +date.split('-')[1]
                    if(!d[month])
                        return d[month] = sum
                    return d[month] += sum
                })
                const temp: number[] = []
                for(let i = 0; i < 12; i++) {
                    if(d[i]) {
                        temp.push(d[i])
                        continue
                    }
                    temp.push(0)
                }
                setData(temp)
                for(let i = 0; i < 12; i++) {
                    if(i )
                    temp.push()
                }
                setHLine(Object.values(short_months))
            }
        // Promise.
        } catch(err: any) {
            if(err.response.status === 401) {
                router.push('/login')
                Cookies.remove('token')
            }
            console.log({err})
        }
    }
    useEffect(() => {
        if(!Cookies.get('token')) return
        try {
            getData()
        } catch(err) {
            console.log({err})
        }
        if(toggle === mode.Monthly) {
            setDataMode('Monthly')
        }
        else {
            setDataMode('Yearly')
        }
    }, [toggle, selectedMonth, selectedYear])
    
    const handleMonthChange = (e: BaseSyntheticEvent) => {
        setSelectedMonth(e.target.value)
    }

    const handleYearChange = (e: BaseSyntheticEvent) => {
        setSelectedYear(+e.target.value+base_year)
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