import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'

export default function ActivityIndicatorDemo() {
    const { container, text } = styles;
    return (
        <View style={container}>
            <Text style={text}>ActivityIndicatorDemo</Text>
            <ActivityIndicator size={'large'} color={'#d3a237'} animating={false} hidesWhenStopped={false} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#da6d8350',
        // flexDirection:'row'
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d3a237',
        marginBottom: 15
    }
})