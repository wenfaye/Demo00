import { useState, useCallback } from 'react'

export default function counterModel() {
    // const [count, setCount] = useState(0)

    // const increment = useCallback(() => {
    //     setCount(count + 1)
    // }, [])

    // const decrement = useCallback(() => {
    //     setCount(count - 1)
    // }, [])

    // return {
    //     count,
    //     increment,
    //     decrement
    // }
    const [counter, setCounter] = useState(0);

    const increment = useCallback(() => setCounter((c) => c + 1), []);
    const decrement = useCallback(() => setCounter((c) => c - 1), []);
  
    return { counter, increment, decrement };
}







