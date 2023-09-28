import { ScrollView, Text, View,Dimensions } from 'react-native'
import React, { useState } from 'react'

export default function MyScrollView(props) {
    const [colors, setColors] = useState(['red', 'orange', 'yellow', 'green', 'blue']);
    return (
        <ScrollView
            // horizontal={true} //水平滚动
            pagingEnabled={true} //滚动屏幕宽度（或高度）的整数倍
            showsVerticalScrollIndicator={false} //是否展示垂直滚动条
            showsHorizontalScrollIndicator={false} //是否展示水平滚动条
        // scrollEnabled={false} //是否可以滚动
        >
            {
                colors.map((color, index) => {
                    return (
                        <View key={index} style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: color }}>
                            <Text style={{ fontSize: 40 }}>{index}</Text>
                        </View>
                    )
                })
            }
            {/* <Text>1</Text>
            <Text>1</Text> */}
        </ScrollView>
    )
}

