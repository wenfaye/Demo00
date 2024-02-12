<template>
  <layout ref="layout" list-title="配置项类型">
    <template #header>
      <el-button type="primary" icon="plus" @click="$router.push('/class_specs/new')">添加</el-button>
      <el-button icon="edit">编辑</el-button>
      <el-button icon="trash">删除</el-button>
    </template>
    <template #list>
      <el-table
        v-model:expanded-row-keys="expandedRowKeys"
        border
        :data="gridData"
        default-expand-all
        row-key="id"
        style="width: 100%; margin-bottom: 20px">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="操作">
          <template #default>
            <el-button size="small" icon="edit">编辑</el-button>
            <el-button size="small" icon="edit">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </layout>
</template>

<script lang="ts" setup>
import Layout from '@/components/Layout/List.vue';
import { ref, computed } from 'vue';
interface ConfigType {
  id: string
  name: string
  description?: string
  hasChildren?: boolean
  children?: ConfigType[]
}

const gridData: ConfigType[] = [
  {
    id: 'row1',
    name: '网络设备',
    children: [
      { id: 'row1-sub1', name: '交换机', children: [] },
      { id: 'row1-sub2', name: '路由器', children: [] },
    ],
  },
  {
    id: 'row2',
    name: '服务器',
    children: [
      { id: 'row2-sub1', name: '刀片服务器', children: [] },
      { id: 'row2-sub2', name: '塔式服务器', children: [] },
    ],
  },
  {
    id: 'row3',
    name: '设备耗材',
    children: [],
  },
];

const expandedRowKeys = ref<string[]>([]);
</script>
