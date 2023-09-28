import React from 'react'
import netlifysrc from '../assets/pic/netlify.svg'
import '../assets/partners_community.css'

type Props = {}

export default function PartnersCommunity({}: Props) {
  return (
    <div className='community-partners-container'>
        <a href="https://www.netlify.com/">
            <img src={netlifysrc} loading='lazy' /> 
        </a>
        <a href="https://www.netlify.com/">
            <img src={netlifysrc} loading='lazy' /> 
        </a>
        <a href="https://www.netlify.com/">
            <img src={netlifysrc} loading='lazy' /> 
        </a>
        <a href="https://www.netlify.com/">
            <img src={netlifysrc} loading='lazy' /> 
        </a>
        <a href="https://www.netlify.com/">
            <img src={netlifysrc} loading='lazy' /> 
        </a>
    </div>
  )
}