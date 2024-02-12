<template lang="">
    <div>
        <h5>我是home组件</h5>
        <ul>
            <li>
                <router-link to="/home/news">News</router-link>
            </li>
            <li>
                <router-link to="/home/message">Message</router-link>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name:'Home'
}
</script>
<style lang="">
    
</style>