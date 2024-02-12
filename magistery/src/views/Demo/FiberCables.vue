<template>
  <layout ref="layout" :list-title="pageSet.title" :stat-visible="checkStat" >
    <template #header>
      <el-button v-for="(a, i) in pageSet.actions" v-bind:key="i" :type="a.btn_type ? a.btn_type : 'default'" :icon="a.icon">{{a.label}}</el-button>
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
import PercentageBar from '@/components/PercentageBar/index.vue';
import ColumnOperations from '@/components/ColumnOperations/index.vue';
import Layout from '@/components/Layout/List.vue';
import { onMounted, ref, reactive } from 'vue';

// const queryBySimple = true;
const checkStat = false;
// const checkSearch = false;
const pageSet = reactive({ grid: { columns: [], pagination: {}}});
const gridData = ref([]);
const quickSearchField = ref('');

onMounted(() => {
  pageSet.class_id = 1;
  pageSet.title = '机房光缆管理';
  pageSet.quick_search = {
    fields: ['机房', '序号'],
    url: '',
  };
  pageSet.actions = [
    { label: '添加', icon: 'plus', btn_type: 'primary', type: 'new' },
    { label: '删除', icon: 'delete', btn_type: 'danger', type: 'delete', confirm_text: '确认删除？' },
    { label: '编辑', icon: 'edit', btn_type: 'success', type: 'edit' },
    { label: '导入', icon: 'upload', btn_type: 'default', type: 'edit' },
    { label: '导出', icon: 'download', btn_type: 'default', type: 'edit' },
  ];
  pageSet.grid = {
    default_sort: 'name asc',
    columns: [
      { title: '序号', field: 'no', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: '对端序号', field: 'peer_no', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: '终点机房', field: 'peer_room', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: '起点机房', field: 'local_room', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: 'ODF架', field: 'odf', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: 'ODF配件情况', field: 'odf_p', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: '单模使用哪些芯', field: 'df1', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: '单模剩余哪些芯', field: 'df2', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: '多模使用哪些芯', field: 'mf1', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: '多模剩余哪些芯', field: 'mf2', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
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
    { no: '1', peer_no: '756.602', peer_room: 'MDFT', local_room: 'M114', odf: 'M114-1/2U', odf_p: '48芯多模', df1: '', df2: '', mf1: '1-24芯', mf2: '25-48芯' },
    { no: '1', peer_no: '756.602', peer_room: 'MDFT', local_room: 'M114', odf: 'M114-1/2U', odf_p: '48芯多模', df1: '', df2: '', mf1: '1-24芯', mf2: '25-48芯' },
    { no: '1', peer_no: '756.602', peer_room: 'MDFT', local_room: 'M114', odf: 'M114-1/2U', odf_p: '48芯多模', df1: '', df2: '', mf1: '1-24芯', mf2: '25-48芯' },
    { no: '1', peer_no: '756.602', peer_room: 'MDFT', local_room: 'M114', odf: 'M114-1/2U', odf_p: '48芯多模', df1: '', df2: '', mf1: '1-24芯', mf2: '25-48芯' },
    { no: '1', peer_no: '756.602', peer_room: 'MDFT', local_room: 'M114', odf: 'M114-1/2U', odf_p: '48芯多模', df1: '', df2: '', mf1: '1-24芯', mf2: '25-48芯' },
    { no: '1', peer_no: '756.602', peer_room: 'MDFT', local_room: 'M114', odf: 'M114-1/2U', odf_p: '48芯多模', df1: '', df2: '', mf1: '1-24芯', mf2: '25-48芯' },
    { no: '1', peer_no: '756.602', peer_room: 'MDFT', local_room: 'M114', odf: 'M114-1/2U', odf_p: '48芯多模', df1: '', df2: '', mf1: '1-24芯', mf2: '25-48芯' },
    { no: '1', peer_no: '756.602', peer_room: 'MDFT', local_room: 'M114', odf: 'M114-1/2U', odf_p: '48芯多模', df1: '', df2: '', mf1: '1-24芯', mf2: '25-48芯' },
    { no: '1', peer_no: '756.602', peer_room: 'MDFT', local_room: 'M114', odf: 'M114-1/2U', odf_p: '48芯多模', df1: '', df2: '', mf1: '1-24芯', mf2: '25-48芯' },
    { no: '1', peer_no: '756.602', peer_room: 'MDFT', local_room: 'M114', odf: 'M114-1/2U', odf_p: '48芯多模', df1: '', df2: '', mf1: '1-24芯', mf2: '25-48芯' },
    { no: '1', peer_no: '756.602', peer_room: 'MDFT', local_room: 'M114', odf: 'M114-1/2U', odf_p: '48芯多模', df1: '', df2: '', mf1: '1-24芯', mf2: '25-48芯' },
  ];
  //
  // if (pageSet.quick_search && pageSet.quick_search.fields.length > 0) {
  //   quickSearchField.value = pageSet.quick_search.fields[0];
  // }
});

const showAdvanceSearch = () => {
  this.$refs.layout.advanceVisible = true;
};

</script>
