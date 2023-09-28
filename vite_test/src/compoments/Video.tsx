import React from 'react'
import './global.css'
import videoSrc from '../assets/video.62022e1b.mp4';
import {MemberEntity} from '../model'

type Props = {
    member:MemberEntity
}

const Video = (props: Props) => {
    const {member} = props;
    console.dir(member);
    return (
        <>
            <div className='container1'>
                <div className='sidebar'></div>
                <div className='main'></div>
            </div>
            <video id="video" autoPlay muted type="video/mp4" src={videoSrc} loop={true} ></video>
        </>


    )
}

export default Video