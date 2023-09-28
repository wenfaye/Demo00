import React,{useReducer} from 'react'
import countReducer from './a_reducer'
import countContext from './context'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'


export default function CountProvider(props) {
   
    const {Provider} = countContext;
    const [state,dispatch] = useReducer(countReducer);
    // console.log(11,props.chlidren);
  return (
    <Provider value={{state,dispatch}}>
      <View style={styles.container}>
        <Text>{state}</Text>
        {props.children}
        </View>
    </Provider>
    // <View style={styles.container}></View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#369',
  }
})