<template lang="">
    <div>
        <p>{{num}}</p>
        <button @click="death">press</button>
        <button @click="add">press add</button>
    </div>
</template>
<script>
export default {
    name:'HelloWorld3',
    data(){
        return{
            num:0
        }
    },
    methods:{
        death(){
            this.$destroy() //vm还在，只是vm不管理root容器中的数据了，数据的监听也没了
			console.log(this)
        },
        add(){
            this.num += 1;
        }
    },
    beforeCreate(){
        console.log('--beforeCreate--');
    },
    created(){
        console.log('--created--');
    },
    beforeMount(){
        console.log('--beforeMount--');
    },
    mounted() {
        // this.timer = setInterval(()=>{
        //     this.num+=1;
        // },300)
        console.log('--mounted--');
    },
    beforeUpdate(){
        console.log('--beforeUpdate--');
    },
    updated() {
        console.log('--updated-');
    },
    beforeDestroy(){
        // clearInterval(this.timer);
        console.log('--beforeDestroy--');
    },
    destroyed() {
        console.log('--destroyed--');
    },
}
</script>
<style>
    
</style>