<template lang="">
    <div>
        <h2>欢迎来到{{school}}学习</h2>
        <button @click="show2(5,$event)">press</button>
        <p><a href="https://weibo.com/" @click.prevent="show3">点我提示：信息3 （阻止默认行为）</a></p>
    </div>
</template>
<script>
export default {
    name:'EventComponent',
    data(){
        return{
            school:'尚硅谷',
        }
    },
    methods: {
        show2(num,event){
            console.dir(event);
            console.log(num);
        },
        show3(event){
            console.dir(event);
        }
    },
}
</script>
<style>
    
</style>