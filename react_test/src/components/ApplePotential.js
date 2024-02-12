import React from 'react'
import './demo.css'
import imgSrc from '../img/experiences_devices__ca7eoggbh2z6_large.jpeg'

export default function ApplePotential() {
    return (
        <div className='container1'>
            <div className='headline-content'>
                <h3 className='typography-headline'>Apps help unlock the full potential of your Apple devices.</h3>
            </div>
            <div className='picture-container'>
                <img src={imgSrc}/>
            </div>
        </div>
    )
}
