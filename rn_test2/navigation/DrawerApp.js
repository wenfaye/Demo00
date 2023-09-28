import { Text, View,TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import {createDrawerNavigator,createAppContainer} from 'react-navigation'

class HomeScreen extends Component {
    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={this.props.navigation.openDrawer}>
            <Text>Open Drawer</Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Home</Text>
        </View>
      );
    }
  }
  
  class SettingsScreen extends Component {
    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={this.props.navigation.openDrawer}>
            <Text>Open Drawer</Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Settings</Text>
        </View>
      );
    }
  }
  
  const DrawerNavigator = createDrawerNavigator(
    {
      Home: HomeScreen,
      Settings: SettingsScreen,
    },
    {
      drawerBackgroundColor: 'rgba(255,255,255,.9)',
      contentOptions: {
        activeTintColor: '#fff',
        activeBackgroundColor: '#6b52ae',
      },
    }
  );
  
  export default DrawerNavigator;