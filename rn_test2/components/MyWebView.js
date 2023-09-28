import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'

export default function MyWebView() {
    const {container} = styles;
    return <WebView source={{ uri: 'https://viteconf.org/' }} style={container} />;
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})