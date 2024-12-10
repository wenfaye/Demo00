import React from 'react';
import styles from './style.less'


/**
 * WidthExpand 组件，用于创建一个可扩展宽度的容器。
 * @param {Object} props - 组件的属性。
 * @returns {JSX.Element} - 渲染的组件。
 */
const WidthExpand = (props) => {
    return <div className={styles.scroller}>
        <ins></ins>
        <div style={{height:'400px'}}></div>
    </div>
}


export default WidthExpand;