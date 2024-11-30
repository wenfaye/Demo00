/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */


import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Example from './components/Temp0'
// import Example from './components/KeyboardDemo'
// import MyWeb from './components/MyWeb'
// import {withLoading} from './components/hoc/hoc'
// import {Fetch} from './components/Fetch'
// import HocFun from './components/hoc/HocFun'
// import FetchFun from './components/FetchFun'
// import A from './components/context/A'
// import Example from './components/useContext/Example'
// import ReduceApp from './components/useReducer/ReduceApp'
// import Parent from './components/pubSub/Parent'
// import MyWebView from './components/MyWebView'
// import MyScrollView from './components/MyScrollView'
// import MyFlatList from './components/FlatList'
// import StatusBarDemo from './components/StatusBarDemo'
// import Demo0 from './components/ComponentDemo0'
// import Demo0 from './components/ApiDemo'
// import Example from './componentDemo0/ActivityIndicatorDemo'
// import UseMemoDemo from './componentDemo0/UseMemoDemo'
// import SafeAreaViewDemo from './componentDemo0/SafeAreaViewDemo'
// import RefreshControlDemo from './componentDemo0/RefreshControlDemo'
// import Example from './componentDemo0/ModalExample'
// import Example from './apiExample/AccessibilityInfoExample'
// import Example from './apiExample/AlertExample'
// import Example from './apiExample/AnimatedExample'
// import Example from './apiExample/DraggableView'
// import Example from './apiExample/AppStateExample'
// import Example from './apiExample/DimensionsExample'
// import Example from './apiExample/EasingExample'
// import Example from './apiExample/KeyboardExample'
// import Example from './apiExample/LayoutAnimationExample'
// import Example from './apiExample/PixelRatioExample'
// import Example from './apiExample/PlatformExample'
// import Example from './apiExample/PlatformColorExample'
// import Example from './apiExample/ShareExample'
// import Example from './apiExample/VibrationExample'
// import Example from './apiExample/UseColorSchemeExample'
// import Example from './apiExample/BackHandlerExample'
// import Example from './apiExample/ActionSheetIOSExample'
// import Example from './apiExample/ToastAndroidExample'
// import Example from './apiExample/SettingsExample'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

export default class App extends Component<Props> {
  render() {
    //渲染劫持
    // const FetchHoc = withLoading(Fetch);
    // return (
    //  <FetchHoc isLoading={true}/>
    // );
    return (
      <Example />
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
