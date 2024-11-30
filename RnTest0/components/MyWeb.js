import { View, Text,WebView } from 'react-native'
import React from 'react'

const MyWeb = () => {
  return (
   <WebView
   source={{uri:'https://ds.alipay.com/?from=pc'}}
   style={{marginTop:20}}
   />
  )
}

export default MyWeb