<template lang="">
    <div>
        <h5>我是detail3组件</h5>
        <ul>
            <li>{{id}}</li>
            <li>{{title}}</li>
            <li>{{content}}</li>
        </ul>
    </div>
</template>
<script>
export default {
    name:'Detail3',
    props:['id','title','content'],
    computed:{
        // id(){
        //     return this.$route.params.id
        // },
        // title(){
        //     return this.$route.query.title
        // },
        // content(){
        //     return this.$route.query.content
        // }
    }
}
</script>
<style lang="">
    
</style>