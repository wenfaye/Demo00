<template>
  <div class="footer" style="position: fixed;">
    <div class="pull-left col-lg-8" style=" width: calc(100% - 600px);"/>
    <div class="pull-right">
      <strong>{{footTitle}}</strong>
    </div>
  </div>
</template>

<script lang="ts" setup>
const footTitle = (window as any).footTitle || '恒维信息技术（上海）有限公司 © 2012-2018 Hengwei, all rights reserved.';
</script>
