<template>
  <el-dialog
    width="70%"
    top="2vh"
    v-model="ipDialogVisible"
    title="查看IP"
  >
    <div ref="ipViewWrap" style="margin-left: 15%;width: 1024px;">
      <table class="table table-bordered" style="width: 100%;" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
          <td colspan="4" style="text-align: center;font-size: 32px;">
            {{addresses.title}}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="font-size: 20px;font-weight: bold;">路由器</td>
          <td colspan="2" style="font-size: 20px;font-weight: bold;">IP地址</td>
        </tr>
        <tr>
          <td>Route ID</td>
          <td>{{addresses.route_id}}</td>
          <td>{{addresses.loopback_ip}}</td>
          <td>MASK:{{addresses.loopback_mask}}</td>
        </tr>
        <tr>
          <td>I区接入网关</td>
          <td>{{addresses.gate_id1}}</td>
          <td>{{addresses.gate_ip1}}</td>
          <td>MASK:{{addresses.gate_mask1}}</td>
        </tr>
        <tr>
          <td>I区接入网关</td>
          <td>{{addresses.gate_id2}}</td>
          <td>{{addresses.gate_ip2}}</td>
          <td>MASK:{{addresses.gate_mask2}}</td>
        </tr>
        <tr>
          <td rowspan="2">互联网1</td>
          <td>本端：{{addresses.site_name}}</td>
          <td>{{addresses.internet_local_ip1}}</td>
          <td>MASK:{{addresses.internet_local_mask1}}</td>
        </tr>
        <tr>
          <td>对端：{{addresses.peer_name1}}</td>
          <td>{{addresses.internet_peer_ip1}}</td>
          <td>MASK:{{addresses.internet_peer_mask1}}</td>
        </tr>
        <tr>
          <td rowspan="2">互联网2</td>
          <td>本端：{{addresses.site_name}}</td>
          <td>{{addresses.internet_local_ip2}}</td>
          <td>MASK:{{addresses.internet_local_mask2}}</td>
        </tr>
        <tr>
          <td>对端：{{addresses.peer_name2}}</td>
          <td>{{addresses.internet_peer_ip2}}</td>
          <td>MASK:{{addresses.internet_peer_mask2}}</td>
        </tr>
        <tr>
          <td colspan="2" style="font-size: 20px;font-weight: bold;">接入交换机</td>
          <td colspan="2" style="font-size: 20px;font-weight: bold;">管理IP</td>
        </tr>

        <tr>
          <td colspan="2">I区接入交换机</td>
          <td>{{addresses.switch_ip1}}</td>
          <td>MASK:{{addresses.switch_mask1}}</td>
        </tr>
        <tr>
          <td colspan="2">II区接入交换机</td>
          <td>{{addresses.switch_ip2}}</td>
          <td>MASK:{{addresses.switch_mask2}}</td>
        </tr>
        <tr>
          <td colspan="2" style="font-size: 20px;font-weight: bold;">业务类别</td>
          <td style="font-size: 20px;font-weight: bold;">业务主机IP</td>
          <td style="font-size: 20px;font-weight: bold;">交换机端口</td>
        </tr>
        <tr v-for="(bizAddress, index) in addresses.biz_addresses1" v-bind:key="index">
          <td v-if="index === 0" :rowspan="addresses.biz_addresses1.length">I区</td>
          <td>{{bizAddress.name}}</td>
          <td>{{bizAddress.ip}}</td>
          <td>{{bizAddress.port}}</td>
        </tr>
        <tr v-for="(bizAddress, index) in addresses.biz_addresses2" v-bind:key="index">
          <td v-if="index === 0" :rowspan="addresses.biz_addresses2.length">II区</td>
          <td>{{bizAddress.name}}</td>
          <td>{{bizAddress.ip}}</td>
          <td>{{bizAddress.port}}</td>
        </tr>
        <tr>
          <td colspan="4" style="color: red;">
            <span style="font-weight: bold;">★调试人员须知，请仔细阅读:</span>
            网络调试和业务调试技术人员请严格按照表格分配的端口接口设备，请勿乱接。严禁个人调试电脑接入调度数据网络中，严禁调试电脑连接互联网。
            调度数据网路由器、交换机根据设备型号需使用国网指定的系统版本，版本不符，不给联调。
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div style="text-align: center;margin-top: 20px;">
      <el-button icon="download" @click="generateImage()">导出</el-button>
      <el-button type="primary" icon="close" @click="ipDialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, defineExpose } from 'vue';
import { genImage } from '@/utils/index';

const ipDialogVisible = ref(false);
const ipViewWrap = ref(null);
const addresses = ref(null);

const generateImage = () => {
  genImage(ipViewWrap.value, 'IP地址');
};

const show = (request, address) => {
  const bizMap = {};
  for (const biz of request.bizs) {
    bizMap[biz.id] = biz;
  }

  const bizAddresses1 = [];
  const bizAddresses2 = [];
  for (const bizAddress of address.biz_addresses) {
    const biz = bizMap[bizAddress.biz_id];
    bizAddress.name = biz.name;
    if (biz.location === 'zone1') {
      bizAddresses1.push(bizAddress);
    } else if (biz.location === 'zone2') {
      bizAddresses2.push(bizAddress);
    }
  }
  address.biz_addresses1 = bizAddresses1;
  address.biz_addresses2 = bizAddresses2;
  address.site_name = request.site_name;

  let netDescr = '';
  if (request.access_net === 'sd_access') {
    netDescr = '省调接入网';
    address.peer_name1 = request.attributes.sd_uplink1;
    address.peer_name2 = request.attributes.sd_uplink2;
  } else if (request.access_net === 'dd_access1') {
    netDescr = '地调第一接入网';
    address.peer_name1 = request.attributes.dd_first_uplink1;
    address.peer_name2 = request.attributes.dd_first_uplink2;
  } else if (request.access_net === 'dd_access2') {
    netDescr = '地调第二接入网';
    address.peer_name1 = request.attributes.dd_second_uplink1;
    address.peer_name2 = request.attributes.dd_second_uplink2;
  }

  address.title = request.request_company + '调度数据网参数（' + netDescr + '）' + request.top_voltage + 'kV' + request.site_name + '申请时间：' + (request.created_at && request.created_at.substring(0, 10));
  addresses.value = address;
  ipDialogVisible.value = true;
};

defineExpose({ show });
</script>
