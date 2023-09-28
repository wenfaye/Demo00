import React from 'react'
import '../assets/1linelayouts.css'

export default function LayoutsPancake() {
    return (
        <>
            <div className="ex2">
                <div className="parent ">
                    <div className="box ">1</div>
                    <div className="box ">2</div>
                    <div className="box ">3</div>
                </div>
            </div>
            <div className="ex3">
                <div className="parent">
                    <div></div>
                    <div></div>
                </div>
            </div>

            <p className="title">煎饼堆</p>
            <div className="ex4">
                <div className="parent">
                    <div>header</div>
                    <div>content</div>
                    <div>foor</div>
                </div>
            </div>
        </>
    )
}
