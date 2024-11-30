import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'

const ActivityIndicatorDemo = () => {
    return (
        <View>
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator />
                <ActivityIndicator size="large" animating={false}/>
                <ActivityIndicator size="small" color="#0000ff" />
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        </View>
    )
}

export default ActivityIndicatorDemo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingTop: 100
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
})