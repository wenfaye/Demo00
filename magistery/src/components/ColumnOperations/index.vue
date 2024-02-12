<template>
  <span>
    <el-button v-for="(btn, j) in params.operations" :key="j" :type="btn.btn_type ? btn.btn_type : 'default'" :icon="btn.icon">{{btn.label}}</el-button>
  </span>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  params: { default: { operations: 0 }},
});
</script>
