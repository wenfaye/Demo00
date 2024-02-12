import React, { useEffect, useState } from 'react'
import './demo.css'

export default function LocalNav() {

    const [isSticking, setIsSticking] = useState(false);

    function windowScroll(e) {
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


    const className = isSticking ? 'localnav-background sticking' : 'localnav-background';
    return (
        <div className={className}>LocalNav</div>
    )
}
