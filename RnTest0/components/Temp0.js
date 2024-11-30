import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale } from '../utils'

const Temp0 = () => {
  return (
    <View style={styles.container}>
      <View style={styles.view1}></View>
      <View style={styles.view2}></View>
    </View>
  )
}

export default Temp0

const styles = StyleSheet.create({
  container: {
    height: 375 * scale,
    flexDirection: 'row',
    
  },
  view1: {
    flex: 1,
    backgroundColor: '#666',
  },
  view2: {
    flex: 2,
    backgroundColor: '#888',
    
  }
})