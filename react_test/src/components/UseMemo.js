import React, { useState, useMemo } from 'react'

const SubItem = (props) => {
    // const text0 = '1'
    const {count,text} = props;
    const text0 = useMemo(() => {
        console.log('line5');
        return text
    }, [text])
    return <p>{text0}</p>
}

export default function UseMemo() {
    const [count, setCount] = useState(0);
    const [text, setText] = useState()
    return (
        <div>
            <p>UseMemo</p>
            <p>count:{count}</p>
            <p>text:{text}</p>
            <button onClick={()=>{setCount(count+1)}}>+</button>
            <button onClick={()=>{setCount(count-1)}}>-</button>
            <input type='text' onChange={(e)=>{setText(e.target.value)}}/>
            <SubItem count={count} text={text} />
        </div>
    )
}
