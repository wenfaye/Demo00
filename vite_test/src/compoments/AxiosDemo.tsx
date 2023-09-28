import React, { Component } from 'react'
import axios from 'axios'
import { UserEntify } from '../model';
import AxiosDemoRow from './AxiosDemoRow'

type Props = {}

type State = {
  isLoading: boolean;
  err: String;
  users: UserEntify[]
}


export default class AxiosDemo extends Component<Props, State> {
  state = {
    isLoading: true,
    err: '',
    users: []
  }

  async componentDidMount() {
    const url = 'https://jsonplaceholder.typicode.com/users';
    try {
      const userResult = await axios.get(url);
      this.setState({
        isLoading: false,
        users: userResult.data
      })
    } catch (error: any) {
      this.setState({
        isLoading: false,
        err: error.message
      })
    }
  }

  render() {
    const { isLoading, err, users } = this.state;
    let content = null;

    if (isLoading) {
      content = <h2>Loading...</h2>
    } else if (err.length) {
      content = <h2 style={{ color: 'red' }}>{err}</h2>
    }
    else {
      // console.table(users);
      content = <ul>{
        users.map((user: UserEntify) =>
          <AxiosDemoRow user={user} key={user.id} showId={this.showId} />
        )
      }</ul>
    }

    return content
  }

  showId = (id: String) => {
    console.log(id);
    // return  `a${id}`
  }

}