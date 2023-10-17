import React, { useEffect, useState } from 'react'
import '../global.css'
import logo from '../../assets/pic/ts-ep2-logo.png'

type Props = {}



export default function WillChange({ }: Props) {

    const [distance, setDistance] = useState(0);
    
    let curDistance = 0;
    function windowScroll(e: any) {
        const scrollTop = e.srcElement.scrollingElement.scrollTop;
        // console.log(scrollTop);
        if (scrollTop == 0) {
            setDistance(0);
        } else if (scrollTop <= 99) {
            if((scrollTop-curDistance)>=30){
                curDistance = scrollTop;
                setDistance(scrollTop);
            }else if((curDistance-scrollTop)>=30){
                curDistance = scrollTop;
                setDistance(scrollTop);
            }
           
        } else {
            setDistance(100)
        }
    
    }
    useEffect(() => {
        window.addEventListener('scroll', windowScroll)

        return () => {
            window.removeEventListener('scroll', windowScroll)
        }
    }, [])

    let contentStyle= { transform: 'matrix(1, 0, 0, 1, 0, 0)',opacity: 1}
    if (distance == 0) {
        contentStyle = { transform: 'matrix(1, 0, 0, 1, 0, 0)',opacity: 1}
    }
    else if (distance == 100) {
        contentStyle = { transform: 'matrix(.9, 0, 0, .9, 0, 0)',opacity: 0}
     }

    console.log(distance);
    return (
        <div className='wc-container'>
            <div className="wc-content" style={contentStyle}>
                <img src={logo} className='wc-content-logo' />
            </div>
            <div className="wc-explain"></div>
        </div>
    )
}