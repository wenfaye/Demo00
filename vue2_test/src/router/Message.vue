<template lang="">
    <div>
        <h5>我是message组件</h5>
        <ul>
            <li v-for="msg in massageArr" :key="msg.id">
                <router-link :to="`/home/message/detail/${msg.id}?title=${msg.title}&content=${msg.content}`">{{msg.title}}</router-link>
                <router-link 
                :to="{
                    name:'xiangqing',
                    param:{id:msg.id},
                    query:{
                        title:msg.title,
                        content:msg.content
                    }
                }"
                >{{msg.title}}</router-link>
                <router-link 
                :to="{
                    name:'xiangqing1',
                    param:{id:msg.id},
                    query:{
                        title:msg.title,
                        content:msg.content
                    }
                }"
                >{{msg.title}}</router-link>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name: 'Message',
    data() {
        return {
            massageArr: [
                { id: '001', title: '消息1', content: '爱抽烟' },
                { id: '002', title: '消息2', content: '爱喝酒' },
                { id: '003', title: '消息3', content: '爱打麻将' },
            ]
        }
    },
}
</script>
<style lang="">
    
</style>