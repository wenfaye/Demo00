/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
// import App from './stack/App';
// import App from './navigation/DrawerApp';
// import App from './navigation/BottomTabApp';
// import App from './indexs/StatusBar'Demo02/rn_test2/navigation/BottomTabApp.js
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
