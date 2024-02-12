<template>
  <layout ref="layout" list-title="IP地址管理" v-loading="loading">
    <template #header/>
    <template #list>
      <el-table :data="tableData" style="width: 100%" @sort-change="handleSortChange">
        <el-table-column label="地址" prop="address" sortable/>
        <el-table-column label="主机名" prop="hostname" />
        <el-table-column
          label="状态">
          <template #default="scope">
            <span>{{ scope.row.device_id > 0 ? '拓扑': (scope.row.status > 0 ? '已发送':'新发现') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="第一次时间" prop="created_at" :formatter="formatDate"/>
        <el-table-column label="最后一次时间" prop="updated_at" :formatter="formatDate"/>
        <el-table-column label="操作" >
          <!-- <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template> -->
          <template #default="scope">
            <el-button size="small"
                       type="primary"
                       @click="handleView(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_block" v-if="totalNum > 10">
        <el-pagination :page-sizes="[10, 30, 50, 100]" background layout=" prev, pager, next, jumper,total, sizes," :total="totalNum" :current-page="query.page" :page-size="query.page_size" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
      </div>
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
import Layout from '@/components/Layout/List.vue';
import { onMounted, ref, reactive } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { searchDiscoveries, searchDiscoveriesCount } from '@/api/devices';
import { dateFormat } from '@/utils/index';
import { isEmptyObj } from '@/utils/validate';

const totalNum = ref(0);
const tableData = ref([]);
const query = reactive({
  page: 1,
  page_size: 10,
});
const loading = ref(false);
const sortKey = ref('');

onMounted(() => {
  loading.value = true;
  searchDiscoveriesCount().then((response) => {
    if (response) {
      totalNum.value = response;
      console.log(response);
    }
    loading.value = false;
  });
  loadDiscoveriesRusult();
});

const handleView = (index: number, row: any) => {
  ElMessageBox.alert('暂无数据', '提示', {
    confirmButtonText: '确认',
    callback: (action: any) => {
    },
  });
};

const loadDiscoveriesRusult = () => {
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
  searchDiscoveries(param).then((response) => {
    if (response && !isEmptyObj(response)) {
      tableData.value = response;
      console.log(response);
    }
    loading.value = false;
  });
};

const handleSizeChange = (val: number) => {
  query.page = 1;
  query.page_size = val;
  loadDiscoveriesRusult();
};

const handleCurrentChange = (val: number) => {
  query.page = val;
  loadDiscoveriesRusult();
};

const formatDate = (row: any, column: any) => {
  return dateFormat(row, column);
};

const handleSortChange = ({ column, prop, order }) => {
  query.page = 1;
  sortKey.value = order == 'ascending' ? '+' + prop : '-' + prop;
  loadDiscoveriesRusult();
};
</script>
