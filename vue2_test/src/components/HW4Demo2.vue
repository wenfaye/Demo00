<template lang="">
    <div>
        <button @click="sendData">press</button>
    </div>
</template>
<script>
export default {
    name:'HW4Demo2',
    methods: {
        sendData(){
            this.$bus.$emit('nice','Hello World');
        }
    },
}
</script>
<style lang="">
    
</style>