<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{ msg: string }>(),{
    msg:' world'
})
type MessageType =  "" | "success" | "warning" | "info" | "error";
const acceptParams = (msg:MessageType)=>{
    // console.log('acceptParams')
    console.log(msg)
}
defineExpose({
    acceptParams
})
</script>

<template>
<h5>hello{{ msg }}</h5>
</template>

<style scoped>

</style>
