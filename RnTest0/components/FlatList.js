import { View, Text, FlatList, Button } from 'react-native'
import React, { useState, useRef } from 'react'

export default function MyFlatList() {

    const personlist = [
        { id: 1, name: '老刘', age: 18 },
        { id: 2, name: '海峰', age: 20 },
        { id: 3, name: '刘渊', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },   
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
        { id: 4, name: '键哥', age: 80 },
    ];
    const [persons] = useState(personlist);
    const listRef = useRef();

    return (
        <FlatList
        ref={listRef}
        data={persons} //数据源
        // numColumns={4} //几列
        ListHeaderComponent={<Button onPress={()=>console.log(listRef.current)} title="点我去尾部"/> }
        ListFooterComponent={<Button title="我是尾部的按钮"/> }
        keyExtractor={({id})=> id.toString()}//用于生成key的
        renderItem={({item})=>{
            return (
                <Text style={{fontSize:20}}>
                    {item.id}{item.name}{item.age}
                </Text>
            )
        }}
    />
    )
}