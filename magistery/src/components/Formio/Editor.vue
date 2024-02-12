<template>
  <form-builder ref="fb" v-bind:options="builderOptions"></form-builder>
</template>

<script lang="ts" setup>
import 'bootstrap/dist/css/bootstrap.css';
import 'formiojs/dist/formio.full.css';
import { reactive } from 'vue';
import { FormBuilder } from '@formio/vue';
import FormioI18n from '@/language/formio.ts';

const builderOptions = reactive({
  enableButtons: {
    copy: false,
    paste: false,
    editJson: true,
  },
  builder: {
    custom: {
      title: '属性',
      default: true,
      weight: 0,
      components: {
        name: { icon: 'facebook', title: '名称', schema: { key: 'name', type: 'textfield', label: '名称' }},
        description: { icon: 'facebook', title: '备注', schema: { key: 'description', type: 'textfield', label: '备注' }},
        manu: { icon: 'facebook', title: '厂商', schema: { key: 'manu', type: 'textfield', label: '厂商' }},
        model: { icon: 'facebook', title: '型号', schema: { key: 'model', type: 'textfield', label: '型号' }},
      },
    },
    basic: {
      default: false,
      title: '基本组件',
    },
    advanced: {
      title: '高级组件',
    },
    layout: {
      title: '布局',
    },
    premium: {
      title: '附加组件',
    },
  },
  language: 'zh',
  i18n: FormioI18n,
});
</script>

<style>
  .btn {
    padding-top:2px;
    padding-bottom:3px;
  }

  .navbar {
    padding: 0;
  }

  .nav, .navbar {
    display: block;
  }

  .navbar-default {
    background-color: transparent;
  }

  .nav > li {
    display: inline-block;
  }

  .nav > li > a {
    padding-top: 18px;
    padding-bottom: 18px;
  }

  #side-menu.nav  > li {
    display: block;
  }

  #side-menu.nav > li > a {
    padding-top: 14px;
    padding-bottom: 14px;
    padding-left:0;
  }

  #app #side-menu.nav .landing_link > a {
    padding-left: 20px;
  }
</style>
