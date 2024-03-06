import React, { BaseSyntheticEvent } from 'react'

type OptionsType = {
  [key: string]: string | number
}

type PropType = {
  options: OptionsType
  value: string | number,
  handleChange: (e: BaseSyntheticEvent) => void
}

function MySelector({ options, value, handleChange }: PropType) {
  console.log({value})
  return (
    <select value={value} onChange={handleChange} className="select select-accent w-full max-w-xs">
      {
        Object.entries(options).map((objArr: any[], i: number) => {
          // console.log(objArr[0], objArr[1])
          return (
          <option
            key={i}
            value={objArr[0]}
            // selected={defaultOp.toString() === objArr[1].toString()}
          >{objArr[1]}</option>
        )})
      }
    </select>
  )
}

export default MySelector