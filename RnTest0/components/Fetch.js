import { Text, View } from 'react-native'
import React, { Component } from 'react'

export class Fetch extends Component {
    state = {
        movies:[]
    }

   async componentDidMount(){
        const movies = await this.getMoviesFromApi();
        this.setState({movies})
    }

  render() {
    const {movies} = this.state;
    console.log(movies.length);
    return (
      <View>
        <Text>Fetch</Text>
      </View>
    )
  }

   getMoviesFromApi= async () => {
    try {
      // 注意这里的await语句，其所在的函数必须有async关键字声明
      let response = await fetch(
        'https://facebook.github.io/react-native/movies.json'
      );
      let responseJson = await response.json();
      return responseJson.movies;
    } catch (error) {
      console.error(error);
    }
  }

}

export default Fetch