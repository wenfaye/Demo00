import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function DetailsScreen2(props) {
    const { navigation } = props;
    const param1 = navigation.getParam('param1');
    const param2 = navigation.getParam('param2');
    return (
        <View style={styles.container}>
            <Text onPress={() => {
                navigation.navigate('Home', {
                    param3: 'param3',
                    param4: 'param4'
                })
            }}>DetailsScreen2</Text>
            <Text>{param1}</Text>
            <Text>{param2}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAE1CE'
    }
})