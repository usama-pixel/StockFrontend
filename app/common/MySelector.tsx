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
  console.log({defaultOp: options[defaultOp]})
  return (
    <select value={defaultOp} onChange={handleChange} className="select select-accent w-full max-w-xs">
        {
          Object.entries(options).map((objArr: any[], i: number) => {
            return (
            <option
              key={i}
              value={objArr[0]}
            >{objArr[1]}</option>
            )
          })
        }
    </select>
  )
}

export default MySelector