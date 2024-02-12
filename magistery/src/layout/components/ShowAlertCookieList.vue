<template>
  <el-dialog
    id="showCookiesDialog"
    title="当前告警"
    width="90%"
    top="30px"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="alertDialogVisible">
      <template #default>
        <div style="margin-left: 10px; margin-bottom: 20px;display: inline-block;">
          <el-radio-group v-model="showState" @change="loadCookies">
            <el-radio-button label="未确认"></el-radio-button>
            <el-radio-button label="已确认" ></el-radio-button>
          </el-radio-group>
          <el-input style="position: absolute; right: 40px; width: 250px;box-sizing: content-box;" placeholder="输入对象名称关键字进行过滤" v-model="keyword" @change="keywordChange"></el-input>
        </div>
        <div style="max-height: 600px;min-height: 300px;overflow-y: auto;padding-right: 10px;">
          <ul class="sortable-list connectList agile-list ui-sortable" id="inprogress">
            <li :class="rowClass(row)" id="task13" v-bind:key="row.id" v-for="row in gridData">
              <div style="display: flex;">
                <div :style="{'width': '18px', 'margin-right': '5px', 'position': 'relative', 'left': '-1px', padding: '10px 0 10px 10px'}">
                  <el-checkbox v-model="row.checked"></el-checkbox>
                  <!--<i :class="{'el-icon-arrow-right': row.expanded ? false : true, 'el-icon-arrow-down': row.expanded ? true : false}" @click="toggleExpand(row)" v-if="row.isSuper && row.hasSubset" style="color:gray;font-weight:bold;"></i>-->
                </div>
                <div style="width: 100%; padding: 10px;">
                  <div :style="rowStyle(row)" title="告警内容">
                    <i class="fa fa-warning"></i>{{row.content}}
                    <el-link type="info" :href="resoleRuleUrl(row.action_id)" target="_blank" style="text-decoration: underline;">规则设置</el-link>
                  </div>
                  <span v-if="row.mo" title="告警对象">
                        <i class="fa fa-cube"></i>
                        {{row.mo.name}}
                          <a v-if="hasMonitor(row.mo)" :href="resolveMonitorUrl(row.mo)" target="_blank" title="运行视图">&nbsp;<i class="fa fa-desktop"></i></a>
                        <span v-if="row.mo.address">
                          <a :href="resolveLocateUrl(row.mo, 'room')" target="_blank" title="机房定位">&nbsp;<i class="fa fa-mail-reply"></i></a>
                          <a :href="resolveLocateUrl(row.mo, 'topology')" target="_blank" title="拓扑定位">&nbsp;<i class="fa fa-mail-reply-all"></i></a>
                        </span>
                      </span>
                  <div style="display: flex;">
                    <div style="width: 100%;">
                      <div class="agile-detail">
                        <span title="告警时间"><i class="fa fa-clock-o"></i> {{resolveTime(row.triggered_at)}}</span>
                      </div>
                      <div v-if="row.expect_repaired_at">
                        预期修复时间：{{row.expect_repaired_at}}`
                      </div>
                      <div v-if="row.confirm_content">
                        备注：{{row.confirm_content}}
                      </div>
                      <div v-if="row.knowledges && row.knowledges.count">
                        知识库：<a :href="row.knowledges.view_url" target="_blank" style="text-decoration: underline;cursor: pointer;color:blue;">{{row.knowledges.count}}</a>&nbsp;&nbsp;
                        <a class="btn btn-xs btn-white" :href="row.knowledges.create_url" target="_blank" style="color:blue;"><i class="fa fa-plus"></i></a>
                      </div>
                    </div>
                    <div style="width: 320px;" v-if="showState === '未确认'">
                      <el-button type="primary" size="small" @click="prepareConfirm(row)">确认</el-button>
                      <el-button size="small" @click="setMark(row)">设置备注</el-button>

                      <a v-if="row.knowledges && row.knowledges.count === 0" :href="row.knowledges.create_url" class="btn btn-xs btn-default el-button el-button--small" target="_blank">添加知识库</a>
                    </div>
                  </div>
                </div>
                <div :style="{'width': '38px'}" >
                  <div v-if="row.isSuper && row.hasSubset" @click="toggleExpand(row)" style="background-color: rgba(58,194,179,0.84); color: white; font-weight: bold; font-size: 18px; position: relative; padding-top: 90%; text-align: center; border: solid 1px silver; height: 100%;">
                    {{row.children.length}}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div style="text-align: right;">
          <span style="position: relative; top: 5px; color:blue; float:left;">共{{alertCount}}条记录</span>
          <el-button style="margin-top: 10px;margin-right: 10px;" @click="prepareConfirm()">确认选择项</el-button>
          <el-button type="info" style="margin-top: 10px;margin-right: 0;" @click="alertDialogVisible = false">关闭</el-button>
        </div>
        <el-dialog
          width="40%"
          title="告警确认"
          v-model="innerVisible"
          append-to-body>

          <el-form label-width="120px" size="mini">
            <el-row>
              <el-col :span="20">
                <el-form-item label="预计修复时间">
                  <el-date-picker
                    align="right"
                    type="datetime"
                    placeholder="选择日期"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm:ss"
                    v-model="exceptRepairedAt"
                    style="width: 100%;height: 30px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="备注内容">
                  <el-input :rows="4" type="textarea" v-model="confirmContent"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" style="text-align: right;">
            <el-button size="small" style="margin-top: 10px;margin-right: 10px;" @click="confirmAlerts()">确认</el-button>
            <el-button type="info" size="small" style="margin-top: 10px;margin-right: 0;" @click="innerVisible = false">取消</el-button>
          </div>
        </el-dialog>

        <el-dialog
          width="40%"
          title="告警备注"
          top="5vh"
          v-model="markDialogVisible"
          :close-on-click-modal="false"
          append-to-body>
          <el-form ref="fieldsForm" label-width="150px">
            <el-row>
              <el-col :span="20">
                <el-form-item label="备注内容">
                  <el-input :rows="4" type="textarea" v-model="confirmContent"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" style="text-align: right;">
            <el-button type="primary" @click="saveMark()">确定</el-button>
            <el-button @click="markDialogVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, defineExpose } from 'vue';
import { fetchTree, confirmAlert, batchConfirmAlert, saveAlertExtendFields, saveAlertMark } from '@/api/alert';
import { UserModule } from '@/store/modules/user';

const alertCount = ref(0);
const gridData = ref([]);
const showState = ref('未确认');
const keyword = ref('');
const multipleSelection = ref([]);
const alertDialogVisible = ref(false);
const editingRow = ref(null);
const exceptRepairedAt = ref('');
const confirmContent = ref('');
const innerVisible = ref(false);
const markDialogVisible = ref(false);
const level = ref(0);
const showExpand = ref(false);

const prepareConfirm = (row) => {
  if (row) {
    exceptRepairedAt.value = row.expect_repaired_at || '';
    confirmContent.value = row.confirm_content || '';
    editingRow.value = row;
  } else {
    exceptRepairedAt.value = '';
    confirmContent.value = '';
    editingRow.value = null;
  }

  innerVisible.value = true;
};

const confirmAlerts = () => {
  const eventIds = [];
  if (editingRow.value) {
    eventIds.push(editingRow.value.event_id);
  } else {
    for (let i = 0; i < gridData.value.length; i++) {
      const row = gridData.value[i];
      if (row.checked) {
        eventIds.push(row.event_id);
      }
    }

    if (eventIds.length <= 0) {
      alert('未选择任何告警事件!');
      return;
    }
  }

  const p = { event_id_list: eventIds, user: UserModule.name };
  if (confirmContent.value) {
    p.content = confirmContent.value;
  }
  if (exceptRepairedAt.value) {
    p.expect_repaired_at = exceptRepairedAt.value;
  }
  batchConfirmAlert(p).then((response) => {
    loadCookies();
    innerVisible.value = false;
  }, (response) => {
  });
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

const keywordChange = () => {
  loadCookies();
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

const rowStyle = (row) => {
  if (row.level === 5) {
    return { color: 'red', fontWeight: 'bold' };
  } else if (row.level === 4) {
    return { color: 'orange', fontWeight: 'bold' };
  }

  return {};
};

const saveMark = () => {
  if (editingRow.value) {
    const eventId = editingRow.value.event_id;
    saveAlertMark(eventId, {
      confirm_user: UserModule.name,
      confirm_content: confirmContent.value,
    }).then((response) => {
      loadCookies();
      markDialogVisible.value = false;
    }, (response) => {
    });
  }
};

const setMark = (row) => {
  confirmContent.value = row.confirm_content || '';
  editingRow.value = row;
  markDialogVisible.value = true;
};

const show = (l?: string) => {
  alertDialogVisible.value = true;
  level.value = l || 0;
  showState.value = '未确认';

  loadCookies();
};

const loadCookies = () => {
  const p = { level: level.value > 0 ? level.value : undefined, is_confirm: showState.value !== '未确认' };
  if (keyword.value) {
    p['mo.by_keyword'] = keyword.value;
  }
  fetchTree(p).then((response) => {
    const records = [];
    alertCount.value = response.length;
    for (let i = 0; i < response.length; i++) {
      const record = response[i];
      record.checked = false;
      record.isSuper = true;
      record.expanded = false;
      record.expect_repaired_at = '';
      record.confirm_content = record.confirm_content || '';
      if (record.extends) {
        record.expect_repaired_at = record.extends.expect_repaired_at || '';
      }
      records.push(record);

      if (record.children && record.children.length > 0) {
        showExpand.value = true;
        record.hasSubset = true;
        for (let j = 0; j < record.children.length; j++) {
          const child = record.children[j];
          child.checked = false;
          child.isSub = true;
          child.visible = false;
          child.superId = record.id;
          child.expect_repaired_at = '';
          child.confirm_content = child.confirm_content || '';
          if (child.extends) {
            child.expect_repaired_at = child.extends.expect_repaired_at || '';
          }
          records.push(child);
        }
      }
    }

    gridData.value = records;
  }, (response) => {});
};

const rowClass = (row) => {
  const baseClass = ['info-element', 'ui-sortable-handle', 'level' + row.level];

  if (row.visible) {
    baseClass.push('sub-row');
  }
  if (!row.isSuper && !row.visible) {
    baseClass.push('row-collapsed');
  }

  return baseClass;
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
  #showCookiesDialog .el-dialog__body {
    padding-top: 5px;
  }

  .el-dialog__body .sortable-list {
    padding-left: 5px;
  }

  .row-collapsed  {
    display: none;
  }

  .sub-row > td {
    background-color: rgba(250, 210, 235, 0.8);
  }

  .agile-list {
    list-style: none;
    margin: 0;
  }
  .agile-list li {
    background: #FAFAFB;
    border: 1px solid #e7eaec;
    margin: 0 0 10px 0;
    padding: 10px;
    border-radius: 2px;
  }
  .agile-list li:hover {
    cursor: pointer;
    background: #fff;
  }
  .agile-list li.warning-element {
    border-left: 3px solid #f8ac59;
  }
  .agile-list li.danger-element {
    border-left: 3px solid #ed5565;
  }
  .agile-list li.info-element {
    border-left: 3px solid #1c84c6;
  }
  .agile-list li.success-element {
    border-left: 3px solid #1ab394;
  }
  .agile-detail {
    margin-top: 5px;
    font-size: 12px;
  }

  .row-collapsed  {
    display: none;
  }

  .agile-list > .info-element.sub-row {
    border-top-style: dashed;
    border-right-style: dashed;
    border-bottom-style: dashed;
    background-color: aliceblue;
    margin-left: 50px;
  }

  .agile-list li {
    padding: 0;
  }

  .agile-list > li.level1 {
    border-left: 5px solid #86c166;
  }

  .agile-list > li.level2 {
    border-left: 5px solid #00FFFF;
  }

  .agile-list > li.level3 {
    border-left: 5px solid #FFFF00;
  }

  .agile-list > li.level4 {
    border-left: 5px solid #FFA000;
  }

  .agile-list > li.level5 {
    border-left: 5px solid #FF0000;
  }
</style>
