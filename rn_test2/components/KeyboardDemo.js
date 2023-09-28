import { View, Text,Keyboard,TextInput,StyleSheet } from 'react-native'
import React,{useEffect} from 'react'

const KeyboardDemo = () => {

useEffect(()=>{
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    return ()=>{
        Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    }
},[])


const _keyboardDidShow = ()=>{console.log('Keyboard Shown')}
const _keyboardDidHide = ()=>{console.log('Keyboard Hidden')}

return <TextInput style={s.input} placeholder='Click here ...' onSubmitEditing={Keyboard.dismiss} />;
}

const s = StyleSheet.create({
    input:{
     margin:60,
     padding: 10,
     borderWidth: 0.5,
     borderRadius: 4,
     backgroundColor: "#fff"
    }
 })

export default KeyboardDemo