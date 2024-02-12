<template lang="">
    <div>
        <h2>我是Demo1组件</h2>
		<h3>收到的name是：{{name}}</h3>
    </div>
</template>
<script>
export default {
    name: 'HW4Demo1',
    data() {
        return {
            name:''
        }
    },
    methods: {
        test(str) {
            console.log('Demo1收到了数据：', str)
            this.name = str
        }
    },
    mounted() {
        this.$bus.$on('nice',this.test);
    },
    beforeDestroy(){
        this.$bus.$off('nice')
    }
}
</script>
<style lang="">
    
</style>