import { StyleSheet, Text, View, StatusBar, SafeAreaView, Dimensions, Platform, TextInput,TouchableHighlight } from 'react-native'
import React,{useRef} from 'react'

export default function StatusBarDemo() {
    const { container, textStyle, text, input, btnContainer, btnText } = styles;
    const barRef = useRef();

    const testRefFun = () => {
       console.log(barRef.pushStackEntry);
    }
    return (
        <>
            <StatusBar
                barStyle="light-content" //控制状态栏文字颜色 light-content 或 dark-content
                backgroundColor="gray" //控制状态栏背景颜色
                // hidden //隐藏状态栏
                animated //过度动画
            //translucent//沉浸式状态栏
            ref={barRef}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={container}>
                    <Text style={textStyle}>hello,ReactNative!</Text>
                    <Text style={text}>当前窗口的宽为：{Dimensions.get('window').width}</Text>
                    <Text style={text}>当前窗口的高为：{Dimensions.get('window').height}</Text>
                    <Text style={text}>当前操作系统为：{Platform.OS}</Text>
                    <TextInput
                        keyboardType='numeric'
                        style={input}
                    />
                    <TouchableHighlight
                        activeOpacity={1}
                        style={styles.btnContainer}
                        underlayColor='#0af'
                        onPress={testRefFun}
                    >
                        <Text style={styles.btnText}>press me</Text>
                    </TouchableHighlight>
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#75c1c4',
        flex: 1,
        justifyContent: 'center'
    },
    textStyle: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    text: {
        fontSize: 20
    },
    input: {
        width: 300,
        height: 80,
        fontSize: 20,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: 'black'
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