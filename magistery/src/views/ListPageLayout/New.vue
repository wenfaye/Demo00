<template>
  <layout ref="newForm" form-title="新建类型" :fit="false">
    <list-layout-designer></list-layout-designer>
  </layout>
</template>

<script lang="ts" setup>
import Layout from '@/components/Layout/Form.vue';
import ListLayoutDesigner from '@/components/LayoutDesigner/ListPage.vue';
</script>
