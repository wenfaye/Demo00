<template lang="">
    <div class="demo1">
        
    </div>
    <div class="wrap">
        <div class="pic-box">
            <img src="../assets/image/ts-ep2-logo.png" class='pic'/>
        </div>
    </div>
</template>
<script>
export default {
    name:'Matrix'
}
</script>
<style scoped>
    .demo1{
        width: 300px;
        height: 300px;
        border: 1px solid #da6d83;
        /* transform: matrix(0,0,0,0,0,0); */
        /* transform: matrix(1,0,0,2,0,0); */
        transform: matrix(1,0,0,2,30,200);
    }
    .wrap{
        width: 400px;
        height: 400px;
        display: flex;
        justify-content: right;
        align-items: end;
        /* justify-content: center;
        align-items: center; */
        border: 1px solid #ce93bf;
    }
    .pic-box{
        width: 200px;
        height: 200px;
        border: 1px solid #ce93bf;
    }
    .pic{
        width: 300;
        height: 260px;
        user-select: none;
    }
</style>