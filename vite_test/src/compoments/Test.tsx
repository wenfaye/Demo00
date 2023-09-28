import React from 'react'

type Props = {}

interface c{
    name:string,
    age:number
}


function fn1(a:object):object {
    console.log('fn2被调用了',a)
    return {}
}

const Test:Function = (props: Props) => {
    const a:number = 0
    const b:undefined = undefined;

  return (
    <div>Test</div>
  )
}



export interface IAppProps {
}

export default class App extends React.Component<IAppProps> {

name:string = ''

   render() {
    return (
      <div>
        
      </div>
    );
  }
}


