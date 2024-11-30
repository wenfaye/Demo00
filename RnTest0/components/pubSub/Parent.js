import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect,useState} from 'react'
import PubSub from 'pubsub-js'
import Child from './Child'

export default function Parent() {

    const [keyWord, setKeyWord] = useState('TheSims2');

    const  fetchData = async()=>{
        
        const val = 'Vue';
        const url = `https://api.github.com/search/repositories?q=${keyWord}&sort=stars`
        PubSub.publish('updateListData', {isFirst:false,isLoading:true});
        try{
            let response = await fetch(url)
            let result = await response.json()
            console.dir(result)
            PubSub.publish('updateListData',{isFirst:false,searchResult:result})
        }catch(error){
            PubSub.publish('updateListData',{isFirst:false,error:error.message})
        }

    }

    useEffect(() => {
        fetchData();

    //   return () => {
    //     second
    //   }
    }, [])
    

  return (
    <View>
      <Text>Parent</Text>
      <Child/>
    </View>
  )
}

const styles = StyleSheet.create({})