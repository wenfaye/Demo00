<template>
  <layout ref="layout" list-title="数据网已审核清单" :stat-visible="false" >
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
            <el-button type="primary" v-if="scope.row.state === 'approved'" size="small" icon="EditPen" :record-id="scope.row.id" @click="handleAllocateIP(scope.row)">分配IP</el-button>
            <el-button type="primary" v-if="scope.row.state === 'allocated'" size="small" icon="View" :record-id="scope.row.id" @click="handleShowIP(scope.row)">查看IP</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        width="50%"
        top="3vh"
        :close-on-click-modal="false"
        v-model="allocateIPDialogVisible"
        title="分配IP">
        <el-form ref="formRef" :model="ipFormData" label-width="150px">
          <el-scrollbar height="800px" style="padding-left: 20px; padding-right: 20px;">
            <el-form-item required>
              <table class="table table-bordered" cellspacing="0" cellpadding="0" style="width: 100%;">
              <tbody>
                <tr>
                  <td colspan="2" style="font-weight: bold;">路由器</td>
                  <td colspan="2" style="font-weight: bold;">IP地址</td>
                </tr>
                <tr>
                  <td>路由器</td>
                  <td>
                    <el-form-item prop="route_id" :rules="[ { required: true, message: '不能为空' } ]">
                      <el-input v-model="ipFormData.route_id" style="width: 235px;" ></el-input>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item prop="loopback_ip" :rules="[ { required: true, message: '不能为空' } ]">
                      <el-input style="width: 235px;" v-model="ipFormData.loopback_ip"></el-input>
                    </el-form-item>
                  </td>
                  <td>Mask: {{ipFormData.loopback_mask}}</td>
                </tr>
                <tr>
                  <td>I区接入网关</td>
                  <td>
                    <el-form-item prop="gate_id1" :rules="[ { required: true, message: '不能为空' } ]">
                      <el-input v-model="ipFormData.gate_id1" style="width: 235px;"></el-input>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item prop="gate_ip1" :rules="[ { required: true, message: '不能为空' } ]">
                      <el-input v-model="ipFormData.gate_ip1" style="width: 235px;"></el-input>
                    </el-form-item>
                  </td>
                  <td>Mask: {{ipFormData.gate_mask1}}</td>
                </tr>
                <tr>
                  <td>II区接入网关</td>
                  <td>
                    <el-form-item prop="gate_id2" :rules="[ { required: true, message: '不能为空' } ]">
                      <el-input v-model="ipFormData.gate_id2" style="width: 235px;"></el-input>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item prop="gate_ip2" :rules="[ { required: true, message: '不能为空' } ]">
                      <el-input v-model="ipFormData.gate_ip2" style="width: 235px;"></el-input>
                    </el-form-item>
                  </td>
                  <td>Mask: {{ipFormData.gate_mask2}}</td>
                </tr>
                <tr>
                  <td rowspan="2">互联网1</td>
                  <td>
                    <span>本端:</span>{{ipFormData.local_site_name}}
                  </td>
                  <td>
                    <el-form-item prop="internet_local_ip1" :rules="[ { required: true, message: '不能为空' } ]">
                      <el-input style="width: 235px;" v-model="ipFormData.internet_local_ip1"></el-input>
                    </el-form-item>
                  </td>
                  <td>Mask: {{ipFormData.internet_local_mask1}}</td>
                </tr>
                <tr>
                  <td>
                    <span>对端:</span>{{ipFormData.peer_name1}}
                  </td>
                  <td>
                    <el-form-item prop="internet_peer_ip1" :rules="[ { required: true, message: '不能为空' } ]">
                      <el-input style="width: 235px;" v-model="ipFormData.internet_peer_ip1"></el-input>
                    </el-form-item>
                  </td>
                  <td>Mask: {{ipFormData.internet_peer_mask1}}</td>
                </tr>
                <tr>
                  <td rowspan="2">互联网2</td>
                  <td>
                    <span>本端:</span>{{ipFormData.local_site_name}}
                  </td>
                  <td>
                    <el-form-item prop="internet_local_ip2" :rules="[ { required: true, message: '不能为空' } ]">
                      <el-input style="width: 235px;" v-model="ipFormData.internet_local_ip2"></el-input>
                    </el-form-item>
                  </td>
                  <td>Mask: {{ipFormData.internet_local_mask2}}</td>
                </tr>
                <tr>
                  <td>
                    <span>对端:</span>{{ipFormData.peer_name2}}
                  </td>
                  <td>
                    <el-form-item prop="internet_peer_ip2" :rules="[ { required: true, message: '不能为空' } ]">
                      <el-input style="width: 235px;" v-model="ipFormData.internet_peer_ip2"></el-input>
                    </el-form-item>
                  </td>
                  <td>Mask: {{ipFormData.internet_peer_mask2}}</td>
                </tr>
                <tr>
                  <td colspan="2" style="font-weight: bold;">接入交换机</td>
                  <td colspan="2" style="font-weight: bold;">管理IP</td>
                </tr>
                <tr>
                  <td colspan="2">I区接入交换机</td>
                  <td>
                    <el-form-item prop="switch_ip1" :rules="[ { required: true, message: '不能为空' } ]">
                      <el-input style="width: 235px;" v-model="ipFormData.switch_ip1"></el-input>
                    </el-form-item>
                  </td>
                  <td>Mask: {{ipFormData.switch_mask1}}</td>
                </tr>
                <tr>
                  <td colspan="2">II区接入交换机</td>
                  <td>
                    <el-form-item prop="switch_ip2" :rules="[ { required: true, message: '不能为空' } ]">
                      <el-input style="width: 235px;" v-model="ipFormData.switch_ip2"></el-input>
                    </el-form-item>
                  </td>
                  <td>Mask: {{ipFormData.switch_mask2}}</td>
                </tr>
                <tr>
                  <td colspan="2" style="font-weight: bold;">业务类别</td>
                  <td style="font-weight: bold;">业务主机IP</td>
                  <td style="font-weight: bold;">交换机端口</td>
                </tr>
                <tr v-for="(biz, index) in ipFormData.biz_addresses" v-bind:key="biz.biz_id">
                  <td>{{biz.location === 'zone1' ? 'I区' : 'II区'}}</td>
                  <td>{{biz.name}}</td>
                  <td>
                    <el-form-item :prop="'biz_addresses[' + index + ']ip'" :rules="[ { required: true, message: '不能为空' } ]">
                      <el-input v-model="biz.ip"></el-input>
                    </el-form-item>
                  </td>
                  <td>
                    <el-select v-model="biz.port" allow-create filterable clearable>
                      <el-option v-for="l in portIds" :label="l" :value="l" v-bind:key="l"></el-option>
                    </el-select>
                  </td>
                </tr>
              </tbody>
            </table>
            </el-form-item>
          </el-scrollbar>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="handleSaveAddress()">
              确定
            </el-button>
            <el-button @click="allocateIPDialogVisible = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
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

const formRef = ref(null);
const gridData = ref([]);
const ipFormData = reactive({ local_site_name: '', peer_name1: '', peer_name2: '', route_id: 'loopback 0', loopback_ip: '', loopback_mask: '255.255.255.255', gate_id1: 'E0/0/0', gate_ip1: '', gate_mask1: '255.255.255.192', gate_id2: 'E0/0/0', gate_ip2: '', gate_mask2: '255.255.255.192', internet_local_ip1: '', internet_local_mask1: '255.255.255.252', internet_peer_ip1: '', internet_peer_mask1: '255.255.255.252', internet_local_ip2: '', internet_local_mask2: '255.255.255.252', internet_peer_ip2: '', internet_peer_mask2: '255.255.255.252', switch_ip1: '', switch_mask1: '255.255.255.192', switch_ip2: '', switch_mask2: '255.255.255.192', biz_addresses: [] });
const requestView = ref(null);
const allocateIPDialogVisible = ref(false);

const allocatedIP = ref(null);
const allSiteMap = ref({});
const currentRequest = ref(null);

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

const handleAllocateIP = (req) => {
  currentRequest.value = req;
  ipFormData.local_site_name = '';
  ipFormData.peer_name1 = '';
  ipFormData.peer_name2 = '';
  ipFormData.route_id = 'loopback 0';
  ipFormData.loopback_ip = '';
  ipFormData.loopback_mask = '255.255.255.255';
  ipFormData.gate_id1 = 'E0/0/0';
  ipFormData.gate_ip1 = '';
  ipFormData.gate_mask1 = '255.255.255.192';
  ipFormData.gate_id2 = 'E0/0/0';
  ipFormData.gate_ip2 = '';
  ipFormData.gate_mask2 = '255.255.255.192';
  ipFormData.internet_local_ip1 = '';
  ipFormData.internet_local_mask1 = '255.255.255.252';
  ipFormData.internet_peer_ip1 = '';
  ipFormData.internet_peer_mask1 = '255.255.255.252';
  ipFormData.internet_local_ip2 = '';
  ipFormData.internet_local_mask2 = '255.255.255.252';
  ipFormData.internet_peer_ip2 = '';
  ipFormData.internet_peer_mask2 = '255.255.255.252';
  ipFormData.switch_ip1 = '';
  ipFormData.switch_mask1 = '255.255.255.192';
  ipFormData.switch_ip2 = '';
  ipFormData.switch_mask2 = '255.255.255.192';
  ipFormData.biz_addresses = [];

  req.site_name = allSiteMap.value[req.dk_site_id] ? allSiteMap.value[req.dk_site_id].name : req.dk_site_id;

  const bizAddresses = [];
  for (const biz of req.bizs) {
    bizAddresses.push({ biz_id: biz.id, ip: '', port: '', name: biz.name, location: biz.location });
  }
  ipFormData.biz_addresses = bizAddresses;
  ipFormData.local_site_name = req.site_name;
  if (req.access_net === 'sd_access') {
    ipFormData.peer_name1 = req.attributes.sd_uplink1;
    ipFormData.peer_name2 = req.attributes.sd_uplink2;
  } else if (req.access_net === 'dd_access1') {
    ipFormData.peer_name1 = req.attributes.dd_first_uplink1;
    ipFormData.peer_name2 = req.attributes.dd_first_uplink2;
  } else if (req.access_net === 'dd_access2') {
    ipFormData.peer_name1 = req.attributes.dd_second_uplink1;
    ipFormData.peer_name2 = req.attributes.dd_second_uplink2;
  }

  if (formRef.value) {
    formRef.value.resetFields();
  }

  allocateIPDialogVisible.value = true;
};

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

const handleSaveAddress = () => {
  const req = currentRequest.value;
  const allocatingAddress = {
    request_id: req.id,
    route_id: ipFormData.route_id,
    loopback_ip: ipFormData.loopback_ip,
    loopback_mask: ipFormData.loopback_mask,
    gate_id1: ipFormData.gate_id1,
    gate_ip1: ipFormData.gate_ip1,
    gate_mask1: ipFormData.gate_mask1,
    gate_id2: ipFormData.gate_id2,
    gate_ip2: ipFormData.gate_ip2,
    gate_mask2: ipFormData.gate_mask2,
    internet_local_ip1: ipFormData.internet_local_ip1,
    internet_local_mask1: ipFormData.internet_local_mask1,
    internet_peer_ip1: ipFormData.internet_peer_ip1,
    internet_peer_mask1: ipFormData.internet_peer_mask1,
    internet_local_ip2: ipFormData.internet_local_ip2,
    internet_local_mask2: ipFormData.internet_local_mask2,
    internet_peer_ip2: ipFormData.internet_peer_ip2,
    internet_peer_mask2: ipFormData.internet_peer_mask2,
    switch_ip1: ipFormData.switch_ip1,
    switch_mask1: ipFormData.switch_mask1,
    switch_ip2: ipFormData.switch_ip2,
    switch_mask2: ipFormData.switch_mask2,
    biz_addresses: [],
  };

  const bizAddresses = [];
  for (const ba of ipFormData.biz_addresses) {
    bizAddresses.push({ biz_id: ba.biz_id, ip: ba.ip, port: ba.port });
  }
  allocatingAddress.biz_addresses = bizAddresses;

  formRef.value.validate((valid) => {
    if (valid) {
      allocateAddress(allocatingAddress).then(() => {
        allocateIPDialogVisible.value = false;
        loadRequest();
      });
    }
  });
};

const loadRequest = () => {
  getRequests({ states: ['approved'] }).then((response) => {
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
