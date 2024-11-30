import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {MyContext} from './context'
const {Consumer} = MyContext;

export default function C() {
  return (
    <View style={styles.container1}>
      <Text>我是C组件</Text>
      <Consumer>
        {
          ({name,age,sex})=><Text>我收到B给我的:{name}--{age}--{sex}</Text>
        }
      </Consumer>
    </View>
  )
}

const styles = StyleSheet.create({
    container1:{
        width:100,
        height:100,
        backgroundColor:'#369'
    }
})