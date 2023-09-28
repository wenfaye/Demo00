import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import B from './B'
import { MyContext } from './context'

const { Provider } = MyContext;
export default function A() {
  const [name, setName] = useState('老刘');
  const [age, setAge] = useState(18);
  const [sex, setSex] = useState('女');
  return (
    <View style={styles.container1}>
      <Text>我是A组件</Text>
      <Text>我存储的是:{name}--{age}--{sex}</Text>
      <Provider value={{name,age,sex}}>
        <B />
      </Provider>

    </View>
  )
}

const styles = StyleSheet.create({
  container1: {
    width: 320,
    height: 320,
    backgroundColor: '#396',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
})