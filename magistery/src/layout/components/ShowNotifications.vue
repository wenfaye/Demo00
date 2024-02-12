<template>
  <!--<input type="hidden" name="userName" value="{{.userName}}" />-->
  <!--<input type="hidden" name="alertLevel" value="{{.level}}" />-->
  <!--<input type="hidden" name="moIds" value="{{stringify .moIDs}}" />-->
  <!--<input type="hidden" name="alertLevels" value="{{stringify alertLevels}}"  />-->
  <!--<input type="hidden" name="loadNotificationsUrl" value="{{urlRoot "/ds/v2/alerts/cookies/tree"}}" />-->
  <!--<input type="hidden" name="urlRoot" value="{{urlRoot ""}}" />-->
  <el-dialog
    title="通知消息"
    width="90%"
    top="30px"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="notificationDialogVisible">
    <el-table
      ref="notificationTable"
      :data="gridData"
      style="width: 100%"
      height="500px"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="45">
      </el-table-column>
      <el-table-column
        prop="message"
        label="内容">
      </el-table-column>
      <el-table-column
        prop="triggered_at"
        label="触发时间"
        width="180">
        <template #default="scope">
          {{resolveTime(scope.row.created_at)}}
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
    <div style="float: left;margin-left: 10px; padding-top: 10px; color: blue;">
      共{{gridData.length}}条记录
    </div>
    <div style="text-align: right;">
      <el-button style="margin-top: 10px;margin-right: 10px;" @click="confirmAll">确认全部</el-button>
      <el-button style="margin-top: 10px;margin-right: 10px;" @click="confirmSelectedAlerts">确认选择项</el-button>
      <el-button type="info" style="margin-top: 10px;margin-right: 0;" @click="notificationDialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, defineExpose } from 'vue';
import { readNotification, confirmNotification } from '@/api/stats';
import { UserModule } from '@/store/modules/user';

const gridData = ref([]);
const showState = ref('未确认');
const multipleSelection = ref([]);
const notificationDialogVisible = ref(false);
const level = ref(0);
const showExpand = ref(false);

const confirmAll = () => {
  if (confirm('确认后消息将在当前通知列表中不可见，是否继续确认？')) {
    confirmNotification({ ids: 'all', confirm_user: UserModule.name, content: '' }).then((response) => {
      loadNotifications();
    }, (response) => {
    });
  }
};

const confirmAlertBy = (row) => {
  if (confirm('确认后消息将在当前通知列表中不可见，是否继续确认？')) {
    confirmNotification({ ids: row.id + '', confirm_user: UserModule.name, content: '' }).then((response) => {
      loadNotifications();
    }, (response) => {
    });
  }
};

const confirmSelectedAlerts = () => {
  if (multipleSelection.value.length <= 0) {
    alert('未选择任何通知消息!');
    return;
  }

  const eventIds = [];
  for (let i = 0; i < multipleSelection.value.length; i++) {
    eventIds.push(multipleSelection.value[i].id);
  }

  if (confirm('确认后消息将在当前通知列表中不可见，是否继续确认？')) {
    const p = { ids: eventIds.join(','), confirm_user: UserModule.name, content: '' };
    confirmNotification(p).then((response) => {
      loadNotifications();
    }, (response) => {
    });
  }
};

const handleSelectionChange = (rows) => {
  multipleSelection.value = rows;
};

const resolveTime = (time) => {
  if (time && time.length > 19) {
    return time.substring(0, 19).replace('T', ' ');
  }

  return time;
};

const show = () => {
  notificationDialogVisible.value = true;
  showState.value = '未确认';

  loadNotifications();
};

const loadNotifications = () => {
  readNotification().then((response) => {
    gridData.value = response;
  }, (response) => {});
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
