<template lang="">
    <div>
        <p>
            <router-link to='/about'>About</router-link>
            <router-link to='/home'>Home</router-link>
        </p>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
export default {
    name:'Entrance'
}
</script>
<style lang="">
    
</style>