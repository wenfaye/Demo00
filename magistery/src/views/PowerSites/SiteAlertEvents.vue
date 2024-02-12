<template>
  <el-dialog v-model="dialogVisible" title="站点故障">
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
const dialogVisible = ref(false);

const show = (events: any) => {
  dialogVisible.value = true;
};
</script>
