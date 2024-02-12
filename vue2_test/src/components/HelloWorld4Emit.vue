<template >
    <div>
        <input type="text" @keyup.enter="add">
    </div>
</template>
<script>
export default {
    name:'HelloWorld4Emit',
    methods: {
        add(){
            this.$emit('show-log','helloworld');
        }
    },
}
</script>
<style >
    
</style>