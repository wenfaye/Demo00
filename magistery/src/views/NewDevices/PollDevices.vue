<template>
  <layout ref="layout" list-title="地址段设置">
    <template #header>
      <el-button key="addSite" type="primary" icon="plus" @click="addNewRuleConfig">添加</el-button>
      <el-button key="addSite" type="warning" icon="Setting" @click="golbalConfigSetting">全局设置</el-button>
    </template>
    <template #list>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column label="描述" prop="description" />
        <el-table-column label="地址段" prop="address" />
        <el-table-column label="扫描结果保留时间(天)" prop="retention_time" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small"
                       type="info"
                       @click="handleEdit(scope.$index, scope.row)">编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
            >
            <el-button
              size="small"
              type="warning"
              @click="handleRun(scope.$index, scope.row)"
            >运行</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page_block" v-if="totalNum > 10">
        <el-pagination :page-sizes="[10, 30, 50, 100]" background layout=" prev, pager, next, jumper,total, sizes," :total="totalNum" :current-page="query.page" :page-size="query.page_size" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
      </div>
      <NewRuleConfig ref="newRuleConfigRef" @created-rule-config="createdRuleConfig" />
      <GolbalRuleConfig ref="globalRuleConfigRef" @created-global-rule-config="createdGlobalRuleConfig" />
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
import { getScanParamsList, getScanParamsListCount, deleteScanParamById, runScanParamById } from '@/api/devices';
import NewRuleConfig from '@/components/NewRuleConfig/index.vue';
import GolbalRuleConfig from '@/components/GlobalRuleConfig/index.vue';

const totalNum = ref(0);
const tableData = ref([]);
const query = reactive({
  page: 1,
  page_size: 10,
});
const loading = ref(false);
const newRuleConfigRef = ref(null);
const globalRuleConfigRef = ref(null);

onMounted(() => {
  getCount();
  loadParamConfigList();
});

const loadParamConfigList = () => {
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
  getScanParamsList(param).then((response) => {
    tableData.value = response;
    loading.value = false;
    console.log(response);
  });
};

const getCount = () => {
  loading.value = true;
  getScanParamsListCount().then((response) => {
    if (response) {
      totalNum.value = response;
      console.log(response);
    } else {
      totalNum.value = 0;
    }
    totalNum.value = response;
    console.log(response);
    loading.value = false;
  });
};

const handleSizeChange = (val: number) => {
  query.page = 1;
  query.page_size = val;
  loadParamConfigList();
};

const handleCurrentChange = (val: number) => {
  query.page = val;
  loadParamConfigList();
};

const initQuery = () => {
  query.page = 1;
  query.page_size = 10;
};

const addNewRuleConfig = (typ?: string, res?:any) => {
  if (newRuleConfigRef && newRuleConfigRef.value) {
    newRuleConfigRef.value.showRuleConfigDialog(typ, res);
  }
};

const golbalConfigSetting = () => {
  if (globalRuleConfigRef && globalRuleConfigRef.value) {
    globalRuleConfigRef.value.showGlobalRuleConfigDialog();
  }
};

const createdRuleConfig = () => {
  initQuery();
  loadParamConfigList();
};

const createdGlobalRuleConfig = () => {
  initQuery();
  loadParamConfigList();
};

const handleEdit = (index: number, row: any) => {
  addNewRuleConfig('edit', row);
};
const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm(
    '确认要删除吗?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    },
  ).then(() => {
    loading.value = true;
    deleteScanParamById(row.id).then((response) => {
      loading.value = false;
      ElMessage({ message: '已删除', type: 'success' });
      initQuery();
      getCount();
      loadParamConfigList();
    });
  }).catch(() => {});
};
const handleRun = (index: number, row: any) => {
  loading.value = true;
  const param: any = {
    args: {
      id: row.id,
    },
    type: 'scan_job_run',
    type_name: 'scan_job_run',
  };
  runScanParamById(param).then((response) => {
    loading.value = false;
    ElMessage({ message: '运行成功', type: 'success' });
    loadParamConfigList();
  }).catch((err) => {
    loading.value = false;
    console.log(err);
  });
};

</script>
