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
      <ag-grid-vue style="width: 100%; height: 100%;"
        class="ag-theme-alpine"
        :defaultColDef="{width:150, resizable: true}"
        :columnDefs="columnDefs"
        :rowData="gridData"
        :pagination="true">
      </ag-grid-vue>
    </template>
    <span style="display: none;">
      <percentage-bar></percentage-bar>
      <column-operations></column-operations>
    </span>
  </layout>
</template>

<style lang="scss">
  @import "~ag-grid-community/dist/styles/ag-grid.css";
  @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
</style>

<script lang="ts">
import PercentageBar from './PercentageBar/index.vue';
import ColumnOperations from './ColumnOperations/index.vue';
import { AgGridVue } from 'ag-grid-vue3';
import Layout from './Layout/List.vue';
import { onMounted, reactive, ref, defineComponent, getCurrentInstance } from 'vue';

export default defineComponent({
  setup() {
    const cur = getCurrentInstance();

    // const queryBySimple = true;
    const checkStat = false;
    // const checkSearch = false;
    const pageSet:any = reactive({ class_id: 0, title: '', quick_search: {}, actions: [], grid: { columns: [], pagination: {}}});
    const gridData:any = ref([]);
    const columnDefs:any = reactive([]);
    const quickSearchField = ref('');

    onMounted(() => {
      pageSet.class_id = 1;
      pageSet.title = '设备列表(AG)';
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
          { title: '名称', field: 'name', sortable: true, min_width: '250px', align: 'center', style: { color: '' }},
          { title: '厂商', field: 'manufacturer', sortable: true, min_width: '250px', align: 'center', style: { color: '' }},
          { title: 'CPU', field: 'cpu', sortable: true, width: '180px', align: 'right', formatter: 'percentage' },
          { title: '采购时间', field: 'purchase_at', formatter: 'time', sortable: true, width: '150px', align: 'center' },
          { title: '采购价格', field: 'price', visible: false },
          {
            title: '操作',
            field: 'operations',
            type: 'operations',
            width: '300px',
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

      for (const k in pageSet.grid.columns) {
        const column = pageSet.grid.columns[k];
        const o:any = { headerName: column.title, field: column.field, width: parseInt(column.width || column.min_width || 0) };
        if (column.formatter === 'percentage') {
          o.cellRendererFramework = 'PercentageBar';
        } else if (column.type === 'operations') {
          o.cellRendererFramework = 'ColumnOperations';
          o.cellRendererParams = { operations: column.children };
        }
        columnDefs.push(o);
      }

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
        { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
        { name: '交换机', manufacturer: 'Cisco', cpu: 70, purchase_at: '2021-09-07' },
      ];

      if (pageSet.quick_search && pageSet.quick_search.fields && pageSet.quick_search.fields.length > 0) {
        quickSearchField.value = pageSet.quick_search.fields[0];
      }
    });

    const showAdvanceSearch = () => {
      // cur.$refs.layout.advanceVisible = true;
    };

    return {
      pageSet,
      checkStat,
      quickSearchField,
      columnDefs,
      gridData,
    };
  },
  components: {
    PercentageBar,
    AgGridVue,
    Layout,
    ColumnOperations,
  },
});
</script>
