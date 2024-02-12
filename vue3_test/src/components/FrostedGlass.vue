<template lang="">
    <div class="wrap">
        <div class="box">
            <p>如果仅有一个数值被给定，这个数值将作为宽度值大小，高度值将被设定为 auto。</p>
            <p>如果仅有一个数值被给定，这个数值将作为宽度值大小，高度值将被设定为 auto。</p>
            <p>如果仅有一个数值被给定，这个数值将作为宽度值大小，高度值将被设定为 auto。</p>
            <p>如果仅有一个数值被给定，这个数值将作为宽度值大小，高度值将被设定为 auto。</p>
    </div>
    </div>
</template>
<script>
export default {
    name:'FrostedGlass',
    setup(props) {
        
    }
}
</script>
<style scoped>
.wrap{
    width: 100vw;
    display: flex;
    justify-content: center;
    /* align-items: center; */
    height: 100vh;
    background: url(../assets/image/T1agliXeXkXXXXXXXX.png) no-repeat;
}
.box{
    width: 600px;
    height: 300px;
    padding: 30px;
    margin-top: 60px;
    line-height: 2;
    /* background-color: #fff;
    border-radius: 10px;
    filter: blur(20px); */
    position: relative;
    z-index: 0;
    /* backdrop-filter: blur(120px) brightness(15); */
    background: rgba(255, 255, 255, .9);
    @supports(backdrop-filter: blur(120px) brightness(15)){
        backdrop-filter: blur(120px) brightness(15);
        background: rgba(255, 255, 255, .3);
    }
}
/* .box::after{
    content: "";
    backdrop-filter: blur(120px) brightness(15);
    border-radius: 10px;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top:0;
    z-index: -1;

} */
    
</style>