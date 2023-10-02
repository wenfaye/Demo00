import React from 'react'
import '../../assets/diagonal.css'


type Props = {}

export default function diagonal({}: Props) {
  return (
    <div className='diagonal-container'>
        <div></div>
        <div className='diagonal'></div>
        <div className='footer'>
            <h4>Speakers</h4>
        </div>
    </div>
  )
}