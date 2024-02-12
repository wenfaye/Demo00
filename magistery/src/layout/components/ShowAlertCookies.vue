<template>
  <!--<input type="hidden" name="userName" value="{{.userName}}" />-->
  <!--<input type="hidden" name="alertLevel" value="{{.level}}" />-->
  <!--<input type="hidden" name="moIds" value="{{stringify .moIDs}}" />-->
  <!--<input type="hidden" name="alertLevels" value="{{stringify alertLevels}}"  />-->
  <!--<input type="hidden" name="loadCookiesUrl" value="{{urlRoot "/ds/v2/alerts/cookies/tree"}}" />-->
  <!--<input type="hidden" name="urlRoot" value="{{urlRoot ""}}" />-->
  <el-dialog
      title="当前告警"
      width="90%"
      top="30px"
      :close-on-click-modal="false"
      :append-to-body="true"
      v-model="alertDialogVisible">
      <div style="margin-bottom: 10px;display: inline-block;">
        <el-radio-group v-model="showState" size="small" @change="loadCookies">
          <el-radio-button label="未确认"></el-radio-button>
          <el-radio-button label="已确认" ></el-radio-button>
        </el-radio-group>
      </div>
      <div style="float: right;margin-right: 10px; padding-top: 10px; color: blue;">
        共{{alertCount}}条记录
      </div>
      <el-table
        ref="alertTable"
        :data="gridData"
        style="width: 100%"
        height="500px"
        border
        :row-style="rowStyle"
        :row-class-name="rowClass"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="45">
        </el-table-column>
        <el-table-column prop="expand" v-if="showExpand" width="55">
          <template #default="scope">
            <el-icon @click="toggleExpand(scope.row)" v-if="scope.row.isSuper && scope.row.hasSubset" style="color: gray;">
              <ArrowRightBold v-if="!scope.row.expanded" />
              <ArrowDownBold v-if="scope.row.expanded" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="65">
          <template #default="scope">
            {{scope.row.status === 1 ? '告警' : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="level"
          label="级别"
          width="65">
          <template #default="scope">
            <a :href="resoleRuleUrl(scope.row.action_id)" target="_blank">
              <img :title="resolveLevel(scope.row)" :src="resolveLevelImg(scope.row.level)" style="width:16px;height:16px;">
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="target"
          label="告警对象">
          <template #default="scope">
            <span v-if="scope.row.mo">
              {{scope.row.mo.name}}
              <a v-if="hasMonitor(scope.row.mo)" :href="resolveMonitorUrl(scope.row.mo)" target="_blank" title="运行视图">&nbsp;<i class="fa fa-desktop"></i></a>
              <span v-if="scope.row.mo.address">
                <a :href="resolveLocateUrl(scope.row.mo, 'room')" target="_blank" title="机房定位">&nbsp;<i class="fa fa-mail-reply"></i></a>
                <a :href="resolveLocateUrl(scope.row.mo, 'topology')" target="_blank" title="拓扑定位">&nbsp;<i class="fa fa-mail-reply-all"></i></a>
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="告警描述">
        </el-table-column>
        <el-table-column
          prop="triggered_at"
          label="触发时间"
          width="180">
          <template #default="scope">
            {{resolveTime(scope.row.triggered_at)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="knowledges"
          label="知识库"
          width="80">
          <template #default="scope">
            <span v-if="scope.row.knowledges">
              <a :href="scope.row.knowledges.view_url" target="_blank" style="text-decoration: underline;cursor: pointer;color:blue;">{{scope.row.knowledges.count}}</a>&nbsp;&nbsp;
              <a class="btn btn-xs btn-white" :href="scope.row.knowledges.create_url" target="_blank" style="color:blue;"><i class="fa fa-plus"></i></a>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showState === '未确认'"
          prop="operation"
          label="操作"
          width="100">
          <template #default="scope">
            <el-button size="small" @click="confirmAlertBy(scope.row)">确认</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="float: left;padding-top: 10px;font-size: 18px; color: #3a87ad;">
        点击级别图标可以查看告警规则设置
      </div>
      <div style="text-align: right;">
        <el-button style="margin-top: 10px;margin-right: 10px;" @click="confirmSelectedAlerts">确认选择项</el-button>
        <el-button type="info" style="margin-top: 10px;margin-right: 0;" @click="alertDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, defineExpose } from 'vue';
import { fetchTree, confirmAlert, batchConfirmAlert } from '@/api/alert';
import { UserModule } from '@/store/modules/user';

const gridData = ref([]);
const alertCount = ref(0);
const showState = ref('未确认');
const multipleSelection = ref([]);
const alertDialogVisible = ref(false);
const level = ref(0);
const showExpand = ref(false);

const confirmAlertBy = (row) => {
  if (confirm('确认后告警将在当前告警列表中不可见，是否继续确认？')) {
    confirmAlert(row.action_id, { user: UserModule.name }).then((response) => {
      loadCookies();
    }, (response) => {
    });
  }
};

const confirmSelectedAlerts = () => {
  if (multipleSelection.value.length <= 0) {
    alert('未选择任何告警事件!');
    return;
  }

  const eventIds = [];
  for (let i = 0; i < multipleSelection.value.length; i++) {
    eventIds.push(multipleSelection.value[i].event_id);
  }

  if (confirm('确认后告警将在当前告警列表中不可见，是否继续确认？')) {
    const p = { event_id_list: eventIds, user: UserModule.name, content: '' };
    batchConfirmAlert(p).then((response) => {
      loadCookies();
    }, (response) => {
    });
  }
};

const handleSelectionChange = (rows) => {
  multipleSelection.value = rows;
};

const hasMonitor = (mo) => {
  if (mo && mo.type && (mo.type.name === 'network_link' || mo.type.name === 'network_device_port' || mo.type.name === 'composite_port')) {
    return false;
  }

  return true;
};

const resolveLocateUrl = (mo, env) => {
  const prefix = (window as any).urlPrefix;
  return prefix + '/web/network_devices/' + mo.id + '/locate?env=' + env;
};

const resolveMonitorUrl = (mo) => {
  const prefix = (window as any).urlPrefix;
  return prefix + '/web/mos/' + mo.id + '/monitor';
};

const resoleRuleUrl = (id) => {
  const prefix = (window as any).urlPrefix;
  return prefix + '/web/alarm_rules/' + id + '/edit';
};

const resolveLevel = (row) => {
  if (row.level_detail) {
    return row.level_detail.label;
  }
};

const resolveLevelImg = (l) => {
  const prefix = (window as any).urlPrefix;
  return prefix + '/web/assets/images/alarm/level_' + l + '.png';
};

const resolveTime = (time) => {
  if (time && time.length > 19) {
    return time.substring(0, 19).replace('T', ' ');
  }

  return time;
};

const show = (l?: string) => {
  alertDialogVisible.value = true;
  level.value = l || 0;
  showState.value = '未确认';

  loadCookies();
};

const loadCookies = () => {
  fetchTree({ level: level.value > 0 ? level.value : undefined, is_confirm: showState.value !== '未确认' }).then((response) => {
    const records = [];
    alertCount.value = response.length;
    for (let i = 0; i < response.length; i++) {
      const record = response[i];
      record.isSuper = true;
      record.expanded = false;
      records.push(record);

      if (record.children && record.children.length > 0) {
        showExpand.value = true;
        record.hasSubset = true;
        for (let j = 0; j < record.children.length; j++) {
          const child = record.children[j];
          child.isSub = true;
          child.visible = false;
          child.superId = record.id;
          records.push(child);
        }
      }
    }

    gridData.value = records;
  }, (response) => {});
};

const rowClass = (p) => {
  const baseClass = p.row.visible ? 'sub-row ' : '';

  return baseClass + ((p.row.isSuper || p.row.visible) ? '' : 'row-collapsed');
};

const rowStyle = (p) => {
  if (p.row.level === 5) {
    return { color: 'red', fontWeight: 'bold' };
  } else if (p.row.level === 4) {
    return { color: 'orange', fontWeight: 'bold' };
  }

  return {};
};

const toggleExpand = (row) => {
  row.expanded = !row.expanded;
  for (let i = 0; i < gridData.value.length; i++) {
    const record = gridData.value[i];
    if (record.superId === row.id) {
      record.visible = row.expanded;
    }
  }
};

defineExpose({ show });
</script>

<style type="text/css">
  #alertDialogWrap .el-dialog__body {
    padding-top: 5px;
  }

  .row-collapsed  {
    display: none;
  }

  .sub-row > td {
    background-color: rgba(250, 210, 235, 0.8);
  }
</style>
