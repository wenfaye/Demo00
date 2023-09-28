import { StyleSheet, Text, View,FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import PubSub from 'pubsub-js'

export default function Child() {

    const [searchResult, setSearchResult] = useState(null)

    useEffect(() => {
        PubSub.subscribe('updateListData', (_, stateObj) => {
            if (stateObj.searchResult) {
                setSearchResult(stateObj.searchResult)
            }
        })

        //   return () => {
        //     second
        //   }
    }, [])

    let content =
        <View>
            <Text>Child</Text>
        </View>

    if (searchResult && searchResult.items && searchResult.items.length) {
        content = <FlatList
        data = {searchResult.items}
        renderItem={({item})=>{
            return (
                <Text style={{fontSize:20}}>
                    {item.name}
                </Text>
            )
        }}
        keyExtractor = {(item)=>{
            item.id
        }}
        />
    }

    return content
}

const styles = StyleSheet.create({})