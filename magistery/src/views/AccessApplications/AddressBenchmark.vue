<template>
  <layout ref="layout" list-title="地址规划" :stat-visible="false" >
    <template #header>
      <!--地址：-->
      <!--<el-input-->
        <!--style="display:inline-block; border-radius: 0; margin-right: 40px;"-->
        <!--class="search-input"-->
        <!--input-style="width:200px"-->
      <!--&gt;-->
      <!--</el-input>-->
      <!--<el-button key="addSite" type="primary" icon="search" >查询</el-button>-->
    </template>
    <template #list>
      <div style="display: flex; top: 0; left: 0; right: 0; bottom: 0; position: absolute;">
        <div style="width: 280px; margin-right: 10px; border: solid 1px rgba(192, 192, 192, 0.5);">
          <el-scrollbar style="height: calc(100% - 10px);">
            <p style="position: relative;cursor: pointer;" v-for="area in areas" :key="area" :class="{ 'scrollbar-item': true, 'active': area === '阜阳' }">
              <span class="title" >{{area}}</span>
            </p>
          </el-scrollbar>
        </div>
        <div style="width: calc(100% - 310px);">
          <el-form ref="formRef" :model="formData" label-width="150px">
            <el-tabs type="card">
              <el-tab-pane label="省调接入网">
                <el-divider content-position="left" style="font-weight: bold;">规划地址范围</el-divider>
                <el-form-item
                  label="loopback地址范围"
                >
                  <el-col :span="8">
                    <el-input value="34.2.*.*"></el-input>
                  </el-col>
                  <el-col :span="1" style="text-align: center">--</el-col>
                  <el-col :span="8">
                    <el-input value="34.2.*.*"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item
                  label="互联地址范围"
                >
                  <el-col :span="8">
                    <el-input value="34.3.*.*"></el-input>
                  </el-col>
                  <el-col :span="1" style="text-align: center">--</el-col>
                  <el-col :span="8">
                    <el-input value="34.3.*.*"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item
                  label="实时业务地址范围"
                >
                  <el-col :span="8">
                    <el-input value="34.104.*.*"></el-input>
                  </el-col>
                  <el-col :span="1" style="text-align: center">--</el-col>
                  <el-col :span="8">
                    <el-input value="34.104.*.*"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item
                  label="非实时业务地址范围"
                >
                  <el-col :span="8">
                    <el-input value="34.105.*.*"></el-input>
                  </el-col>
                  <el-col :span="1" style="text-align: center">--</el-col>
                  <el-col :span="8">
                    <el-input value="34.105.*.*"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small">更新</el-button>
                </el-form-item>
                <el-divider content-position="left" style="font-weight: bold;">最近一次分配情况</el-divider>
                <el-form-item
                  label="loopback地址"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="8">
                      <el-input value="34.2.21.50"></el-input>
                    </el-col>
                    <el-col :span="1">
                    </el-col>
                    <el-col :span="8">
                      <el-input value="255.255.255.255"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="互联地址"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="8">
                      <el-input value="34.3.5.114"></el-input>
                    </el-col>
                    <el-col :span="1">
                    </el-col>
                    <el-col :span="8">
                      <el-input value="255.255.255.252"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="业务地址（I区）"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="8">
                      <el-input value="34.103.25.126"></el-input>
                    </el-col>
                    <el-col :span="1">
                    </el-col>
                    <el-col :span="8">
                      <el-input value="255.255.255.192"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="业务地址（II区）"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="8">
                      <el-input value="34.102.25.126"></el-input>
                    </el-col>
                    <el-col :span="1">
                    </el-col>
                    <el-col :span="8">
                      <el-input value="255.255.255.192"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="备注"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="17">
                      <el-input type="textarea" value="泉鞍变"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small">更新</el-button>
                </el-form-item>
                <!--<el-divider content-position="left" style="font-weight: bold;">分配情况统计</el-divider>-->
                <!--<el-row>-->
                  <!--<el-col :span="8">-->
                    <!--<el-form-item-->
                      <!--label="loopback地址"-->
                    <!--&gt;-->
                      <!--<el-progress :stroke-width="15" :percentage="25" striped style="width: 100%;" />-->
                    <!--</el-form-item>-->
                  <!--</el-col>-->
                  <!--<el-col :span="1"></el-col>-->
                  <!--<el-col :span="8">-->
                    <!--<el-form-item-->
                      <!--label="互联地址"-->
                    <!--&gt;-->
                      <!--<el-progress :stroke-width="15" :percentage="35" striped style="width: 100%;" />-->
                    <!--</el-form-item>-->
                  <!--</el-col>-->
                <!--</el-row>-->
                <!--<el-row>-->
                  <!--<el-col :span="8">-->
                    <!--<el-form-item-->
                      <!--label="实时业务地址"-->
                    <!--&gt;-->
                      <!--<el-progress :percentage="40" :stroke-width="15" striped style="width: 100%;" />-->
                    <!--</el-form-item>-->
                  <!--</el-col>-->
                  <!--<el-col :span="1"></el-col>-->
                  <!--<el-col :span="8">-->
                    <!--<el-form-item-->
                      <!--label="非实时业务地址"-->
                    <!--&gt;-->
                      <!--<el-progress :percentage="40" :stroke-width="15" striped style="width: 100%;" />-->
                    <!--</el-form-item>-->
                  <!--</el-col>-->
                <!--</el-row>-->
              </el-tab-pane>
              <el-tab-pane label="地调第一接入网">
                <el-form-item
                  label="loopback地址"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="8">
                      <el-input value="34.2.113.181"></el-input>
                    </el-col>
                    <el-col :span="1">
                    </el-col>
                    <el-col :span="8">
                      <el-input value="255.255.255.255"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="互联地址"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="8">
                      <el-input value="34.3.162.242"></el-input>
                    </el-col>
                    <el-col :span="1">
                    </el-col>
                    <el-col :span="8">
                      <el-input value="255.255.255.252"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="业务地址（I区）"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="8">
                      <el-input value="34.144.205.190"></el-input>
                    </el-col>
                    <el-col :span="1">
                    </el-col>
                    <el-col :span="8">
                      <el-input value="255.255.255.192"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="业务地址（II区）"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="8">
                      <el-input value="34.145.205.190"></el-input>
                    </el-col>
                    <el-col :span="1">
                    </el-col>
                    <el-col :span="8">
                      <el-input value="255.255.255.192"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="备注"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="17">
                      <el-input type="textarea" value="泉鞍变"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="地调第二接入网">
                <el-form-item
                  label="loopback地址"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="8">
                      <el-input value="34.2.113.181"></el-input>
                    </el-col>
                    <el-col :span="1">
                    </el-col>
                    <el-col :span="8">
                      <el-input value="255.255.255.255"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="互联地址"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="8">
                      <el-input value="34.3.162.242"></el-input>
                    </el-col>
                    <el-col :span="1">
                    </el-col>
                    <el-col :span="8">
                      <el-input value="255.255.255.252"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="业务地址（I区）"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="8">
                      <el-input value="34.144.205.190"></el-input>
                    </el-col>
                    <el-col :span="1">
                    </el-col>
                    <el-col :span="8">
                      <el-input value="255.255.255.192"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="业务地址（II区）"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="8">
                      <el-input value="34.145.205.190"></el-input>
                    </el-col>
                    <el-col :span="1">
                    </el-col>
                    <el-col :span="8">
                      <el-input value="255.255.255.192"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  label="备注"
                >
                  <el-row style="width: 100%;">
                    <el-col :span="17">
                      <el-input type="textarea" value="泉鞍变"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </div>
      </div>
      <el-dialog
        width="80%"
        top="3vh"
        v-model="addressListDialogVisible"
        title="地址列表"
      >
        <el-scrollbar height="700px" style="padding-left: 20px; padding-right: 20px;">
          <el-row>
            <el-col :span="12" style="padding-right: 5px;">
              <table class="table table-bordered" cellpadding="0" cellspacing="0" style="width: 100%;">
                <thead>
                <tr>
                  <th colspan="4"><h2>省调地址表（I区）</h2></th>
                </tr>
                <tr>
                  <th>网址</th>
                  <th>业务名</th>
                  <th>交换机端口</th>
                  <th>修改人及日期</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="n in 100" v-bind:key="n"><td>24.201.0.{{n}}</td><td></td><td></td><td><el-input></el-input></td></tr>
                </tbody>
              </table>
            </el-col>
            <el-col :span="12" style="padding-left: 5px;">
              <table class="table table-bordered" cellpadding="0" cellspacing="0" style="width: 100%;">
                <thead>
                <tr>
                  <th colspan="4"><h2>省调地址表（II区）</h2></th>
                </tr>
                <tr>
                  <th>网址</th>
                  <th>业务名</th>
                  <th>交换机端口</th>
                  <th>修改人及日期</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="n in 100" v-bind:key="n"><td>24.202.0.{{n}}</td><td></td><td></td><td><el-input></el-input></td></tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-dialog>
    </template>
  </layout>
</template>

<script setup>
import Layout from '@/components/Layout/List.vue';
import { onMounted, ref, reactive, getCurrentInstance } from 'vue';
const gridData = ref([]);
const formData = reactive({});
const addressListDialogVisible = ref(false);
const areas = ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城'];

onMounted(() => {
  gridData.value = [
    { name: '合肥', loopback: '34.2.11.0', internet: '192.168.11.0;192.168.10.0;192.168.6.0', realtime_address: '34.101.0.0-34.101.70.254', non_realtime_address: '34.100.0.0-34.100.70.254' },
    { name: '芜湖', loopback: '34.2.12.0', internet: '192.168.12.0;192.168.30.0', realtime_address: '34.101.71.0-34.101.112.254', non_realtime_address: '34.100.71.0-34.100.112.254' },
    { name: '蚌埠', loopback: '34.2.13.0', internet: '192.168.13.0;34.5.13.0', realtime_address: '34.101.113.0-34.101.133.254', non_realtime_address: '34.100.113.0-34.100.133.254' },
    { name: '淮南', loopback: '34.2.14.0', internet: '192.168.14.0;192.168.8.0', realtime_address: '34.101.134.0-34.101.154.254', non_realtime_address: '34.100.134.0-34.100.154.254' },
    { name: '马鞍山', loopback: '34.2.15.0', internet: '192.168.15.0;192.168.3.0', realtime_address: '34.101.155.0-34.101.175.254', non_realtime_address: '34.100.155.0-34.100.175.254' },
  ];
});

const handleShowAddressList = () => {
  addressListDialogVisible.value = true;
};
</script>

<style type="text/css">
  .scrollbar-item {
    display: flex;
    align-items: center;
    /*justify-content: center;*/
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    padding-left: 20px;
  }

  .scrollbar-item.active {
    background-color: #388bdf;
    color: white;
  }

  .scrollbar-item > .title {
    cursor: pointer;
  }

  .scrollbar-item.active .el-button {
    color: black;
  }

  .el-divider__text {
    font-weight: bold;
  }

  .el-progress--circle {
    margin-right: 15px;
  }
</style>
