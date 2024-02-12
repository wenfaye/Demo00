import React,{useReducer} from 'react'
import {Button} from 'antd'

const reducer = (state, action) => {
    const {num} = action.data;
    switch (action.type) {
      case "ADD":
        return state + num;
      case "DECREASE":
        return state - num;
      default:
        return state
    }
  }

export default function UseReducer(props) {
    const [state,dispatch] = useReducer(reducer,0);
  return (
    <div>
        {state}
      <Button onClick={()=>dispatch({type:'ADD',data:{num:2}})}>+</Button>
      <Button onClick={()=>dispatch({type:'DECREASE',data:{num:2}})}>-</Button>
    </div>
  )
}
