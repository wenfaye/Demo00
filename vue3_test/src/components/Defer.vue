<template>
    <div class="container">
        <!-- <img class="pic" src="../assets/image/ts2-sp9-logo.png"  v-for="n in 100"/> -->
       <div  v-for="n in 100">
        <img class="pic" src="../assets/image/ts2-sp9-logo.png" v-if="defer(n)" />
       </div>
       
    </div>
</template>
<script>
import useDefer from '../hook/useDefer'
export default {
    name:'Defer',
    setup(props) {
        const defer = useDefer();
        return{
            defer
        }
    }
}
</script>
<style>
    .container{
        display: grid;
        grid-template-columns: repeat(3,1fr);
    }
    .pic{
        width: 300px;
        height: 223px;
    }
</style>