<template>
  <layout ref="newForm" form-title="新建类型" :fit="false">
    <form-layout-designer></form-layout-designer>
  </layout>
</template>

<script lang="ts" setup>
import Layout from '@/components/Layout/Form.vue';
import FormLayoutDesigner from '@/components/LayoutDesigner/PropertyPage.vue';
</script>
