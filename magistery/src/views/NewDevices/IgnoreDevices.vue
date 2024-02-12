<template>
  <layout ref="layout" list-title="设备忽略" v-loading="loading">
    <template #header/>
    <template #list>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="IP地址" prop="address" />
        <el-table-column label="主机名" prop="hostname" />
        <el-table-column label="最后发现时间" prop="updated_at" :formatter="formatDate"/>
        <el-table-column label="操作" >
          <!-- <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template> -->
          <template #default="scope">
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
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
import { ElMessage } from 'element-plus';
import { getIgnoreList, delIgnoreList, getIgnoreListCount } from '@/api/devices';
import { dateFormat } from '@/utils/index';
import { isEmptyObj } from '@/utils/validate';

onMounted(() => {
  getCount();
  loadIgnoreList();
});

const totalNum = ref(0);
const tableData = ref([]);
const query = reactive({
  page: 1,
  page_size: 10,
});
const loading = ref(false);

const getCount = () => {
  loading.value = true;
  getIgnoreListCount().then((response) => {
    if (response) {
      totalNum.value = response;
      console.log(response);
    } else {
      totalNum.value = 0;
    }
    loading.value = false;
  });
};

const handleDelete = (index: number, row: any) => {
  loading.value = true;
  delIgnoreList(row.address).then((response) => {
    loading.value = false;
    ElMessage({ message: '删除成功', type: 'success' });
    initQuery();
    getCount();
    loadIgnoreList();
  });
};

const initQuery = () => {
  query.page = 1;
  query.page_size = 10;
};

const loadIgnoreList = () => {
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
  getIgnoreList(param).then((response) => {
    if (response && !isEmptyObj(response)) {
      tableData.value = response;
    } else {
      tableData.value = [];
    }
    loading.value = false;
    console.log(response);
  });
};

const handleSizeChange = (val: number) => {
  query.page = 1;
  query.page_size = val;
  loadIgnoreList();
};

const handleCurrentChange = (val: number) => {
  query.page = val;
  loadIgnoreList();
};

const formatDate = (row: any, column: any) => {
  return dateFormat(row, column);
};

</script>
