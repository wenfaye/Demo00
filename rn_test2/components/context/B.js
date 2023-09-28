import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import C from './C'

export default function B() {
  return (
    <View style={styles.container1}>
      <Text>B</Text>
      <C/>
    </View>
  )
}

const styles = StyleSheet.create({
    container1:{
        width:200,
        height:200,
        backgroundColor:'#ffffff20',
        justifyContent: 'center',
        alignItems:'center'
    }
})