import React, { useRef, useState } from 'react'
import './style.less'
import pic1 from '@/assets/acmi__exv1gmpbb5m6_large.jpg'

const HoverEffect = () => {
    
    const [rxValue, setRxValue] = useState(0);
    const [ryValue, setRyValue] = useState(0);

    const rotateStyle = {
        '--rx': `${rxValue}deg`,
        '--ry': `${ryValue}deg`
    };

    const yRange = [-10, 10];
    const xRange = [-10, 10];

    const getRotateDeg = (range, value, length) => {
        return (value / length) * (range[1] - range[0]) + range[0];
    }
    

    const handleMouseMove = ({nativeEvent}) => {
        const { offsetX, offsetY } = nativeEvent;
        const { offsetWidth, offsetHeight } = cardRef.current;
        const ry = -getRotateDeg(yRange, offsetX, offsetHeight);
        const rx = getRotateDeg(xRange, offsetY, offsetWidth);
        setRxValue(rx);
        setRyValue(ry);
    }

    const handleMouseLeave = () => {
        setRxValue(0);
        setRyValue(0);
    }

    const cardRef = useRef(null)

    return (
        <div ref={cardRef} className='card' style={rotateStyle} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <img src={pic1} />
        </div>
    )
}

export default HoverEffect
