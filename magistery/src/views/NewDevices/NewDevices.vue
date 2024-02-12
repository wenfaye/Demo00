<template>
  <layout ref="layout" list-title="设备纳管" loading="loading">
    <template #header/>
    <template #list>
      <el-table :data="tableData" style="width: 100%" @sort-change="handleSortChange">
        <el-table-column label="IP地址" prop="address" sortable/>
        <el-table-column label="主机名" prop="hostname" />
        <el-table-column label="最后发现时间" prop="updated_at" :formatter="formatDate"/>
        <el-table-column label="操作" >
          <!-- <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template> -->
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleAdd(scope.$index, scope.row)">添加</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >忽略</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_block" v-if="totalNum > 10">
        <el-pagination :page-sizes="[10, 30, 50, 100]" background layout=" prev, pager, next, jumper,total, sizes," :total="totalNum" :current-page="query.page" :page-size="query.page_size" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
      </div>
      <el-dialog v-model="showIframe" width="80%" top="2vh">
        <iframe
          ref="iframe"
          id="iframe"
          frameborder="0"
          :src="iframeSrc"
          style="min-height: 800px;width: 100%"/>
      </el-dialog>
    </template>
  </layout>
</template>
<style style lang="scss" scoped>
.page_block{
  margin: 30px auto;
  padding-bottom: 20px;
}
</style>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { onMounted, ref, reactive, onUnmounted } from 'vue';
import { newDiscoveries, addIgnoreList, newDiscoveriesCount } from '@/api/devices';
import Layout from '@/components/Layout/List.vue';
import { dateFormat } from '@/utils/index';
import { isEmptyObj } from '@/utils/validate';

const totalNum = ref(0);
const tableData = ref([]);
const query = reactive({
  page: 1,
  page_size: 10,
});
const loading = ref(false);
const iframeSrc = ref('');
const showIframe = ref(false);
const sortKey = ref('');

onMounted(() => {
  getCount();
  loadNewDevicesList();
  window.addEventListener('message', (event: MessageEvent) => {
    if (event && event.data && event.data.data && event.data.data.result == 'successfully') {
      ElMessage({ message: '添加成功', type: 'success' });
      initQuery();
      sortKey.value = '';
      getCount();
      loadNewDevicesList();
    } else if ((event && event.data && event.data.data && event.data.data.result == 'failed')) {
      ElMessage({ message: event.data.data.message, type: 'error' });
    }
    showIframe.value = false;
    iframeSrc.value = '';
  });
});

onUnmounted(() => {
  window.removeEventListener('message', () => {});
});

const getCount = () => {
  loading.value = true;
  newDiscoveriesCount().then((response) => {
    if (response) {
      totalNum.value = response;
      console.log(response);
    } else {
      totalNum.value = 0;
    }
    loading.value = false;
  });
};

const handleAdd = (index: number, row: any) => {
  console.log(index, row);
  showIframe.value = true;
  iframeSrc.value = (window as any).urlPrefix + `web/network_devices/add?simplified=true&pre_addresses=${row.address}`;
  // loadNewDevicesList();
};

const handleDelete = (index: number, row: any) => {
  loading.value = true;
  addIgnoreList(row.address).then((response) => {
    ElMessage({ message: '已忽略设备', type: 'success' });
    loading.value = false;
    initQuery();
    sortKey.value = '';
    getCount();
    loadNewDevicesList();
  });
};

const initQuery = () => {
  query.page = 1;
  query.page_size = 10;
};

const loadNewDevicesList = () => {
  loading.value = true;
  let offset: number = 0;
  if (query.page - 1 <= 0) {
    offset = 0;
  } else {
    offset = (query.page - 1) * query.page_size;
  }
  const param: any = {
    offset: offset,
    limit: query.page_size,
  };
  if (sortKey.value !== '') {
    param.sort = encodeURI(sortKey.value);
  }
  newDiscoveries(param).then((response) => {
    if (response && !isEmptyObj(response)) {
      tableData.value = response.data;
      console.log(response);
    } else {
      tableData.value = [];
    }
    loading.value = false;
  });
};

const handleSizeChange = (val: number) => {
  query.page = 1;
  query.page_size = val;
  loadNewDevicesList();
};

const handleCurrentChange = (val: number) => {
  query.page = val;
  loadNewDevicesList();
};

const formatDate = (row: any, column: any) => {
  return dateFormat(row, column);
};

const handleSortChange = ({ column, prop, order }) => {
  initQuery();
  if (prop && prop != 'null') {
    sortKey.value = order == 'ascending' ? '+' + prop : '-' + prop;
  }
  loadNewDevicesList();
};

</script>
