import React,{useState,useRef} from 'react'

export default function UseRef() {
    // const [count, setCount] = useState(0)
    const ref = useRef(0);
    const handleClick = () => {
        // setCount(count + 1);
        ref.current = ref.current + 1;
        alert('You clicked ' + ref.current + ' times!');
    }
    console.log(ref.current)
    return (
        <div>
            <button onClick={handleClick}>
                点击！
            </button>
        </div>
    )
}
