import React from 'react'
import './global.css'
import logo from '../assets/pic/ts-ep2-logo.png'

type Props = {}

export default function NotificationDemo({}: Props) {

const handleNotificatioin = async()=>{
    const permission = await Notification.requestPermission();
    if(permission=='granted'){
        const natification = new Notification('title',{
            body:'content',
            icon:'https://www.apple.com/legal/images/icon_internet_services/icon_internet_services_large.png'
        });
    }
}

  return (
    <div>
        <button onClick={handleNotificatioin}>Notification</button>
        <div className="frostedGlass-container">
          <img src={logo} loading='lazy' />
          <div className="frostedGlass-background"></div>
        </div>
    </div>
  )
}