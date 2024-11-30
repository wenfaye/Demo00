import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'

const FetchFun = () => {
  const [name, setName] = useState('michael');
  const [count, setCount] = useState(0);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    console.log('begin');
    return () => {
      console.log('end');
    }
  }, []);




  return (
    <View style={{ paddingTop: 100 }}>
      <Text>{name}</Text>
      <Text>{count}</Text>
      <Text onPress={() => { setCount(count + 1) }}>FetchFun</Text>
    </View>
  )
}

// 注意这个方法前面有async关键字
async function getMoviesFromApi() {
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

export default FetchFun