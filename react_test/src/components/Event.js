import React from 'react'
import hello from './hello.module.css'
import picSrc from '../img/a61c6e123fac861a4f7e6d0b929b6e.jpg'

export const Event = () => {
    let moveFlag = true;
    const test = (event) => {

        if (moveFlag) {
            moveFlag = false;
            console.dir(event)
            setTimeout(() => {
                moveFlag = true;
            }, 2000)
        }

    }

    return (
        <>
            <wavy></wavy>
            <div className={hello.demo2Wrap}>
                <div className={hello.demo2}></div>
            </div>
            <div className={hello.demo1Wrap}>
                <div className={hello.demo1} onMouseMove={test}>Event</div>
            </div>
            {/* 测试filter */}
            <img src={picSrc} className={hello.filterTest} />
            <div className={hello.contentDemoWrap}>
                <div className={hello.contentDemo}></div>
            </div>
        </>

    )
    // Demo02/react_test/src/img/a61c6e123fac861a4f7e6d0b929b6e.jpg
}
