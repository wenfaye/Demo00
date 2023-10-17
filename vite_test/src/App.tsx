import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {MemberEntity} from './model'
// import LouKong from './compoments/LouKong'
// import Example from './compoments/Filter'
// import Video from './compoments/Video'
// import AxiosDemo from './compoments/AxiosDemo'
// import Example from './compoments/LoaclNav'
// import Example from './compoments/ViteBackground'
// import Example from './compoments/Gradient'
// import Example from './compoments/LayoutsPancake'
// import Example from './compoments/PartnersCommunity'
// import Example from './compoments/css/FlexDemo'
// import Example from './compoments//Notification'
// import Example from './compoments/html/Figure'
// import Example from './compoments/css/Diagonal'
// import Example from './compoments/Globalfooter'
import Example from './compoments/css/WillChange'

function App() {

  const member:MemberEntity = {
    id: 4374977,
    login: "Nasdan",
    avatar_url: "https://avatars.githubusercontent.com/u/4374977?v=3"
  }

  return (
    // <Example>
    //   {/* <h3>hello world</h3> */}
    //   <AxiosDemo/>
    // </Example>
    <Example/>
    // <Video member={member}/>
    // <div className="App">
    //   <div>
    //     <a href="https://vitejs.dev" target="_blank">
    //       <img src="/vite.svg" className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://reactjs.org" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     {/* <LouKong/> */}
    //     <Filter/>
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </div>
  )
}

export default App
