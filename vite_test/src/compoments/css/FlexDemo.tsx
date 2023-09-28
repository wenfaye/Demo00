import React from 'react'
import '../global.css'

type Props = {}

export default function FlexDemo({}: Props) {
  return (
    <div >
        <ul className='flex-content'>
            <li style={{height:'445px'}}>demo</li>
            <li>demo</li>
            <li>demo</li>
            <li>demo</li>
            <li>demo</li>
            <li>demo</li>
        </ul>
    </div>
  )
}