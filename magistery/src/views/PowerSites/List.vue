<template>
  <layout ref="layout" list-title="节点管理" :stat-visible="false" >
    <template #header>
      <el-button key="addSite" type="primary" icon="plus" @click="$router.push('/power_sites/new')">添加</el-button>
      <!--<el-button key="addSite" type="info" icon="plus" @click="addDialogVisible = true">添加</el-button>-->
      <el-button key="addSite" type="warning" icon="refresh" @click="refreshViews()">刷新视图</el-button>
    </template>
    <template #list>
      <el-table
        border
        :data="gridData"
        @selection-change="selectionChange"
        style="width: 100%">
        <el-table-column key="id" type="selection">
        </el-table-column>
        <el-table-column
          key="name"
          prop="name"
          label="名称"
        >
        </el-table-column>
        <el-table-column
          key="type"
          prop="type"
          label="类型"
        >
        </el-table-column>
        <el-table-column
          key="kilovolt"
          prop="kilovolt"
          label="电压等级"
        >
          <template #default="scope">
            {{scope.row.kilovolt}}kv
          </template>
        </el-table-column>
        <el-table-column
          key="area"
          prop="area"
          label="所在区域"
        >
        </el-table-column>
        <el-table-column
          key="description"
          prop="description"
          label="备注"
        >
        </el-table-column>
        <!--<el-table-column-->
          <!--key="state"-->
          <!--prop="state"-->
          <!--label="状态"-->
        <!--&gt;-->
          <!--未上线&nbsp;&nbsp;<el-button icon="top" size="small" type="success" title="上线" @click="handleBeOnline"></el-button>-->
        <!--</el-table-column>-->
        <el-table-column label="操作" width="270">
          <template #default="scope">
            <!--<el-button size="small" icon="edit">编辑</el-button>-->
            <el-button size="small" icon="delete" @click="delSite(scope.row.id)"></el-button>
            <el-button size="small" icon="edit" @click="$router.push({path: `/power_sites/${scope.row.id}`})"></el-button>
            <el-button size="small" icon="DataAnalysis" @click="openView(scope.row)">运行视图</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        width="50%"
        top="3vh"
        v-model="addDialogVisible"
        title="添加">
        <table class="table table-bordered" style="width: 100%;" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td colspan="2" style="font-weight: bold;">路由器</td>
              <td colspan="2" style="font-weight: bold;">IP地址</td>
            </tr>
            <tr>
              <td>Route ID</td><td>Loopback 0</td>
              <td><el-input value="34.2.104.53"></el-input></td>
              <td><el-input value="255.255.255.255"></el-input></td>
            </tr>
            <tr>
              <td>I区接入网关</td><td>g0/0</td>
              <td><el-input value="34.140.37.126"></el-input></td>
              <td><el-input value="255.255.255.128"></el-input></td>
            </tr>
            <tr>
              <td>II区接入网关</td><td>g0/1</td>
              <td><el-input value="34.141.37.126"></el-input></td>
              <td><el-input value="255.255.255.128"></el-input></td>
            </tr>
            <tr>
              <td valign="middle" style="vertical-align: middle;" rowspan="2" >互联网端口1</td>
              <td valign="middle"><el-input value="本端：大山风电场"></el-input></td>
              <td><el-input value="34.3.141.118"></el-input></td>
              <td><el-input value="255.255.255.252"></el-input></td>
            </tr>
            <tr>
              <td><el-input value="对端：建阳变"></el-input></td>
              <td><el-input value="34.3.141.117"></el-input></td>
              <td><el-input value="255.255.255.252"></el-input></td>
            </tr>
            <tr>
              <td valign="middle" style="vertical-align: middle;" rowspan="2" >互联网端口2</td>
              <td valign="middle"><el-input value="本端：大山风电场"></el-input></td>
              <td><el-input value="34.3.141.122"></el-input></td>
              <td><el-input value="255.255.255.252"></el-input></td>
            </tr>
            <tr>
              <td><el-input value="对端：宝桥变"></el-input></td>
              <td><el-input value="34.3.141.121"></el-input></td>
              <td><el-input value="255.255.255.252"></el-input></td>
            </tr>
            <tr>
              <td colspan="2" style="font-weight: bold;">接入交换机</td><td colspan="2" style="font-weight: bold;">管理IP</td>
            </tr>
            <tr>
              <td colspan="2">I区接入交换机</td><td><el-input value="34.140.37.125"></el-input></td><td><el-input value="255.255.255.128"></el-input></td>
            </tr>
            <tr>
              <td colspan="2">II区接入交换机</td><td><el-input value="34.141.37.125"></el-input></td><td><el-input value="255.255.255.128"></el-input></td>
            </tr>
            <tr>
              <td colspan="2" style="font-weight: bold;">业务类别</td><td style="font-weight: bold;">业务主机IP</td><td style="font-weight: bold;">交换机端口</td>
            </tr>
            <tr><td>I区</td><td>综自系统1</td><td><el-input value="34.140.37.1"></el-input></td><td><el-input value="E 0/1"></el-input></td></tr>
            <tr><td>I区</td><td>五防系统</td><td><el-input value="34.140.37.2"></el-input></td><td><el-input value="E 0/2"></el-input></td></tr>
            <tr><td colspan="4"></td></tr>
            <tr><td>II区</td><td>电量采集</td><td><el-input value="34.140.37.1"></el-input></td><td><el-input value="E 0/1"></el-input></td></tr>
            <tr><td>II区</td><td>风功率</td><td><el-input value="34.140.37.2"></el-input></td><td><el-input value="E 0/2"></el-input></td></tr>
          </tbody>
        </table>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="addDialogVisible = false">
              确定
            </el-button>
            <el-button @click="addDialogVisible = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog
        width="50%"
        top="3vh"
        v-model="processDialogVisible"
        title="上线进度">
        <el-row>
          <el-col>
            <el-input type="textarea" :rows="10" disabled :value="progressText"></el-input>
          </el-col>
        </el-row>
      </el-dialog>
    </template>
  </layout>
</template>

<script  lang="ts" setup>
import Layout from '@/components/Layout/List.vue';
import { fetchSites, deleteSite, checkView, refreshView } from '@/api/powerSites';
import { onMounted, ref, reactive } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';

const gridData = ref([]);
let multipleSelection = [];
const addDialogVisible = ref(false);
const processDialogVisible = ref(false);
const progressText = '正在刷新路由。。。\r\n正在刷新I区交换机。。。\r\n正在刷新II区交换机。。。';

onMounted(() => {
  loadSites();
});

const delSite = (id) => {
  ElMessageBox.confirm(
    '确认要删除吗?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    },
  ).then(() => {
    deleteSite(id).then(() => {
      loadSites();
    }, (response) => {
    });
  });
};

const loadSites = () => {
  fetchSites().then((response) => {
    gridData.value = response;
  }, (response) => {
  });
};

const openView = (site) => {
  const prefix = window.urlPrefix.endsWith('/') ? window.urlPrefix : (window.urlPrefix + '/');
  if (site.topology_view_id) {
    window.open(prefix + 'web/biz_topologies/' + site.topology_view_id + '?simplified=true');
  } else {
    checkView(site.id).then((viewId) => {
      window.open(prefix + 'web/biz_topologies/' + viewId + '?simplified=true');
    }, (response) => {
    });
  }
};

const refreshViews = () => {
  if (multipleSelection.length <= 0) {
    ElMessage({
      message: '未选择任何厂站！',
      type: 'warning',
    });
  } else {
    const siteIds = [];
    for (const record of multipleSelection) {
      siteIds.push(record.id);
    }

    ElMessageBox.confirm(
      '确认要刷新所选厂站的视图',
      'Warning',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
      const prefix = window.urlPrefix.endsWith('/') ? window.urlPrefix : (window.urlPrefix + '/');
      refreshView(siteIds.join(',')).then(() => {
        ElMessage('操作成功！');
        loadSites();
      }, (response) => {
      });
    });
  }
};

const selectionChange = (rows) => {
  multipleSelection = rows;
};

const handleBeOnline = () => {
  processDialogVisible.value = true;
};
</script>
