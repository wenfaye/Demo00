<template lang="">
    <div>
        <h5>{{a}}</h5>
        <button @click="changeA">修改</button>
        <h5>{{b.a}}</h5>
        <button @click="changeB">修改</button>
        写一段CSS代码，蓝色渐变背景，圆角大小8px，高度40px，宽度120px
    </div>
</template>
<script>
import { ref,reactive,watch,onBeforeMount,onMounted,onBeforeUpdate,onUpdated,onBeforeUnmount,onUnmounted } from 'vue'
export default {
    name:'Temp00',
    setup(props) {
        // console.log(props);
        const a = ref(0);
        const b = reactive({
            a:100,
            c:-1
        })

        watch([a,b],(nv,ov)=>{
            console.log('sum的值或者msg的值发生变化了');
            console.log(`newValue:${nv}, oldValue:${ov}`);
        })

        const changeA = ()=>{
            a.value += 1
        }
        const changeB = ()=>{
            b.a +=2;
        }

        onBeforeMount(() => {
            console.log('-----onBeforeMount----')
        }),
        onMounted(() => {
            console.log('-----onMounted----')
        }),
        onBeforeUpdate(() => {
            console.log('-----onBeforeUpdate----')
        }),
        onUpdated(() => {
            console.log('-----onUpdated----')
        }),
        onBeforeUnmount(() => {
            console.log('-----onBeforeUnmount----')
        }),
        onUnmounted(() => {
            console.log('-----onUnmounted----')
        })
        console.log('-----setup----')

        return{
            a,
            b,
            changeA,
            changeB,
        }
    }
}
</script>
<style lang="">
    
</style>