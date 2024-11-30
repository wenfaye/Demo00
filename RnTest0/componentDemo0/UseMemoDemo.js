import { StyleSheet, Text, View, Button } from 'react-native'
import React, { useState,useMemo } from 'react'

export default function UseMemoDemo() {
    const { s_container, s_text } = styles;
    const [a, setA] = useState(0)
    const [b, setB] = useState(10)
    return (
        <View style={s_container}>
            <Text style={s_text}>UseMemoDemo</Text>
            <Button title='a++' onPress={() => { setA(a + 1) }} />
            <Button title='b++' onPress={() => { setB(b + 1) }} />
            <Child a={a} b={b} />
        </View>
    )
}

function Child(props) {
    const { a, b } = props;
    const { s_container, s_text } = styles;

    // const processA = (a)=>{
    //     console.log('开始处理A');
    //     return `A:${a}`
    // }
    
    let showText = null
    const processA = (a)=>{
        useMemo(() => {
            console.log('开始处理A');
            // return 
            showText = `A:${a}`
        }, [a])
    }
    processA(a)
    
    return (
        <>
            <Text style={s_text}>{showText}</Text>
            <Text style={s_text}>{b}</Text>
        </>
    )

}

const styles = StyleSheet.create({
    s_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    s_text: {
        fontSize: 10
    }
})