import {
    StyleSheet, Text, View, StatusBar, Dimensions, Platform,
    Image, ImageBackground
} from 'react-native'
import React from 'react'

export default function App(props) {
    const { container, textStyle } = styles
    return (
        <>
            <StatusBar
                barStyle="light-content" //控制状态栏文字颜色 light-content 或 dark-content
                backgroundColor="#369" //控制状态栏背景颜色

            />
            <View style={container}>
                <Text style={textStyle}>StatusBar</Text>
                <Text style={styles.text}>当前窗口的宽为：{Dimensions.get('window').width}</Text>
                <Text style={styles.text}>当前窗口的高为：{Dimensions.get('window').height}</Text>
                <Text style={styles.text}>当前操作系统为：{Platform.OS}</Text>
                {/* 第一种：引入本地图片 */}
                {/* <Image
                    style={{ width: 200, height: 200 }}
                    resizeMode="center"
                    source={require('../assets/imgs/Vicky.jpg')}
                /> */}
                {/* <Image
                    style={{ width: 200, height: 100 }}
                    source={{ uri: 'http://img.zgzcw.com/zgzcw/matchCenter/league/images/20130218192828.jpg'}}
                /> */}
                {/* 图片背景--注意：必须给宽高 */}
                <ImageBackground
                    style={{ width: 200, height: 200,justifyContent: 'center' }}
                    source={require('../assets/imgs/Vicky.jpg')}
                >
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: 'red' }}>1227就业顺利</Text>
                </ImageBackground>
            </View>

        </>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'skyblue',
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
    }
})