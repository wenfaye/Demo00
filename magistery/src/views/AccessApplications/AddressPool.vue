<template>
  <layout ref="layout" list-title="地址总表" :stat-visible="false" >
    <template #header>
      地址：
      <el-input
        style="display:inline-block; border-radius: 0; margin-right: 40px;"
        class="search-input"
        input-style="width:200px"
      >
      </el-input>
      <el-button key="addSite" type="primary" icon="search" >查询</el-button>
      <el-button key="addSite" icon="upload" > 导入</el-button>
      <el-button key="addSite" icon="download" > 导出</el-button>
    </template>
    <template #list>
      <div style="display: flex; top: 0; left: 0; right: 0; bottom: 0; position: absolute;">
        <div style="width: 280px; margin-right: 10px; border: solid 1px rgba(192, 192, 192, 0.5);">
          <el-scrollbar style="height: calc(100% - 10px);">
            <p style="position: relative;cursor: pointer;" v-for="area in areas" :key="area" :class="{ 'scrollbar-item': true, 'active': area === '省调' }">
              <span class="title" >{{area}}</span>
            </p>
          </el-scrollbar>
        </div>
        <div style="width: calc(100% - 310px);">
          <el-scrollbar style="height: calc(100% - 10px);">
            <table class="table table-bordered" cellspacing="0" cellpadding="0" style="width: 100%;">
              <thead>
                <tr>
                  <th>节点名称</th>
                  <th>loopback地址</th>
                  <th>互联地址</th>
                  <th>对端站点</th>
                  <th>RT网关</th>
                  <th>NRT网关</th>
                </tr>
              </thead>
              <tbody>
                <tr><td rowspan="13" style="vertical-align: middle;"><span style="text-decoration: underline;cursor: pointer;" @click="handleShowAddressList()">省调</span></td><td rowspan="13" style="vertical-align: middle;">34.2.0.1</td><td>192.168..0.2</td><td>网管机</td><td rowspan="13" style="vertical-align: middle;">34.101.0.126</td><td rowspan="13" style="vertical-align: middle;">34.100.0.126</td></tr>
                <tr><td>192.168.0.1</td><td>备调</td></tr>
                <tr><td>192.168.0.13</td><td>众兴变</td></tr>
                <tr><td>192.168.0.29</td><td>修试工区</td></tr>
                <tr><td>192.168.0.37</td><td>禹会变</td></tr>
                <tr><td>192.168.0.61</td><td>洛河变</td></tr>
                <tr><td>192.168.0.77</td><td>采石变</td></tr>
                <tr><td>192.168.0.93</td><td>显通变</td></tr>
                <tr><td>192.168.0.109</td><td>朱村变</td></tr>
                <tr><td>192.168.0.125</td><td>安庆变</td></tr>
                <tr><td>192.168.0.141</td><td>万安变</td></tr>
                <tr><td>192.168.0.157</td><td>建阳变</td></tr>
                <tr><td>192.168.0.173</td><td>牛庄变</td></tr>

                <tr><td rowspan="10" style="vertical-align: middle;"><span style="text-decoration: underline;cursor: pointer;">备调</span></td><td rowspan="10" style="vertical-align: middle;">34.2.0.2</td><td>192.168..0.254</td><td>阜阳网管机</td><td rowspan="10" style="vertical-align: middle;">34.101.0.126</td><td rowspan="10" style="vertical-align: middle;">34.100.0.126</td></tr>
                <tr><td>192.168.0.2</td><td>省调</td></tr>
                <tr><td>192.168.0.9</td><td>肥西变</td></tr>
                <tr><td>192.168.0.25</td><td>繁昌变</td></tr>
                <tr><td>192.168.0.49</td><td>蚌埠变</td></tr>
                <tr><td>192.168.0.57</td><td>汤庄变</td></tr>
                <tr><td>192.168.0.73</td><td>当涂变</td></tr>
                <tr><td>192.168.0.89</td><td>濉溪变</td></tr>
                <tr><td>192.168.0.105</td><td>官山变</td></tr>
                <tr><td>192.168.0.121</td><td>石牌变</td></tr>
              </tbody>
            </table>
          </el-scrollbar>
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
const addressListDialogVisible = ref(false);
const areas = ['省调', '合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城'];

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
</style>
