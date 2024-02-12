<template>
  <div id="viewWrap" class="view-wrap">
    <div id="formView" :class="{'form-view':true}" style="">
      <el-card class="box-card">
        {{formTitle}}
      </el-card>
      <el-card style="margin-top: 20px;">
        <slot></slot>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps({
  formTitle: { default: '' },
});
</script>
