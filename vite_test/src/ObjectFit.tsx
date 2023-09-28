import React from 'react'
import src1 from './assets/beauty_1619153395985-scaled.jpg'
import src2 from './assets/DSC_6148-scaled.jpg'

type Props = {}

const ObjectFit = (props: Props) => {
    return (
        <>
            <img src={src1} className='objfit' />
            <img src={src2} className='objfit' />
        </>
    )
}

export default ObjectFit