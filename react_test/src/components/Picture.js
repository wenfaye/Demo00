import React from 'react'

export default function Picture() {
  return (
    <picture>
        <source srcSet='https://thumbnails.libretro.com/Nintendo%20-%20Nintendo%20Entertainment%20System/Named_Boxarts/Daikoukai%20Jidai%20%28Japan%29.png' media='(max-width:734px)'/>
        <source srcSet='https://www.gematsu.com/wp-content/uploads/2022/11/Game-Page-Featured_Uncharted-Waters-Origin-Inits.jpg' media='(max-width:1068px)'/>
        <img src='https://avatars.mds.yandex.net/i?id=5538f71adb6cfe02e005f2565fb1a91e5bc84202-5257484-images-thumbs&n=13'/>
    </picture>
  )
}
