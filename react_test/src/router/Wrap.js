import React from 'react'
import {NavLink,Route,Switch,Redirect} from 'react-router-dom'
import About from './about'
import Home from './home'

export default function Wrap() {
  return (
    <div>
      <NavLink to='/about'>About</NavLink>
      <NavLink to='/home'>Home</NavLink>
      <div>
        <Switch>
          <Route path="/about" component={About}/>
          <Route path="/home" component={Home}/>
          {/* <Redirect to="/about"/> */}
        </Switch>
      </div>
    </div>
  )
}
