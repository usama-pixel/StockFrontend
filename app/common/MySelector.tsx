import React, { BaseSyntheticEvent } from 'react'

type OptionsType = {
  [key: string]: string | number
}

type PropType = {
  options: OptionsType
  defaultOp: string | number,
  handleChange: (e: BaseSyntheticEvent) => void
}

function MySelector({ options, defaultOp, handleChange }: PropType) {
  return (
    <select onChange={handleChange} className="select select-accent w-full max-w-xs">
        {
          Object.entries(options).map((objArr: any[]) => (
            <option
              value={objArr[0]}
              selected={defaultOp.toString() === objArr[1].toString()}
            >{objArr[1]}</option>
          ))
        }
    </select>
  )
}

export default MySelector