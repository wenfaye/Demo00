<template lang="">
    <div>
        <p>{{title}}</p>
        <h6>类目1</h6>
        <slot name="cate1"></slot>
        <h6>类目2</h6>
        <slot name="cate2"></slot>
        <h6>类目3</h6>
        <slot></slot>
        <h6>类目4</h6>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name:'SlotComponent',
    props:['title']
}
</script>
<style>
    
</style>