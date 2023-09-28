import { Text, StyleSheet, View, Button } from 'react-native'
import React, { Component } from 'react'
// import Hello from './Hello'

export default class HomeScreen extends Component {

  // static navigationOptions = {
  //   title: 'Home',
  //   headerRight: <Button
  //     onPress={this.goToDetails2}
  //     title="Info"
  //     color="#fff"
  //   />
  // };

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Home',
      headerRight: <Button
        onPress={() => {
          navigation.push('Details2', {
            param1: 'param1',
            param2: 'param2'
          })
        }}
        title="Info"
        color="#fff"
      />
    }
  }


  render() {
    const { navigation } = this.props;
    const param3 = navigation.getParam('param3');
    const param4 = navigation.getParam('param4');
    return (
      <View style={styles.container}>
        <Text>HomeScreen</Text>
        <Text>{param3}</Text>
        <Text>{param4}</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
        <Button
          title="Go to Details"
          onPress={() => {
            /* 1. Navigate to the Details route with params */
            this.props.navigation.navigate('Details', {
              itemId: 86,
              otherParam: 'anything you want here',
            });
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAE1CE'
  }
})