<script setup lang="ts">
import { ref,computed } from 'vue'
import ImportExcel from './ImportExcel.vue'
import { useUserStore } from '../stores/modules/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

const { token } = storeToRefs(userStore);
const dialogRef = ref<InstanceType<typeof ImportExcel>>(null);
const userName = computed(()=> userStore.userInfo.name);

const handleTestRef = ()=>{
    dialogRef.value?.acceptParams('test');
}

const handleTestStore = ()=>{
    userStore.setToken('demo2');
}



</script>

<template>
    <ImportExcel ref="dialogRef" />
    <button @click="handleTestRef">测试ref</button>
    <button @click="handleTestStore">测试修改store</button>
    {{ token }}
    <div>{{ userName }}</div>
</template>

<style scoped>
</style>
