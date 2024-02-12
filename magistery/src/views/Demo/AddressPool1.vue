<template>
  <layout ref="layout" list-title="地址池" :stat-visible="false" >
    <template #header>
      <el-button key="addSite" type="primary" icon="plus" >添加</el-button>
    </template>
    <template #list>
      <el-table
        border
        :data="gridData"
        style="width: 100%">
        <el-table-column
          key="name"
          prop="name"
          label="城市名称"
        >
        </el-table-column>
        <el-table-column
          key="loopback"
          prop="loopback"
          label="loopback地址范围"
        >
        </el-table-column>
        <el-table-column
          key="internet"
          prop="internet"
          label="互联地址范围"
        >
        </el-table-column>
        <el-table-column
          key="realtime_address"
          prop="realtime_address"
          label="实时业务地址范围"
        >
        </el-table-column>
        <el-table-column
          key="non_realtime_address"
          prop="non_realtime_address"
          label="非实时业务地址范围"
        >
        </el-table-column>
        <el-table-column label="操作" width="320">
          <template #default="scope">
            <el-button size="small" icon="edit">编辑</el-button>
            <el-button size="small" icon="delete" :title="scope.row.name">删除</el-button>
            <el-button size="small" icon="view" :title="scope.row.name">查看使用情况</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </layout>
</template>

<script setup>
import Layout from '@/components/Layout/List.vue';
import { onMounted, ref, reactive, getCurrentInstance } from 'vue';
const gridData = ref([]);

onMounted(() => {
  gridData.value = [
    { name: '合肥', loopback: '34.2.11.0', internet: '34.3.11.0;34.3.10.0;34.3.6.0', realtime_address: '34.101.0.0-34.101.70.254', non_realtime_address: '34.100.0.0-34.100.70.254' },
    { name: '芜湖', loopback: '34.2.12.0', internet: '34.3.12.0;34.3.30.0', realtime_address: '34.101.71.0-34.101.112.254', non_realtime_address: '34.100.71.0-34.100.112.254' },
    { name: '蚌埠', loopback: '34.2.13.0', internet: '34.3.13.0;34.5.13.0', realtime_address: '34.101.113.0-34.101.133.254', non_realtime_address: '34.100.113.0-34.100.133.254' },
    { name: '淮南', loopback: '34.2.14.0', internet: '34.3.14.0;34.3.8.0', realtime_address: '34.101.134.0-34.101.154.254', non_realtime_address: '34.100.134.0-34.100.154.254' },
    { name: '马鞍山', loopback: '34.2.15.0', internet: '34.3.15.0;34.3.3.0', realtime_address: '34.101.155.0-34.101.175.254', non_realtime_address: '34.100.155.0-34.100.175.254' },
  ];
});
</script>
