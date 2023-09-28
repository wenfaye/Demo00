import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useContext } from "react"
import { UserContextProvider, UserContext } from './UserContext'

export default function Example() {
  return (
    <UserContextProvider>
      <Header />
      <Content />
      <Footer />
    </UserContextProvider>
  )
}

const Header = () => {
  const { userInfo, isAuth, login, logout } = useContext(UserContext);
  return <View style={styles.headContainer}>
    {isAuth ?
      <>
        <Text>你好 {userInfo.username}</Text>
        <TouchableOpacity
        onPress={logout}
        activeOpacity={0.6} style={styles.btnContainer}><Text style={styles.btnText}>登出</Text></TouchableOpacity>
      </> :
      <>
              <TouchableOpacity
        onPress={login}
        activeOpacity={0.6} style={styles.btnContainer}><Text style={styles.btnText}>登录</Text></TouchableOpacity>
      </>}
  </View>
}
const Content = () => {
  const { userInfo } = useContext(UserContext);
  return <View><Text>主体  {userInfo?.username}</Text></View>
}
const Footer = () => {
  return <View><Text>页尾</Text></View>
}

const styles = StyleSheet.create({
  headContainer:{
    marginTop:20
  },
  btnContainer: {
    width: 300,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0585c5',
    borderRadius: 5,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  }
})