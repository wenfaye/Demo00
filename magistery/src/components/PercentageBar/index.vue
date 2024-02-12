<template>
  <el-progress :percentage="props.params.value" color='green'></el-progress>
</template>

<script lang="ts" setup>
import { defineProps, defineExpose, defineEmits, reactive, ref } from 'vue';

defineProps({
  params: { default: { value: 0 }},
});
</script>
