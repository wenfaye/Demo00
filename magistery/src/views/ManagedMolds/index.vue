<template>
  <layout ref="layout" list-title="业务模型管理">
    <template #header>
      <el-button type="primary" icon="plus" @click="$router.push('/managed_molds/new')">添加</el-button>
      <el-button type="info" icon="edit">编辑</el-button>
      <el-button type="danger" icon="delete">删除</el-button>

      <el-button-group style="margin-left: 10px;">
        <el-button icon="upload">导入</el-button>
        <el-button icon="download">导出</el-button>
      </el-button-group>
    </template>
    <template #list>
      <el-table
        border
        :data="gridData"
        style="width: 100%; margin-bottom: 20px">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="操作">
          <template #default>
            <el-button size="small" icon="edit">编辑</el-button>
            <el-button size="small" icon="delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </layout>
</template>

<script lang="ts" setup>
import Layout from '@/components/Layout/List.vue';
import { ref, computed } from 'vue';
interface MoldType {
  id: string
  name: string
  description?: string
}

const gridData: MoldType[] = [
  {
    id: 'row1',
    name: '网络设备管理',
  },
  {
    id: 'row2',
    name: '工单管理',
  },
  {
    id: 'row3',
    name: '用户管理',
  },
];

</script>
