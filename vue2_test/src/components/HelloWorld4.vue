<template >
    <div>
        <HelloWorld4Emit @show-log="showLog"/>
        <HW4Demo1/>
    <HW4Demo2/>
    </div>

</template>
<script>
import HelloWorld4Emit from './HelloWorld4Emit';
import HW4Demo1 from './HW4Demo1';
import HW4Demo2 from './HW4Demo2';
export default {
    name:'HelloWorld4',
    components:{HelloWorld4Emit,HW4Demo1,HW4Demo2},
    methods: {
        showLog(str){
            console.log('line13',str);
        }
    },
}
</script>
<style >
    
</style>