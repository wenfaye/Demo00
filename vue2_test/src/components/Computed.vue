<template lang="">
    <div>
        姓：<input type="text" v-model="firstName"> <br/><br/>
			名：<input type="text" v-model="lastName"><br/><br/>
			<span>全名:{{fullName}}</span><br/><br/>
			<span>全名:{{fullName}}</span><br/><br/>
			全名: <input type="text" v-model="fullName">

            <div class="wrap"></div>

    </div>

    
</template>
<script>
export default {
    name: 'computedComponent',
    data() {
        return {
            firstName: '张',
            lastName: '三',
        }
    },
    computed:{
        fullName(){
            return this.firstName +'-'+ this.lastName;
        }
    }
}
</script>
<style>
   .wrap{
    width: 169px;
    height: 169px;
    margin-top: 10px;
    background: url(../assets/pic/00.png) no-repeat;
    background-size: cover;
    position: relative;
   } 
   .wrap::after{
    content: '';
    position: absolute;
    top:0;
    left: 0;
    width: 169px;
    height: 169px;
    background: url(../assets/pic/03.png) no-repeat;
    background-size: cover;
    mask: linear-gradient(90deg,#000 35%,transparent)
   }
</style>