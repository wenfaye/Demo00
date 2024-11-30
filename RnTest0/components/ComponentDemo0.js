import { StyleSheet, Text, View, ActivityIndicator, ImageBackground } from 'react-native'
import React from 'react'

export default function ComponentDemo0() {
  const size = 'large'
  const color = '#d3a237'
  const image = { uri: 'https://www.fendi.cn/pub/media/CMS/block/homepage/GW-W-ZHENjianbian-1%20.jpg' }
  const { container, imageBackground, imageBackgroundText } = styles;
  return (
    <View style={container}>
      <ActivityIndicator size={size} color={color} />
      <ImageBackground source={image} style={imageBackground}>
        <Text style={imageBackgroundText}>Inside</Text>
      </ImageBackground>
    </View>
  )
}
//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#b1d5c8'
  },
  imageBackground: {
    height: 200,
    width:'100%',
    display:'flex',
    justifyContent: 'center',
    resizeMode: 'cover'
  },
  imageBackgroundText: {
    color: '#fff',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#00000040'
  }
})