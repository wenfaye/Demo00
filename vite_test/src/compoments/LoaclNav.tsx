import React, { useState, useEffect } from 'react'
import './global.css';

type Props = {
    children:any
}

const LoaclNav = (props: Props) => {
    const [isSticking, setIsSticking] = useState(false);
    function windowScroll(e:any) {
        const scrollTop = e.srcElement.scrollingElement.scrollTop;
        console.log(scrollTop);
        if (scrollTop >= 30) {
            setIsSticking(true)
        } else {
            setIsSticking(false)
        }

    }

    useEffect(() => {
        window.addEventListener('scroll', windowScroll)

        return () => {
            window.removeEventListener('scroll', windowScroll)
        }
    }, [])


    const nav = isSticking?<div className='localnav-background sticking'>{props.children}</div>:<div className='localnav-background'>{props.children}</div>;

    return (
        nav
    )
}

export default LoaclNav