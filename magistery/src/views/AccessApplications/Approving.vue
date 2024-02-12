<template>
  <layout ref="layout" list-title="数据网待审核清单" :stat-visible="false" >
    <template #list>
      <el-table
        border
        table-layout="auto"
        :data="gridData"
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
            <el-button size="small" icon="check" :record-id="scope.row.id" @click="handleApprove(scope.row)">通过</el-button>
            <el-button size="small" icon="back" :record-id="scope.row.id" @click="handleReject(scope.row)">退回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        width="70%"
        top="3vh"
        :close-on-click-modal="false"
        v-model="previewDialogVisible"
        title="查看">
        <div ref="viewWrap" style="margin-left: 15%;width: 1024px;">
          <table class="table table-bordered" style="width: 100%;" cellspacing="0" cellpadding="0">
            <tbody>
            <tr>
              <td colspan="4" style="text-align: center;font-size: 32px;" >电力调度数据网新节点接入审批单</td>
            </tr>
            <tr>
              <td style="width: 200px;">申请单位名称</td><td>阜阳供电公司</td><td style="width: 200px;">新增节点名称</td><td>泉鞍变</td>
            </tr>
            <tr><td>联系人</td><td>***</td><td>电压等级</td><td>220kV</td></tr>
            <tr><td>接入网络</td><td>省调接入网</td><td></td><td></td></tr>
            <tr><td>路由器设备厂家型号</td><td></td><td>交换机厂家型号</td><td></td></tr>
            <tr><td>网络接入调试厂家</td><td></td><td>申请调试时间</td><td></td></tr>
            <tr>
              <td style="height: 150px;">
                通信通道拓扑图
              </td>
              <td colspan="3" style="position: relative;">
                <div style="position: absolute;left: 50px; top: 20px;border: solid 1px silver;padding: 10px;">颍州变</div>
                <div style="position: absolute;left: 300px; top: 20px;border: solid 1px silver;padding: 10px;">太和变</div>
                <div style="position: absolute;left: 170px; top: 110px;border: solid 1px silver;padding: 10px; color: green;">泉鞍变</div>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="width: 100%; height: 100%;">
                  <!--<path id="lineBC" d="M 70 55 l 120 35" stroke="gray" stroke-width="2" fill="none" />-->
                  <!--<path id="lineBC" d="M 200 90 l 300 -90" stroke="gray" stroke-width="2" fill="none" />-->
                  <line x1="75" y1="55" x2="190" y2="100" style="stroke:rgb(200,200,200);stroke-width:2"/>
                  <line x1="200" y1="100" x2="325" y2="55" style="stroke:rgb(200,200,200);stroke-width:2"/>
                </svg>
              </td>
            </tr>
            </tbody>
          </table>
          <table class="table table-bordered" style="width: 100%; position: relative; top:-1px;" cellspacing="0" cellpadding="0">
            <tbody>
            <tr>
              <td rowspan="10" style="width: 30px;vertical-align: middle;">计划接入的业务</td>
              <td style="width: 25px;"></td>
              <td>业务名</td>
              <td>业务端口号</td>
              <td>备注</td>
            </tr>
            <tr>
              <td rowspan="4" style="width: 25px; vertical-align: middle; word-break: break-all;">一区</td>
              <td>综自系统</td>
              <td>2404</td>
              <td></td>
            </tr>
            <tr>
              <td>五防</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>纵向加密</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>网安</td>
              <td>2404</td>
              <td></td>
            </tr>
            <tr>
              <td rowspan="5" style="width: 25px; vertical-align: middle; word-break: break-all;">二区</td>
              <td>电量</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>保信子站</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>故障录波</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>纵向加密</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>网安</td>
              <td></td>
              <td></td>
            </tr>
            </tbody>
          </table>
        </div>
        <div style="text-align: center;margin-top: 50px;">
          <el-button type="primary" icon="check">通过</el-button>
          <el-button type="warning" icon="back">退回</el-button>
        </div>
      </el-dialog>
      <el-dialog
        width="50%"
        top="3vh"
        v-model="confirmDialogVisible"
        title="审批">
        <el-form label-width="150px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="意见">
                <el-input type="textarea" v-model="comment"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button v-if="currentAction === 'approve'" key="btnApprove" type="primary" @click="doUpdate()">通过</el-button>
            <el-button v-if="currentAction === 'reject'" key="btnReject" type="primary" @click="doUpdate()">退回</el-button>
            <el-button key="btnCancel" @click="confirmDialogVisible = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
      <request-view ref="requestView"></request-view>
    </template>
  </layout>
</template>

<script setup>
import Layout from '@/components/Layout/List.vue';
import { onMounted, ref, reactive, getCurrentInstance } from 'vue';
import { getRequests, updateRequest } from '@/api/accessRequests';
import { getStations } from '@/api/dkCloud';
import { anhuiStore } from '@/store/anhui';
import RequestView from '@/views/AccessApplications/ShowRequestView.vue';

const comment = ref('');
const confirmDialogVisible = ref(false);
const currentRequest = ref(null);
const currentAction = ref('');

const gridData = ref([]);
const query = reactive({ title: '', contact: '', manufacturer: '' });
const requestView = ref(null);

const voltageLevels = ref([]);
const cityCompanies = ref([]);
const bizTypes1 = ref([]);
const bizTypes2 = ref([]);
const allSiteMap = ref({});

onMounted(() => {
  anhuiStore.init().then(() => {
    voltageLevels.value = anhuiStore.VoltageLevels;
    cityCompanies.value = anhuiStore.CityCompanies;
    bizTypes1.value = anhuiStore.BizTypes1;
    bizTypes2.value = anhuiStore.BizTypes2;

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
});

const handleShowView = (request) => {
  request.site_name = allSiteMap.value[request.dk_site_id] ? allSiteMap.value[request.dk_site_id].name : request.dk_site_id;
  requestView.value.show(request);
};

const handleApprove = (req) => {
  currentRequest.value = req;
  currentAction.value = 'approve';
  confirmDialogVisible.value = true;
};

const handleReject = (req) => {
  currentRequest.value = req;
  currentAction.value = 'reject';
  confirmDialogVisible.value = true;
};

const doUpdate = () => {
  const req = currentRequest.value;
  req.attributes[currentAction.value + '_comment'] = comment.value;
  req.attributes[currentAction.value + '_at'] = new Date();
  req.state = currentAction.value === 'approve' ? 'approved' : 'rejected';
  updateRequest(req.id, req).then(() => {
    confirmDialogVisible.value = false;
    loadRequest();
  });
};

const handleQuery = () => {
};

const loadRequest = () => {
  getRequests({ states: ['approving'] }).then((response) => {
    if (response) {
      for (const req of response) {
        req.bizs.sort(function(b1, b2) {
          return b1.id - b2.id;
        });
      }
    }

    gridData.value = response || [];
  });
};
</script>
