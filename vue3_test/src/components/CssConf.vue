<template lang="">
    <div id="css-conf-wrap">
        <div class="shape-warp">
            <div class="shape-left"></div>
            <div class="shape-content"></div>
            <div class="shape-right"></div>
        </div>
        <div class="square"></div>
        <div class="clip-img-x">
    <div class="clip-shape"></div>
    <img src="../assets/image/687474703a2f2f692e696d6775722e636f6d2f503463525567442e706e67.png" class="clip-img">

</div>
    </div>
</template>
<script>
export default {
    name: 'CssConf'
}
</script>
<style>
.shape-left {
    /* float: left; */
    background-color: #da6d83;
    height: 300px;
    width: 100px;
}
.shape-content{
    background-color: #ffee6f;
    height: 300px;
   
}
.shape-right {
    /* float: right; */
    background-color: #d3a237;
    height: 300px;
    width: 100px;
}

.square {
    display: inline-block;
    padding: 300px;
    background-color: #fff;
    background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%), linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%);
    background-size: 16px 16px;
    background-position: 0 0, 8px 8px;
}

.clip-img-x {
    display: inline-block;
    overflow: hidden;
    position: relative;
}

.clip-img {
    width: 208px;
    height: 202px;
}

.clip-shape {
    width: 150px;
    height: 150px;
    outline: 9999px solid rgba(0, 0, 0, .5);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    cursor: move;
}</style>