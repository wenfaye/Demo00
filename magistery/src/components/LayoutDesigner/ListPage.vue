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
              <span>操作栏</span>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="20"><el-checkbox v-model="checkButtongs" label="功能按钮" size="large" /></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-space direction="horizontal" style="margin-left: 30px;">
                <el-alert title="添加" type="success" effect="dark" style="width: 100px; height:32px;" />
                <el-alert title="删除" type="error" effect="dark" style="width: 100px; height:32px;" />
                <el-alert title="编辑" type="info" effect="dark" style="width: 100px; height:32px;" />
                <el-link :underline="true" style="text-decoration:underline;margin-left:20px;" @click="showOpEditor()" type="success">添加按钮</el-link>
              </el-space>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20"><el-checkbox v-model="checkQuickSearch" label="快速搜索" size="large" /></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="搜索字段" :label-width="100">
                <el-select multiple v-model="selectedManus" style="width: 400px;" placeholder="请选择支持快速搜索的列">
                  <el-option label="名称" value="name" key="name"></el-option>
                  <el-option label="厂商" value="manufacturer" key="manufacturer"></el-option>
                  <el-option label="型号" value="model" key="model"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="显示方式" :label-width="100">
                <el-radio-group v-model="displayType">
                  <el-radio label="switch">下拉切换</el-radio>
                  <el-radio label="tile">平铺展开</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20"><el-checkbox v-model="checkAdvanceSearch" label="高级搜索" size="large" /></el-col>
          </el-row>
          <el-row :gutter="20" v-if="checkAdvanceSearch">
            <el-col :span="24" style="padding-left: 40px;">
              <form-editor></form-editor>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <template #header>
            <div class="el-card-header">
              <span>表格参数</span>
            </div>
          </template>
          <el-tabs type="card">
            <el-tab-pane label="数据列">
              <el-table border :data="columns">
                <el-table-column prop="label" label="标签"></el-table-column>
                <el-table-column prop="name" label="数据映射"></el-table-column>
                <el-table-column prop="visible" label="是否可见">
                  <template #default="scope">
                    <el-checkbox v-model="scope.row.visible"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="备注"></el-table-column>
                <el-table-column label="操作">
                  <template #default>
                    <el-button icon="top" size="small" />
                    <el-button icon="bottom" size="small" />
                    <el-button icon="setting" size="small" @click="showColumnEditor()" />
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" style="margin-top: 10px;" icon="plus" @click="showColumnEditor()">添加数据列</el-button>
            </el-tab-pane>
            <el-tab-pane label="操作列">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="位置" :label-width="100">
                    <el-select v-model="operationLocation" style="width: 90%;">
                      <el-option value="" label="无"></el-option>
                      <el-option value="firstColumn" label="第一列"></el-option>
                      <el-option value="lastColumn" label="最后一列"></el-option>
                      <el-option value="custom" label="指定位置"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="operationLocation">
                <el-col :span="24">
                  <el-form-item label="操作设置" :label-width="100">
                    <el-alert title="删除" type="error" effect="dark" style="width: 100px;height: 36px;margin-left: 10px;" />
                    <el-alert title="编辑" type="info" effect="dark" style="width: 100px;height: 36px;margin-left: 10px;" />
                    <el-link :underline="true" style="text-decoration:underline;margin-left:20px;" @click="showOpEditor()" type="success">添加按钮</el-link>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="其它设置">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="分页模式" :label-width="100">
                    <el-select v-model="pagination.mode" style="width: 90%;">
                      <el-option value="server" label="服务端分页"></el-option>
                      <el-option value="client" label="客户端分页"></el-option>
                      <el-option value="" label="无分页"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="树形表格显示" :label-width="100">
                    <el-checkbox v-model="isTreeTable"></el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="每页记录数" :label-width="100">
                    <el-select v-model="pagination.pageSize" style="width: 90%;">
                      <el-option :value="10" label="10"></el-option>
                      <el-option :value="20" label="20"></el-option>
                      <el-option :value="30" label="30"></el-option>
                      <el-option :value="50" label="50"></el-option>
                      <el-option :value="100" label="100"></el-option>
                      <el-option :value="200" label="200"></el-option>
                      <el-option :value="500" label="500"></el-option>
                      <el-option :value="1000" label="1000"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="表格行展开" :label-width="100">
                    <el-checkbox v-model="isTypeExpand"></el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="选择模式" :label-width="100">
                    <el-select v-model="selectMode" style="width:90%;">
                      <el-option value="multiple" label="多选"></el-option>
                      <el-option value="single" label="单选"></el-option>
                      <el-option value="" label="无"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="显示斑马纹" :label-width="100">
                    <el-checkbox v-model="showStrip"></el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-card>
          <template #header>
            <div class="el-card-header">
              <span>数据源</span>
            </div>
          </template>
        </el-card>
        <el-card>
          <el-button type="primary">确定</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-card>
      </el-space>
    </el-form>
    <column-editor ref="clnEditor"></column-editor>
    <operation-editor ref="opEditor"></operation-editor>
  </span>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import columnEditor from './ColumnEditor.vue';
import operationEditor from './OperationEditor.vue';
import formEditor from '../Formio/Editor.vue';

const checkButtongs = ref(true);
const checkQuickSearch = ref(true);
const checkAdvanceSearch = ref(false);
const selectedManus = ref(['name', 'manufacturer']);
const thisType = ref('1-1');
const thisData = reactive({});
const dragging = ref(false);
const clnEditor = ref(null);
const opEditor = ref(null);
const isTreeTable = ref(false);
const isTypeExpand = ref(false);
const showStrip = ref(true);
const displayType = ref('switch');
const selectMode = ref('multiple');
const operationLocation = ref('lastColumn');

const pagination = reactive({ mode: 'server', pageSize: 100 });

const columns = reactive([
  {
    name: 'label',
    label: '名称',
    visible: true,
  },
  {
    name: 'description',
    label: '描述',
    visible: true,
  },
  {
    name: 'manu',
    label: '厂商',
    visible: true,
  },
  {
    name: 'cpu',
    label: 'CPU使用率',
    visible: true,
  },
  {
    name: 'memory',
    label: '内存使用率',
    visible: true,
  },
  {
    name: 'price',
    label: '采购价格',
    visible: false,
  },
  {
    name: 'purchase_at',
    label: '采购时间',
    visible: false,
  },
]);

const showColumnEditor = () => {
  clnEditor.value.show();
};

const showOpEditor = () => {
  opEditor.value.show();
};
</script>
