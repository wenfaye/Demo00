<template lang="">
    <div class="demo1"></div>
    <div class="demo2"></div>
    <div class="demo3">
        <div class="demo4"></div>
    </div>
   
</template>
<script>
export default {
    name:'Margin'
    
}
</script>
<style>
.demo1{
    width:100px;
    height:100px;
    background-color: #ecd452;
    margin-bottom: 20px;
}
.demo2{
    width:100px;
    height:100px;
    background-color: #da6d83;
    margin-top: 10px;
}  
.demo3{
    width:200px;
    border: 1px #ecd452 solid;
    /* overflow: hidden; */
    /* display: flex; */
}  
.demo4{
    width:100px;
    height: 100px;
    border: 1px #da6d83 solid;
    /* float: left; */
    float: right;
} 
</style>