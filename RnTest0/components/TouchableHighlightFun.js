import { StyleSheet, Text, View,TouchableHighlight,
NativeModules,TextInput,Image } from 'react-native'
import React from 'react'

export default function TouchableHighlightFun(props) {
  const {pressFun} = props
  return (
    <View style={{paddingTop:30,alignItems:'center'}}>
              <Image
          source={{
            uri: 'https://reactnative.dev/docs/assets/p_cat2.png',
          }}
          style={{ width: 200, height: 200 }}
        />
     
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          paddingLeft:5,
          width:300
        }}
        defaultValue="You can type in me"
      />
    <TouchableHighlight
    activeOpacity={1}
    style={styles.btnContainer}
    underlayColor='#0af'
    onPress={pressFun}
    >
      <Text style={styles.btnText}>press me</Text>
    </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
    btnContainer:{
        width:300,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#0585c5',
        borderRadius:5,
    },
    btnText:{
      color:'#fff',
      fontSize:16,
      fontWeight:'500'
    }

})