import * as React from 'react';

export interface IAppProps {
}

export default class App extends React.Component<IAppProps> {
  public render() {
    return (
      <div>
        
      </div>
    );
  }
}
import React, { Component } from 'react'

type Props = {}

type State = {}

export default class Demo00 extends Component<Props, State> {
  state = {}

  render() {
    return (
      <div>Demo00</div>
    )
  }
}