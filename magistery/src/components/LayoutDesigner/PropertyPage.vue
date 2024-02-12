<template>
  <span>
    <el-form ref="thisForm" :model="thisData" label-width="150px">
      <el-space direction="vertical" fill style="width: 100%;">
        <el-card>
          <template #header>
            <div class="el-card-header">
              <span>基本属性</span>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="组件名">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="页面标题">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注">
                <el-input type="textarea" :rows="3"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <template #header>
            <div class="el-card-header">
              <span>表单</span>
            </div>
          </template>
          <form-builder ref="fb" v-bind:options="builderOptions"></form-builder>
        </el-card>
        <el-card>
          <template #header>
            <div class="el-card-header">
              <span>数据源</span>
            </div>
          </template>
          <el-tabs type="card">
            <el-tab-pane label="表单填充">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="请求方法"  :label-width="100">
                    <el-select value="get" style="width: 100%">
                      <el-option value="get" label="GET"></el-option>
                      <el-option value="post" label="POST"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="请求Url"  :label-width="100">
                    <el-input></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="表单提交">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="请求方法"  :label-width="100">
                    <el-select value="get" style="width: 100%">
                      <el-option value="post" label="POST"></el-option>
                      <el-option value="put" label="PUT"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="请求Url"  :label-width="100">
                    <el-input></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-card>
          <el-button type="primary" @click="submitData()">确定</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-card>
      </el-space>
    </el-form>
  </span>
</template>

<script lang="ts" setup>
import 'bootstrap/dist/css/bootstrap.css';
import 'formiojs/dist/formio.full.css';
import { reactive, ref } from 'vue';
import { FormBuilder } from '@formio/vue';
import FormioI18n from '@/language/formio.ts';

const fb = ref(null);
const thisType = ref('1-1');
const thisData = reactive({});

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
  },
  language: 'zh',
  i18n: FormioI18n,
});

const submitData = () => {};
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
