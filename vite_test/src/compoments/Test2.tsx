import { connect } from 'react-redux'
import React, { Component } from 'react'

type Props = {}

type State = {
    parem1:number;
    parem2:number;
}

export class Test2 extends Component<Props, State> {
  state = {}

  render() {
    return (
      <div>Test2</div>
    )
  }
}

const mapStateToProps = (state:State) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Test2)