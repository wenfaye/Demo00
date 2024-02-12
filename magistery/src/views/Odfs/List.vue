<template>
  <layout ref="layout" :list-title="pageSet.title" :stat-visible="checkStat" >
    <template #header>
      <el-button v-for="(a, i) in pageSet.actions" v-bind:key="i" :type="a.btn_type ? a.btn_type : 'default'" :icon="a.icon" @click="doAction(a)">{{a.label}}</el-button>
      <div style="display: inline-block;margin-left: 10px;" v-if="pageSet.quick_search && pageSet.quick_search.fields && pageSet.quick_search.fields.length > 0">
        <el-select class="search-field" placeholder="选择" style="width: 115px" v-model="quickSearchField">
          <el-option v-for="o in pageSet.quick_search.fields" :label="o.label" :value="o.name" :key="o.name" />
        </el-select>
        <el-select v-model="searchValue" clearable class="search-input" v-if="searchEnumerations" style="display:inline-block;width:200px;margin-left: -1px;">
          <el-option v-model="searchValue" v-for="e in searchEnumerations" :key="e.value" :value="e.value" :label="e.label"></el-option>
          <template #append>
            <el-button icon="search" @click="loadData()" />
          </template>
        </el-select>
        <el-input
          style="display:inline-block;width:200px;margin-left: -9px;border-radius: 0;"
          v-model="searchValue"
          v-if="!searchEnumerations"
          placeholder="请输入"
          class="search-input"
        >
        </el-input>
        <el-button class="search-button" icon="search" @click="loadData()" style="margin-left: -1px;margin-top:-1px;" />
      </div>
    </template>
    <template #list>
      <el-table
        ref="gridRef"
        v-if="pageSet.grid.columns"
        :data="gridData"
        border
        style="width: 100%"
        height="calc(100% - 25px)">
        <el-table-column v-if="pageSet.grid.show_selection" type="selection"></el-table-column>
        <el-table-column v-for="(column, i) in tableColumns"
                         :key="i"
                         :width="column.width || '150px'"
                         :prop="column.field"
                         :label="column.title"
                         :sortable="column.sortable"
        >
          <template #default="scope">
            <span v-if="column.type === 'operations'">
              <el-button v-for="(btn, j) in column.children" :title="btn.title" size="small" :key="j" :type="btn.btn_type ? btn.btn_type : 'default'" :icon="btn.icon" @click="doAction(btn, scope.row)">{{btn.label}}</el-button>
            </span>
            <span v-if="column.formatter">
              <percentage-bar v-if="column.formatter === 'percentage'" :params="{value: scope.row[column.field]}"></percentage-bar>
              <span v-if="typeof column.formatter === 'function'">
                {{column.formatter.call(vueInstance, scope.row, column)}}
              </span>
            </span>
            <span v-if="column.type !== 'operations' && !column.formatter">
              <span v-if="column.enumerations">
                {{column.resoleEnumLabel(scope.row[column.field])}}
              </span>
              <span v-if="!column.enumerations">
                {{scope.row[column.field]}}
              </span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="pageSet.grid.pagination.mode === 'client' || pageSet.grid.pagination.mode === 'server'" @current-change="currentPageChange" v-model:current-page="currentPage" :page-size="pageSet.grid.pagination.page_size" :total="dataTotal" layout="prev, pager, next" background style="margin-top: 1px;float: right;"></el-pagination>
    </template>
  </layout>
</template>

<script lang="ts" setup>
import { req } from '@/utils/request';
import axios, { AxiosResponse } from 'axios';
import PercentageBar from '@/components/PercentageBar/index.vue';
import ColumnOperations from '@/components/ColumnOperations/index.vue';
import Column from '@/lib/table/column.ts';
import Layout from '@/components/Layout/List.vue';
import { onMounted, ref, reactive, getCurrentInstance, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElTable, ElMessageBox } from 'element-plus';
import querystring from 'querystring';

// const queryBySimple = true;
const checkStat = false;
// const checkSearch = false;
const pageSet = reactive({ title: '', quick_search: {}, actions: [], data_source: {}, grid: { columns: [], pagination: { mode: 'client', page_size: 100 }}});
const currentPage = ref(1);
const loadedData = ref([]);
const tableColumns = ref([]);
const dataTotal = ref(0);
const quickSearchField = ref('');
const searchEnumerations = ref(null);
const searchValue = ref('');
const router = useRouter();
const vueInstance = getCurrentInstance();
const gridRef = ref<InstanceType<typeof ElTable>>();

const gridData = computed({
  get: () => {
    const pagination = pageSet.grid.pagination;
    if (pagination.mode === 'client') {
      return loadedData.value.slice((currentPage.value - 1) * pagination.page_size, currentPage.value * pagination.page_size);
    } else {
      return loadedData.value;
    }
  },
});

const actions = {
  vueRoute: (action: any, btn: any, record: any) => {
    const selection = gridRef.value.getSelectionRows();
    if (btn.mode === '1') {
      if (selection.length !== 1) {
        alert('请选择一行记录！');
        return;
      }
      router.push(resolveUrl(action.url, selection[0]));
    } else if (btn.mode === '+') {
      console.log(btn);
    } else {
      router.push(resolveUrl(action.url, record));
    }
  },
  pageJump: (a: any) => {
  },
  requestSend: (action: any, btn: any, record: any) => {
    if (btn.confirm_text && !window.confirm(btn.confirm_text)) {
      return;
    }

    const selection = gridRef.value.getSelectionRows();
    const req = {
      method: action.method || 'get',
      params: {},
      data: '',
    };
    if (action.carrier && Object.keys(action.carrier).length != 0) {
      const keys = Object.keys(action.carrier);
      keys.forEach((item) => {
        const v = action.carrier[item];

        if (v.startsWith('query.')) {
          const p = v.replace('query.', '').replace('[]', '');
          const values = getSelectionValue(item, selection);
          req.params[p] = values;
        } else if (v.startsWith('form.')) {
          const p = v.replace('form.', '').replace('[]', '');
          const values = getSelectionValue(item, selection);
          const data = {};
          data[p + '[]'] = values;
          req.headers = { 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8' };
          req.data += querystring.stringify(data);
        }
      });
    }

    let url = action.url;
    if (btn.mode === '1') {
      if (selection.length !== 1) {
        alert('请选择一条记录进行操作！');
        return;
      }
      url = resolveUrl(url, record);
    } else if (btn.mode === '+') {
      url = resolveUrl(url, selection);
    } else {
      url = resolveUrl(url, record);
    }

    req.url = url;
    axios.create({})(req).then((response) => {
      loadData();
    }, (response) => {
      alert(response);
    });
  },
};

onMounted(() => {
  pageSet.title = '机房光缆管理';
  pageSet.quick_search = {
    fields: [
      {
        name: 'name',
        label: '序号',
      },
      {
        name: 'room_id',
        label: '起点机房',
        default: true,
        enumeration_source: { type: 'dictionary', dictionary_get_url: '{{urlPrefix}}/mc/ComputerRooms/ListOptions' },
      },
      {
        name: 'peer_room_id',
        label: '终点机房',
        enumeration_source: { type: 'dictionary', dictionary_get_url: '{{urlPrefix}}/mc/ComputerRooms/ListOptions' },
      },
    ],
  };
  pageSet.actions = [
    { label: '添加', icon: 'plus', btn_type: 'primary', type: 'new', action: { url: '/odfs/new', exec: 'vueRoute' }},
    { label: '删除', icon: 'delete', btn_type: 'danger', type: 'delete', mode: '+', action: { url: '{{urlPrefix}}/rest/mos/computer_cabinet_accessories/deletebyIds', carrier: { id: 'query.ids[]' }, exec: 'requestSend', method: 'delete' }, confirm_text: '确认删除？' },
    { label: '编辑', icon: 'edit', btn_type: 'success', type: 'edit', mode: '1', action: { url: '/odfs/{{id}}', exec: 'vueRoute' }},
  ];
  pageSet.grid = {
    show_selection: true,
    default_sort: 'name asc',
    columns: [
      {
        title: '操作',
        type: 'operations',
        width: '180px',
        children: [
          { label: '', title: '编辑', icon: 'edit', type: 'edit', action: { url: '/odfs/{{id}}', exec: 'vueRoute' }},
          { label: '', title: '删除', icon: 'delete', type: 'delete', action: { url: '{{urlPrefix}}/rest/mos/computer_cabinet_accessories/{{id}}', exec: 'requestSend', method: 'delete' }, confirm_text: '确认删除？' },
        ],
      },
      { title: '序号', field: 'name', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: '对端序号', field: 'peer_no', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: '终点机房', field: 'peer_room_id', sortable: true, min_width: '150px', align: 'center', style: { color: '' }, enumeration_source: { type: 'dictionary', dictionary_get_url: '{{urlPrefix}}/mc/ComputerRooms/ListOptions' }},
      { title: '起点机房', field: 'room_id', sortable: true, min_width: '150px', align: 'center', style: { color: '' }, enumeration_source: { type: 'dictionary', dictionary_get_url: '{{urlPrefix}}/mc/ComputerRooms/ListOptions' }},
      { title: 'ODF架', field: 'odf', sortable: true, min_width: '150px', align: 'center', style: { color: '' }, format_code: ' return column.resoleEnumLabel(record.cabinet_id) + "/" + record.location + "U";', enumeration_source: { type: 'dictionary', dictionary_get_url: '{{urlPrefix}}/mc/ComputerCabinets/ListOptions' }},
      { title: 'ODF配件情况', field: 'odf_p', sortable: true, min_width: '150px', align: 'center', style: { color: '' }, format_code: 'return record.core_count + "芯" +  (record.mode === "single" ? "单模":"多模")' },
      { title: '单模/多模', field: 'mode', sortable: true, min_width: '150px', align: 'center', style: { color: '' }, format_code: 'return record.mode === "single" ? "单模" : "多模"' },
      { title: '芯使用', field: 'core_occupation', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: '芯剩余', field: 'core_surplus', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
      { title: '航站楼', field: 'area', sortable: true, min_width: '150px', align: 'center', style: { color: '' }},
    ],
    pagination: {
      mode: 'client',
      page_size: 100,
    },
  };
  pageSet.data_source = {
    entire: {
      data_url: '/rest/mos/computer_cabinet_accessories',
      total_field: 'total',
      data_field: 'data',
    },
  };

  if (pageSet.quick_search && pageSet.quick_search.fields) {
    pageSet.quick_search.fields.forEach((field) => {
      if (field.default) {
        quickSearchField.value = field.name;
      }

      if (field.enumeration_source) {
        field.enumerations = [];

        const type = field.enumeration_source.type;
        if (type === 'dictionary') {
          let url = field.enumeration_source.dictionary_get_url;
          url = url.replace('{{urlPrefix}}', (window as any).urlPrefix);
          axios.get(url).then((response) => {
            field.enumerations = response.data;
            checkSearchField();
          });
        }
      }
    });

    if (quickSearchField.value == '') {
      quickSearchField.value = pageSet.quick_search.fields[0].name;
    }

    checkSearchField();
  }

  for (const column of pageSet.grid.columns) {
    tableColumns.value.push(new Column(column));
  }

  loadData();
});

watch(quickSearchField, (newValue: any, oldvValue: any) => {
  searchValue.value = '';
  checkSearchField();
});

const currentPageChange = () => {
  if (pageSet.grid.pagination.mode === 'server') {
    loadData();
  }
};

const doAction = (btn: any, record: any) => {
  if (btn.type === 'new' || btn.type === 'delete' || btn.type === 'edit') {
    actions[btn.action.exec](btn.action, btn, record);
  }
};

const loadData = () => {
  const s = pageSet.data_source;
  let u = s.entire.data_url;
  if (searchValue.value) {
    u = addParam(u, quickSearchField.value, searchValue.value);
  }

  if (pageSet.grid.pagination.mode === 'server') {
    u = addParam(u, 'pageIndex', currentPage.value - 1);
    u = addParam(u, 'pageSize', pageSet.grid.pagination.page_size);
  }

  list(u).then((response) => {
    loadedData.value = response.data;
    dataTotal.value = response.count;
  }, (response) => {
    ElMessageBox.alert(response.message, '加载失败', {
      confirmButtonText: 'OK',
    });
  });
};

const list = (url: any): Promise<any> => {
  return req({
    url: url,
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);
};

const resolveUrl = (url: any, data: any) => {
  const result = url.match(/\{\{([a-z|A-Z|0-9|_|\.|\[\]]+)\}\}/g);
  if (result) {
    for (const item of result) {
      const key = item.replace('{{', '').replace('}}', '');
      if (key === 'urlPrefix') {
        url = url.replace(item, (window as any).urlPrefix);
      } else if (data && data[key]) {
        if (key.endsWith('[]')) {
          if (data instanceof Array) {
            const newKey = key.replace('[]', '');
            const values = getSelectionValue(newKey, data);
            url = url.replace(item, values.join(','));
          }
        } else if (data[key]) {
          url = url.replace(item, data[key]);
        }
      }
    }
  }

  return url;
};

const getSelectionValue = (p: string, selectionRows: any) => {
  const values = [];
  for (const it of selectionRows) {
    values.push(it[p]);
  }

  return values;
};

const checkSearchField = () => {
  pageSet.quick_search.fields.forEach((field) => {
    if (field.name === quickSearchField.value) {
      searchEnumerations.value = field.enumerations;
    }
  });
};

const addParam = (url: any, k: any, v: any) => {
  url = url + (url.indexOf('?') > 0 ? '&' : '?') + k + '=' + encodeURIComponent(v);

  return url;
};
</script>

<style lang="scss">
  .search-field .el-input__wrapper {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
  }

  .search-input .el-input__wrapper {
    border-radius: 0;
  }

  .search-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
</style>
