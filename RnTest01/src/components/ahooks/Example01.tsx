import React,{useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useMount, useInterval,useTimeout,useUpdateEffect } from 'ahooks'

const Example01 = () => {
    // useMount(() => {
    //     console.log('Example01 useMount')
    // })

    const [count, setCount] = useState(0);
    const [num, setNum] = useState(0);
    const [updateEffectCount, setUpdateEffectCount] = useState(0);

    const clear = useInterval(() => {
        setCount(count + 1)
    }, 1000)

    useTimeout(() => {
        setNum(num + 1)
    }, 3000)

    useUpdateEffect(() => {
        setUpdateEffectCount(updateEffectCount + 1)
    }, [num])

    return (
        <View style={styles.container}>
            <Text> Example01 </Text>
            <Text> count: {count} </Text>
            <Text onPress={clear}> clear </Text>
            <Text> num: {num} </Text>
            <Text> updateEffectCount: {updateEffectCount} </Text>
        </View>
    )
};


export default Example01;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // flexDirection: 'row',
        backgroundColor: 'rgba(59,130,246,.5)'
    }
})