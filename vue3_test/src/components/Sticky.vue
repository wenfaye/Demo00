<template lang="">
    <div class="promo"></div>
    <div class="warp">
        <div class="left">
            <nav></nav>
        </div>
        <div class="right">
            
        </div>
    </div>
</template>
<script>
export default {
    name: 'Sticky',
    setup() {

    }

}
</script>
<style scoped>
.promo{
    height: 30px;
    background-color: #b1d5c8;
}
.warp {
    display: flex
}

.left {
    position: relative;
    position: -webkit-sticky;
    position: sticky;
    /* z-index: 10000; */
    height: 100vh;
    background-color: #f3a694;
    top:0
}
nav{
    width: 100px;
}
.right {
    flex: 1;
    height: 1900px;
}
</style>
    
