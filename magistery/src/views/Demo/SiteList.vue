<template>
  <layout ref="layout" list-title="待分配厂站列表" :stat-visible="false" >
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
          label="厂站名称"
        >
        </el-table-column>
        <el-table-column
          key="city"
          prop="city"
          label="所在城市"
        >
        </el-table-column>
        <el-table-column
          key="network"
          prop="network"
          label="接入网络"
        >
        </el-table-column>
        <el-table-column
          key="state"
          prop="state"
          label="运行状态"
        >
        </el-table-column>
        <el-table-column
          key="include"
          prop="include"
          label="是否纳管"
        >
        </el-table-column>
        <el-table-column
          key="routes"
          prop="routes"
          label="路由器"
        >
        </el-table-column>
        <el-table-column
          key="switches"
          prop="switches"
          label="交换机"
        >
        </el-table-column>
        <el-table-column
          key="equipment"
          prop="equipment"
          label="业务设备"
        >
        </el-table-column>
        <el-table-column label="操作" width="270">
          <template #default="scope">
            <!--<el-button size="small" icon="edit">编辑</el-button>-->
            <el-button size="small" :title="scope.row.name" @click="$router.push('/demo/assign_address')">分配地址</el-button>
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
    { name: '**变', city: '合肥', network: '省调接入网', include: '是', state: '在运', routes: '1/1', switches: '2/2', equipment: '4/6' },
    { name: '**变', city: '合肥', network: '省调接入网', include: '否', state: '未上线', routes: '0/1', switches: '0/2', equipment: '0/7' },
    { name: '**变', city: '芜湖', network: '省调接入网', include: '否', state: '未上线', routes: '0/1', switches: '0/2', equipment: '0/6' },
    { name: '**变', city: '安庆', network: '省调接入网', include: '***', state: '***', routes: '***', switches: '***', equipment: '***' },
    { name: '**变', city: '蚌埠', network: '省调接入网', include: '***', state: '***', routes: '***', switches: '***', equipment: '***' },
    { name: '**变', city: '蚌埠', network: '省调接入网', include: '***', state: '***', routes: '***', switches: '***', equipment: '***' },
    { name: '**变', city: '蚌埠', network: '省调接入网', include: '***', state: '***', routes: '***', switches: '***', equipment: '***' },
  ];
});
</script>
