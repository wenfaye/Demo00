import React, { useEffect } from 'react'
import styles from './style.less'
import { useModel,history  } from 'umi'
import {Button} from 'antd'

export default function DecorationSkip() {

  const { initialState } = useModel('@@initialState')
  console.dir(initialState)

  const handleBtnPress = () => {
    // history.push('/CSSworld/CSS/colorLevel4')
    history.push('/CSSworld/JavaScript/GroupBy/test')
  }


  return (
    <>
      <div className={styles.tdsi}>hello world</div>
      <Button onClick={handleBtnPress}>测试路由</Button>
    </>
    // <div className={styles.tdsi}>{initialState}</div>
  )
}
