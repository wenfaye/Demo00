import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { useContext } from 'React'
import countContext from './context'
import { createIncrementAction, createDecrementAction } from './a_action'


export default function Count() {
    const { state, dispatch } = useContext(countContext);
 
    return (
        <View style={styles.container}>
            <Text>{state}</Text>
            <TouchableOpacity
                onPress={() => { dispatch(createIncrementAction(1)) }}
                activeOpacity={0.6} style={styles.btnContainer}><Text style={styles.btnText}>INCREMENT</Text></TouchableOpacity>
            <TouchableOpacity
                onPress={() => { dispatch(createDecrementAction(1)) }}
                activeOpacity={0.6} style={styles.btnContainer}><Text style={styles.btnText}>DECREMENT</Text></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20
    },
    btnContainer: {
        width: 300,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0585c5',
        borderRadius: 5,
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500'
    }
})