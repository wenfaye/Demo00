import React,{useEffect} from 'react'
import styles from './style.less'
import {useModel} from 'umi'

export default function DecorationSkip() {

  const { initialState } = useModel('@@initialState')
  console.dir(initialState)
  return (
    <div className={styles.tdsi}>hello world</div>
    // <div className={styles.tdsi}>{initialState}</div>
  )
}
