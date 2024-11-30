import { View, Text } from 'react-native'
import React, { useState } from 'react'

export default function HocFun() {
    const [count, setCount] = useState(0);
    const prevState = count;
    // setCount(count + 1);

    return (
        <View>
            <Text>Count:{prevState}</Text>
            <Text>Previous State: {count}</Text>
            <Text onPress={()=>{setCount(count + 1);}}>press</Text>

        </View>
    )
}

// 在渲染之前修改组件
const originalRender = HocFun.prototype.render;
HocFun.prototype.render = function (){
    console.log('Render was intercepted!');
    return originalRender.call(this)
}