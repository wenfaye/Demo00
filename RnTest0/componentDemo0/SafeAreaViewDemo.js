import { StyleSheet, Text, View, SafeAreaView, StatusBar,TouchableOpacity,TextInput,Switch } from 'react-native'
import React,{useState} from 'react';


export default function SafeAreaViewDemo() {
	const { container, textStyle,btnContainer,btnText,input } = styles;

	let text0 = ''
	const logText = () => {
		console.log(text0);
	}

	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = ()=>setIsEnabled((previousState)=>!previousState)

	return (
		<SafeAreaView style={{ flex: 1 }}>
			{/* 状态栏 */}
			<StatusBar
				barStyle="light-content" //控制状态栏文字颜色 light-content 或 dark-content
				backgroundColor="#ffee6f" //控制状态栏颜色
				//  hidden //隐藏状态栏
				animated //过度动画
			//translucent//沉浸式状态栏
			/>
			<View style={container}>
				<Text style={textStyle}>SafeAreaViewDemo</Text>
				<Text
					style={{ fontSize: 20 }}//样式
					numberOfLines={2} //文本显示的函数，超出部分被....代替
					ellipsizeMode="middle" //省略号的位置
					// onPress={this.show} //手指按下的事件回调
					selectable={true} //文字是否可以长按选中
				>
					苦其心志，饿其体肤，空乏其身，行拂乱其所为。忘记本身就是一件不可能的事情，别妄想了。没有调查就没有发言权
				</Text>

				<TextInput style={input} onChangeText={(val)=>{text0=val}} keyboardType="numbers-and-punctuation" />
				<TouchableOpacity style={btnContainer} activeOpacity={.9} onPress={logText}>
					<Text style={btnText}>请点击</Text>
				</TouchableOpacity>

				<Switch
				value={isEnabled}
				onValueChange={toggleSwitch}
				// thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
				// trackColor={{ false: "#ffee6f", true: "#81b0ff" }}
				// ios_backgroundColor="#ffee6f"
				/>

			</View>
		</SafeAreaView>

	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'skyblue',
		flex: 1,
		// justifyContent:'center'
	},
	textStyle: {
		fontSize: 30,
		textAlign: 'center',
		fontWeight: 'bold'
	},
	input: {
		width: 300,
		height: 80,
		fontSize: 20,
		paddingLeft: 10,
		borderWidth: 1,
		borderColor: 'black',
		borderRadius:5
	},
	btnContainer:{
        width:300,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#0585c5',
        borderRadius:5,
		marginTop:6,
		marginBottom:6,
    },
    btnText:{
      color:'#fff',
      fontSize:16,
      fontWeight:'500'
    }
})