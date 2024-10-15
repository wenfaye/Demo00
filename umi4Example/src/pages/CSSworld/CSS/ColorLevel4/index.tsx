import React, { useState } from 'react'
import styles from './style.less'
import { useModel } from "@umijs/max";
import {Button} from 'antd'
// umi4Example/src/pages/ts
export default function ColorLevel4() {

  const [val,setVal] = useState(0)
  const {user,user:{username}} = useModel('CSSworld.CSS.DecorationSkip.model')
  let a = 100

  const handleBtn1Click = () => {
    user.username = 'vite'
    console.log(user.username)
  }
  const handleBtn2Click = () => {
    a++
    console.log(a)
  }
  const handleBtn3Click = () => {
    setVal(val+1)
  }
  

  return (
    <>
    <div className={styles['level4-col1']}>
      <Button onClick={handleBtn1Click}>点击</Button>
      <Button onClick={handleBtn2Click}>点击</Button>
      <Button onClick={handleBtn3Click}>点击</Button>
    <p>{username}</p>
    </div>
    </>
  )
}
