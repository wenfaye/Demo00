import React from 'react';
import { useModel,useSnapshot } from 'umi';


const CounterActions = () => {
    const { counter,
        increment,
        decrement } = useModel('counterModel')
    return (
    <div>
        <div>{counter}</div>
        <button onClick={increment}>add by 1</button>
        <button onClick={decrement}>minus by 1</button>
    </div>);
}


export default CounterActions;