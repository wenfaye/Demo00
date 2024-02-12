<template>
  <layout ref="layout" list-title="数据网已审核清单" :stat-visible="false" >
    <template #header>
      标题：
      <el-input
        style="display:inline-block; border-radius: 0; margin-right: 30px;"
        class="search-input"
        v-model="query.title"
        input-style="width:200px"
      >
      </el-input>
      联系人：
      <el-input
        style="display:inline-block; border-radius: 0; margin-right: 30px;"
        class="search-input"
        v-model="query.requester"
        input-style="width:200px"
      >
      </el-input>
      申请调试厂家：
      <el-input
        style="display:inline-block; border-radius: 0; margin-right: 40px;"
        class="search-input"
        v-model="query.debugManu"
        input-style="width:200px"
      >
      </el-input>
      <el-button key="addSite" type="primary" icon="search" @click="loadRequest()">查询</el-button>
    </template>
    <template #list>
      <el-table
        border
        table-layout="auto"
        v-loading="isLoading"
        :data="gridData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width: 100%">
        <el-table-column
          key="title"
          prop="title"
          label="标题"
        >
        </el-table-column>
        <el-table-column
          key="dk_site_id"
          prop="dk_site_id"
          label="厂站名称"
        >
          <template #default="scope">
            <span>{{allSiteMap[scope.row.dk_site_id] ? allSiteMap[scope.row.dk_site_id].name : scope.row.dk_site_id}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="request_company"
          prop="request_company"
          label="申请单位"
        >
        </el-table-column>
        <el-table-column
          key="requester"
          prop="requester"
          label="联系人"
        >
        </el-table-column>
        <el-table-column
          key="access_net"
          prop="access_net"
          label="接入网络"
        >
          <template #default="scope">
            <span v-if="scope.row.access_net === 'sd_access'">省调接入网</span>
            <span v-if="scope.row.access_net === 'dd_access1'">地调第一接入网</span>
            <span v-if="scope.row.access_net === 'dd_access2'">地调第二接入网</span>
          </template>
        </el-table-column>
        <el-table-column
          key="access_net"
          prop="access_net"
          label="申请类型"
        >
          <template #default="scope">
            <span v-if="scope.row.type === 'new_node'">新节点接入</span>
            <span v-if="scope.row.type === 'new_biz'">新业务接入</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--key="debug_manufacturer"-->
        <!--prop="debug_manufacturer"-->
        <!--label="网络接入调试厂家"-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--key="debug_time"-->
        <!--prop="debug_time"-->
        <!--label="申请调试时间"-->
        <!--&gt;-->
        <!--<template #default="scope">-->
        <!--<span v-if="scope.row.debug_time && scope.row.debug_time.indexOf('0001') === 0"></span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          key="state"
          prop="state"
          label="状态"
        >
          <template #default="scope">
            <span style="color: blue;" v-if="scope.row.state === 'approving'">待审批</span>
            <span style="color: blue;" v-if="scope.row.state === 'approved'">已审批</span>
            <span style="color: blue;" v-if="scope.row.state === 'returned'">已退回</span>
            <span style="color: blue;" v-if="scope.row.state === 'allocated'">已分配地址</span>
          </template>
        </el-table-column>
        <el-table-column
          key="created_at"
          prop="created_at"
          label="提交申请时间"
        >
          <template #default="scope">
            <span v-if="scope.row.created_at && scope.row.created_at.length > 19">{{scope.row.created_at.substring(0, 10)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="operations"
          prop="operations"
          width="280"
          label="操作"
        >
          <template #default="scope">
            <el-button size="small" icon="view" :record-id="scope.row.id" @click="handleShowView(scope.row)">查看</el-button>
            <el-button type="primary" v-if="scope.row.state === 'allocated'" size="small" icon="View" :record-id="scope.row.id" @click="handleShowIP(scope.row)">查看IP</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float: right; margin-right: 20px;margin-top: 10px;"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[100, 200, 300, 500, 1000, 2000]"
        :total="gridData.length">
      </el-pagination>
      <allocated-address ref="allocatedIP"></allocated-address>
      <request-view ref="requestView"></request-view>
    </template>
  </layout>
</template>

<script setup>
import Layout from '@/components/Layout/List.vue';
import { onMounted, ref, reactive, getCurrentInstance, computed } from 'vue';
import { getRequests, allocateAddress, getAllocatedAddress } from '@/api/accessRequests';
import { getStations } from '@/api/dkCloud';
import AllocatedAddress from '@/views/AccessApplications/ShowAllocatedIP.vue';
import RequestView from '@/views/AccessApplications/ShowRequestView.vue';

const gridData = ref([]);
const requestView = ref(null);
const query = reactive({ title: '', requester: '', debuManu: '' });
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(100);

const allocatedIP = ref(null);
const allSiteMap = ref({});

onMounted(() => {
  loadRequest();

  getStations(true).then((response) => {
    const siteMap = {};
    for (const s of response) {
      siteMap[s.id] = s;
    }
    allSiteMap.value = siteMap;
  }, (response) => {
  });
});

const handleShowIP = (request) => {
  request.site_name = allSiteMap.value[request.dk_site_id] ? allSiteMap.value[request.dk_site_id].name : request.dk_site_id;
  getAllocatedAddress(request.id).then((response) => {
    allocatedIP.value.show(request, response);
  });
};

const handleShowView = (request) => {
  request.site_name = allSiteMap.value[request.dk_site_id] ? allSiteMap.value[request.dk_site_id].name : request.dk_site_id;
  requestView.value.show(request);
};

const loadRequest = () => {
  isLoading.value = true;
  const p = { states: ['allocated'] };
  if (query.title) {
    p.title = query.title;
  }
  if (query.requester) {
    p.requester = query.requester;
  }
  if (query.debugManu) {
    p.debugManu = query.debugManu;
  }

  getRequests(p).then((response) => {
    if (response) {
      for (const req of response) {
        req.bizs.sort(function(b1, b2) {
          return b1.id - b2.id;
        });
      }
    }

    gridData.value = response || [];

    isLoading.value = false;
  });
};

const portIds = computed({
  get: () => {
    const ids = [];
    for (let i = 1; i < 49; i++) {
      ids.push('G0/' + i);
    }
    return ids;
  },
});
</script>
