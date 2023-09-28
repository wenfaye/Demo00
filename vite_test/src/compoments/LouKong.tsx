import React from 'react'
import src1 from '../assets/DSC_6148-scaled.jpg'

type Props = {}

const LouKong = (props: Props) => {
  return (
    <>
      <div className='demo1'>
        <img src={src1} />
      </div>
      <p className="demo2">Array.prototype.every()</p></>
  )
}

export default LouKong