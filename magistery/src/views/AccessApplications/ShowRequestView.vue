<template>
  <el-dialog
    width="70%"
    top="2vh"
    v-model="viewDialogVisible"
    :title="previewShowButton ? '预览' : '查看'">
    <div ref="requestViewWrap" style="margin-left: 15%;width: 1024px;">
      <table class="table table-bordered" style="width: 100%;" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td colspan="4" style="text-align: center;font-size: 32px;" >
              <span v-if="request.type === 'new_node'">电力调度数据网新节点接入审批单</span>
              <span v-if="request.type === 'new_biz'">电力调度数据网新业务接入审批单</span>
            </td>
          </tr>
          <tr>
            <td style="width: 200px;">申请单位名称</td><td>{{request.request_company}}</td><td style="width: 200px;">厂站名称</td><td>{{request.site_name || request.dk_site_id}}</td>
          </tr>
          <tr><td>联系人</td><td>{{request.requester}}</td><td>电压等级</td><td>{{request.top_voltage || ''}}kV</td></tr>
          <tr>
            <td>接入网络</td>
            <td>
              <span v-if="accessNet === 'sd_access'">省调接入网</span>
              <span v-if="accessNet === 'dd_access1'">地调第一接入网</span>
              <span v-if="accessNet === 'dd_access2'">地调第二接入网</span>
            </td>
            <td></td><td></td>
          </tr>

          <tr v-if="accessNet === 'sd_access' && request.type === 'new_node'">
            <td>路由器设备厂家型号</td>
            <td>{{request.attributes.sd_route_model}}</td>
            <td>交换机厂家型号</td>
            <td>{{request.attributes.sd_switch_model}}</td>
          </tr>
          <tr v-if="accessNet === 'dd_access1' && request.type === 'new_node'">
            <td>路由器设备厂家型号</td>
            <td>{{request.attributes.dd_route_model1}}</td>
            <td>交换机厂家型号</td>
            <td>{{request.attributes.dd_switch_model1}}</td>
          </tr>
          <tr v-if="accessNet === 'dd_access2' && request.type === 'new_node'">
            <td>路由器设备厂家型号</td>
            <td>{{request.attributes.dd_route_model2}}</td>
            <td>交换机厂家型号</td>
            <td>{{request.attributes.dd_switch_model2}}</td>
          </tr>
          <tr v-if="request.type === 'new_node'">
            <td>
              I区纵向加密装置厂家型号
            </td>
            <td></td>
            <td>
              II区纵向加密装置厂家型号
            </td>
            <td></td>
          </tr>
          <tr>
            <td>网络接入调试厂家</td>
            <td>{{request.debug_manu}}</td>
            <td>申请调试时间</td>
            <td>
              <span v-if="request.debug_time && request.debug_time.indexOf('0001') !== 0">{{request.debug_time && request.debug_time.substring(0, 10)}}</span>
            </td>
          </tr>
          <tr v-if="request.type === 'new_node'">
            <td style="height: 150px;">
              通信通道拓扑图
            </td>
            <td colspan="3" style="position: relative;">
              <span v-if="accessNet === 'sd_access' && request.attributes.sd_uplink1 && request.attributes.sd_uplink2">
                <div style="position: absolute;left: 50px; top: 20px;border: solid 1px silver;padding: 10px;">{{request.attributes.sd_uplink1}}</div>
                <div style="position: absolute;left: 300px; top: 20px;border: solid 1px silver;padding: 10px;">{{request.attributes.sd_uplink2}}</div>
                <div style="position: absolute;left: 170px; top: 110px;border: solid 1px silver;padding: 10px; color: green;">{{request.site_name || request.dk_site_id}}</div>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="width: 100%; height: 100%;">
                <line x1="75" y1="55" x2="190" y2="100" style="stroke:rgb(200,200,200);stroke-width:2"/>
                <line x1="200" y1="100" x2="325" y2="55" style="stroke:rgb(200,200,200);stroke-width:2"/>
              </svg>
              </span>
              <span v-if="accessNet === 'dd_access1' && request.attributes.dd_first_uplink1 && request.attributes.dd_first_uplink2">
                <div style="position: absolute;left: 50px; top: 20px;border: solid 1px silver;padding: 10px;">{{request.attributes.dd_first_uplink1}}</div>
                <div style="position: absolute;left: 300px; top: 20px;border: solid 1px silver;padding: 10px;">{{request.attributes.dd_first_uplink2}}</div>
                <div style="position: absolute;left: 170px; top: 110px;border: solid 1px silver;padding: 10px; color: green;">{{request.site_name || request.dk_site_id}}</div>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="width: 100%; height: 100%;">
                <line x1="75" y1="55" x2="190" y2="100" style="stroke:rgb(200,200,200);stroke-width:2"/>
                <line x1="200" y1="100" x2="325" y2="55" style="stroke:rgb(200,200,200);stroke-width:2"/>
              </svg>
              </span>
              <span v-if="accessNet === 'dd_access2' && request.attributes.dd_second_uplink1 && request.attributes.dd_second_uplink2">
                <div style="position: absolute;left: 50px; top: 20px;border: solid 1px silver;padding: 10px;">{{request.attributes.dd_second_uplink1}}</div>
                <div style="position: absolute;left: 300px; top: 20px;border: solid 1px silver;padding: 10px;">{{request.attributes.dd_second_uplink2}}</div>
                <div style="position: absolute;left: 170px; top: 110px;border: solid 1px silver;padding: 10px; color: green;">{{request.site_name || request.dk_site_id}}</div>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="width: 100%; height: 100%;">
                <line x1="75" y1="55" x2="190" y2="100" style="stroke:rgb(200,200,200);stroke-width:2"/>
                <line x1="200" y1="100" x2="325" y2="55" style="stroke:rgb(200,200,200);stroke-width:2"/>
              </svg>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table table-bordered" style="width: 100%; position: relative; top:-3px;" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
          <td :rowspan="bizList1.length + bizList2.length + 1" style="width: 30px;vertical-align: middle;">计划接入的业务</td>
          <td style="width: 25px;"></td>
          <td>业务名</td>
          <td>业务端口号</td>
          <td>备注</td>
        </tr>
        <tr v-for="(biz, index) in bizList1" v-bind:key="index">
          <td v-if="index === 0" :rowspan="bizList1.length" style="width: 25px; vertical-align: middle; word-break: break-all;">一区</td>
          <td>{{biz.name}}</td>
          <td>{{biz.ports}}</td>
          <td>{{biz.description}}</td>
        </tr>
        <tr v-for="(biz, index) in bizList2" v-bind:key="index">
          <td v-if="index === 0" :rowspan="bizList2.length" style="width: 25px; vertical-align: middle; word-break: break-all;">二区</td>
          <td>{{biz.name}}</td>
          <td>{{biz.ports}}</td>
          <td>{{biz.description}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div style="text-align: center;" v-if="accessNets && accessNets.length > 1">
      <el-radio-group v-model="tabPosition" style="margin-bottom: 0; margin-top: 10px;">
        <el-radio-button :label="n" v-for="n in accessNets" v-bind:key="n" @click="handleSwitchNet(n)">{{accessNetNames[n]}}</el-radio-button>
      </el-radio-group>
    </div>
    <div style="text-align: center;margin-top: 50px;" v-if="previewShowButton === false && accessNets.length <= 1">
      <el-button icon="download" @click="generateImage()">导出</el-button>
      <el-button type="primary" icon="close" @click="viewDialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, defineExpose } from 'vue';
import { genImage } from '@/utils/index';

const viewDialogVisible = ref(false);
const previewShowButton = ref(false);
const requestViewWrap = ref(null);
const request = ref({});
const bizList1 = ref([]);
const bizList2 = ref([]);
const tabPosition = ref('');
const accessNetNames = { sd_access: '省调接入网', dd_access1: '地调第一接入网', dd_access2: '地调第二接入网' };
const accessNets = ref([]);
const accessNet = ref('');

const generateImage = () => {
  genImage(requestViewWrap.value, '请求');
};

const show = (req, accNets: any) => {
  accessNet.value = req.access_net;
  bizList1.value = [];
  bizList2.value = [];
  request.value = req;
  if (accNets) {
    accessNets.value = accNets;
    tabPosition.value = accNets[0];
  } else {
    accessNets.value = [];
    tabPosition.value = '';
  }

  if (req.bizs) {
    for (const biz of req.bizs) {
      if (biz.location === 'zone1') {
        bizList1.value.push(biz);
      } else if (biz.location === 'zone2') {
        bizList2.value.push(biz);
      }
    }
  }
  viewDialogVisible.value = true;
};

const handleSwitchNet = (net) => {
  accessNet.value = net;
};

defineExpose({ show });
</script>
