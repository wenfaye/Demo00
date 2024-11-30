import { StyleSheet, Text, View, ScrollView,Platform } from 'react-native'
import React,{useEffect} from 'react'

export default function ScrollViewDemo() {

    const instructions = Platform.select({
        ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
        android:
          'Double tap R on your keyboard to reload,\n' +
          'Shake or press menu button for dev menu',
      });
      const [sum,setSum] = React.useState(0);



    return (
        // <ScrollView style={styles.container}>
        <ScrollView contentContainerStyle={styles.container}
        horizontal={false}>
              {/* <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
        <Text style={styles.instructions}>{sum}</Text>
      </View> */}
      </ScrollView>
    )


}

const styles = StyleSheet.create({
    
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#369',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });