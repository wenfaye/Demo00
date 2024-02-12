<template>
  <layout ref="layout" :list-title="pageSet.title" :stat-visible="checkStat" >
    <template #header>
      <el-button v-for="(a, i) in pageSet.actions" v-bind:key="i" :type="a.btn_type ? a.btn_type : 'default'" :icon="a.icon">{{a.label}}</el-button>

  &nbsp;&nbsp;&nbsp;
      <div style="display: inline-block;" v-if="pageSet.quick_search && pageSet.quick_search.fields && pageSet.quick_search.fields.length > 0">
        <el-input
          placeholder="请输入"
          class="input-with-select"
        >
          <template #prepend>
            <el-select placeholder="选择" style="width: 115px" v-model="quickSearchField">
              <el-option v-for="o in pageSet.quick_search.fields" :label="o" :value="o" :key="o" />
            </el-select>
          </template>
          <template #append>
            <el-button icon="search" />
          </template>
        </el-input>
      </div>
    </template>
    <template #list>
      <el-table
        v-if="pageSet.grid.columns"
        :data="gridData"
        border
        style="width: 100%">
        <el-table-column v-for="(column, i) in pageSet.grid.columns"
          :key="i"
          :width="column.width || '150px'"
          :prop="column.field"
          :label="column.title"
        >
          <template #default="scope">
            <span v-if="column.type === 'operations'">
              <el-button v-for="(btn, j) in column.children" :key="j" :type="btn.btn_type ? btn.btn_type : 'default'" :icon="btn.icon">{{btn.label}}</el-button>
            </span>
            <span v-if="column.formatter">
              <percentage-bar v-if="column.formatter === 'percentage'" :params="{value: scope.row[column.field]}"></percentage-bar>
            </span>
            <span v-if="column.type !== 'operations' && !column.formatter">
              {{scope.row[column.field]}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="pageSet.grid.mode !== 'none'" :page-size="100" :total="1000" layout="prev, pager, next" background style="margin-top: 5px;float: right;"></el-pagination>
    </template>
  </layout>
</template>

<script setup>
import PercentageBar from './PercentageBar/index.vue';
import ColumnOperations from './ColumnOperations/index.vue';
import Layout from './Layout/List.vue';
import { onMounted, ref, reactive } from 'vue';

// const queryBySimple = true;
const checkStat = false;
// const checkSearch = false;
const pageSet = reactive({ grid: { columns: [], pagination: {}}});
const gridData = ref([]);
const quickSearchField = ref('');

onMounted(() => {
  pageSet.class_id = 1;
  pageSet.title = '设备列表(El)';
  pageSet.quick_search = {
    fields: ['name', 'manufacturer'],
    url: '',
  };
  pageSet.actions = [
    { label: '添加', icon: 'plus', btn_type: 'primary', type: 'new' },
    { label: '删除', icon: 'delete', btn_type: 'danger', type: 'delete', confirm_text: '确认删除？' },
    { label: '编辑', icon: 'edit', btn_type: 'success', type: 'edit' },
  ];
  pageSet.grid = {
    default_sort: 'name asc',
    columns: [
      { title: '名称', field: 'name', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: '厂商', field: 'manufacturer', sortable: true, min_width: '100px', align: 'center', style: { color: '' }},
      { title: 'CPU', field: 'cpu', sortable: true, width: '280px', align: 'right', formatter: 'percentage' },
      { title: '采购时间', field: 'purchase_at', formatter: 'time', sortable: true, width: '150px', align: 'center' },
      { title: '采购价格', field: 'price', visible: false },
      {
        title: '操作',
        type: 'operations',
        width: '380px',
        children: [
          { label: '编辑', icon: 'edit', type: 'edit' },
          { label: '删除', icon: 'delete', type: 'delete', confirm: '确认删除？' },
          {
            label: '分配',
            icon: 'assign',
            type: 'update',
            params: {
              fields: 'user_id',
            },
          },
        ],
      },
    ],
    pagination: {
      mode: 'client',
      page_size: 100,
    },
  };

  gridData.value = [
    { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
    { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
    { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
    { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
    { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
    { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
    { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
    { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
    { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
    { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
    { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
    { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
  ];

  if (pageSet.quick_search && pageSet.quick_search.fields && pageSet.quick_search.fields.length > 0) {
    quickSearchField.value = pageSet.quick_search.fields[0];
  }
});

const showAdvanceSearch = () => {
  this.$refs.layout.advanceVisible = true;
};

</script>
