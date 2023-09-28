// In App.js in a new project

import React from 'react';

import { createStackNavigator } from 'react-navigation';

import DetailsScreen from './DetailsScreen'
import DetailsScreen2 from './DetailsScreen2'
import HomeScreen from './HomeScreen'

export default createStackNavigator({
  Home: HomeScreen,
  Details: DetailsScreen,
  Details2:DetailsScreen2,
},
// {
//     mode: 'modal',
//     headerMode: 'none',
// },

  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
    // mode: 'modal',
    // headerMode: 'none',
    headerBackTitleVisible:false,
  });