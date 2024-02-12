<template>
  <layout ref="layout" list-title="数据网IP分配" :stat-visible="false" >
    <template #header>
      标题：
      <el-input
        style="display:inline-block; border-radius: 0; margin-right: 30px;"
        class="search-input"
        input-style="width:200px"
      />
      <el-button key="addSite" type="primary" icon="search" >查询</el-button>
    </template>
    <template #list>
      <el-table
        border
        :data="gridData"
        style="width: 100%">
        <el-table-column
          key="title"
          prop="title"
          label="标题"
          width="300"
        >
        </el-table-column>
        <el-table-column
          key="state"
          prop="state"
          label="状态"
        >
        </el-table-column>
        <el-table-column
          key="created_at"
          prop="created_at"
          label="申请时间"
        >
        </el-table-column>
        <el-table-column
          key="operations"
          prop="operations"
          width="280"
          label="操作"
        >
          <template #default="scope">
            <el-button size="small" icon="view" :record-id="scope.row.id" @click="viewDialogVisible = true">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        width="50%"
        top="3vh"
        v-model="viewDialogVisible"
        title="地址查看">
        <el-form ref="formRef" :model="formData" label-width="150px">
          <el-scrollbar height="700px" style="padding-left: 20px; padding-right: 20px;">
            <table class="table table-bordered" cellspacing="0" cellpadding="0" style="width: 100%;">
              <tbody>
                <tr>
                  <td colspan="4">
                    <h2>阜阳公司调度数据网参数（省调接入网）220kV泉鞍变</h2>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="font-weight: bold;">路由器</td>
                  <td colspan="2" style="font-weight: bold;">IP地址</td>
                </tr>
                <tr>
                  <td>Route ID</td>
                  <td>Looback0</td>
                  <td>
                    <el-input style="width: 235px;" value="34.2.21.50"></el-input>
                  </td>
                  <td>Mask: 255.255.255.255</td>
                </tr>
                <tr>
                  <td>I区接入网关</td>
                  <td>
                    <el-input value="E0/0/0" style="width: 235px;"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="34.103.25.126"></el-input>
                  </td>
                  <td>Mask: 255.255.255.0</td>
                </tr>
                <tr>
                  <td>II区接入网关</td>
                  <td>
                    <el-input value="E0/0/1" style="width: 235px;"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="34.102.25.126"></el-input>
                  </td>
                  <td>Mask: 255.255.255.0</td>
                </tr>
                <tr>
                  <td rowspan="2">互联网1</td>
                  <td>
                    <span>本端:</span><el-input style="display: inline-block;width:200px;margin-left: 5px;" value="泉鞍变"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="34.3.5.110"></el-input>
                  </td>
                  <td>Mask: 255.255.255.252</td>
                </tr>
                <tr>
                  <td>
                    <span>对端:</span><el-input style="display: inline-block;width:200px;margin-left: 5px;" value="颍州变"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="34.3.5.109"></el-input>
                  </td>
                  <td>Mask: 255.255.255.252</td>
                </tr>
                <tr>
                  <td rowspan="2">互联网2</td>
                  <td>
                    <span>本端:</span><el-input style="display: inline-block;width:200px;margin-left: 5px;" value="泉鞍变"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="34.3.5.114"></el-input>
                  </td>
                  <td>Mask: 255.255.255.252</td>
                </tr>
                <tr>
                  <td>
                    <span>对端:</span><el-input style="display: inline-block;width:200px;margin-left: 5px;" value="太和变"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="34.3.5.113"></el-input>
                  </td>
                  <td>Mask: 255.255.255.252</td>
                </tr>
                <tr>
                  <td colspan="2" style="font-weight: bold;">接入交换机</td>
                  <td colspan="2" style="font-weight: bold;">管理IP</td>
                </tr>
                <tr>
                  <td colspan="2">I区接入交换机</td>
                  <td>
                    <el-input style="width: 235px;" value="34.103.25.125"></el-input>
                  </td>
                  <td>Mask: 255.255.255.0</td>
                </tr>
                <tr>
                  <td colspan="2">II区接入交换机</td>
                  <td>
                    <el-input style="width: 235px;" value="34.102.25.125"></el-input>
                  </td>
                  <td>Mask: 255.255.255.0</td>
                </tr>
                <tr>
                  <td colspan="2" style="font-weight: bold;">业务类别</td>
                  <td style="font-weight: bold;">业务主机IP</td>
                  <td style="font-weight: bold;">交换机端口</td>
                </tr>
                <tr>
                  <td>I区</td>
                  <td>RTU</td>
                  <td>
                    <el-input style="width: 235px;" value="34.103.25.125"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="G0/1"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>I区</td>
                  <td>AGC/AVC</td>
                  <td>
                    <el-input style="width: 235px;" value="34.103.25.66"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="G0/2"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>I区</td>
                  <td>网安</td>
                  <td>
                    <el-input style="width: 235px;" value="34.103.25.122"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="G0/24"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>I区</td>
                  <td>网安</td>
                  <td>
                    <el-input style="width: 235px;" value="34.103.25.122"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="G0/24"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>I区</td>
                  <td>加密</td>
                  <td>
                    <el-input style="width: 235px;" value="34.103.25.124"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="G0/24"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>II区</td>
                  <td>电量</td>
                  <td>
                    <el-input style="width: 235px;" value="34.102.25.65"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="G0/1"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>II区</td>
                  <td>保信子站</td>
                  <td>
                    <el-input style="width: 235px;" value="34.102.25.66"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="G0/2"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>II区</td>
                  <td>故障录波</td>
                  <td>
                    <el-input style="width: 235px;" value="34.102.25.67"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="G0/3"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>II区</td>
                  <td>网安</td>
                  <td>
                    <el-input style="width: 235px;" value="34.102.25.122"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="G0/21"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>II区</td>
                  <td>加密</td>
                  <td>
                    <el-input style="width: 235px;" value="34.102.25.124"></el-input>
                  </td>
                  <td>
                    <el-input style="width: 235px;" value="G0/24"></el-input>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-scrollbar>
        </el-form>
      </el-dialog>
    </template>
  </layout>
</template>

<script setup>
import Layout from '@/components/Layout/List.vue';
import { onMounted, ref, reactive, getCurrentInstance } from 'vue';
const gridData = ref([]);
const formData = reactive({});
const viewDialogVisible = ref(false);

onMounted(() => {
  gridData.value = [
    { title: '阜阳公司调度数据网参数（省调接入网）220kV泉鞍变', contact: '***/13112345678', applicant: '省公司', state: '已通过', debug_manufacturer: '', debug_time: '', created_at: '2023-09-20 14:23:02' },
  ];
});
</script>
