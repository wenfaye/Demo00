<template>
  <layout ref="layout" list-title="机房光缆管理" :stat-visible="false" >
    <template #header>
      <el-button type="primary" icon="plus" @click="$router.push('/optical_cables/add')">添加</el-button>
      <el-button type="danger" icon="delete" @click="handleDeleteCables()">删除</el-button>
      <el-button type="warning" icon="upload" @click="handleImportCables()">导入</el-button>
      <el-button type="info" icon="download" @click="handleExportCables()">导出</el-button>
      <el-button icon="tickets" @click="handleStat()">统计</el-button>
      <el-dropdown style="margin-left: 10px;">
        <el-button type="primary" icon="bell">
          预警<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleAlarmSet()">设置</el-dropdown-item>
            <el-dropdown-item @click="handleViewOverlimit()">超限一览</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown :hide-on-click="false" style="margin-left: 10px;">
        <el-button type="primary">
          显示列<el-icon class="el-icon--right"><circle-check /></el-icon>
        </el-button>
        <template #dropdown>
          <el-checkbox-group
            v-model="checkedColumns"
            @change="handleCheckedColumnsChange"
            style="padding-top: 10px;"
          >
            <el-checkbox v-for="column in allColumns" :key="column.prop" :label="column.prop" style="display: block;margin: 5px 20px 0 20px;">{{ column.label }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-dropdown>
      <div style="display: inline-block;margin-left: 10px;">
        <el-select class="search-field" placeholder="选择" style="width: 115px" v-model="quickSearchField">
          <el-option label="光缆编号" value="name" />
          <el-option label="起点机房" value="from_room" />
          <el-option label="终点机房" value="to_room" />
          <el-option label="类型" value="type" />
          <el-option label="航站楼" value="terminal" />
          <el-option label="备注" value="description" />
        </el-select>
        <el-select @change="loadData()" v-model="searchValue" clearable filterable class="search-input" v-if="searchEnumerations" style="display:inline-block;width:200px;margin-left: -1px;">
          <el-option v-model="searchValue" v-for="e in searchEnumerations" :key="e.value" :value="e.value" :label="e.label"></el-option>
          <template #append>
            <el-button icon="search" @click="loadData()" />
          </template>
        </el-select>
        <el-input
          style="display:inline-block;width:200px;margin-left: -9px;border-radius: 0;"
          v-model="searchValue"
          v-if="!searchEnumerations"
          placeholder="请输入"
          class="search-input"
          @change="loadData()"
        >
        </el-input>
      </div>
    </template>
    <template #list>
      <el-table
        ref="gridRef"
        @selection-change="selectionChange"
        :data="gridData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        style="width: 100%"
        height="calc(100% - 25px)">
      >
        <el-table-column key="id" type="selection"></el-table-column>
        <el-table-column v-bind:key="column.prop" v-for="column in columns" :sortable="!!column.sortable" :label="column.label" :prop="column.prop">
          <template #default="scope">
            <span title="光芯使用率超出预警设置" v-if="scope.row.coreWarning" @click="showOverlimitInfo(scope.row)"><bell-filled style="font-size: 14px; width: 14px; height: 14px; color: orange;" v-if="column.prop === 'name'" /></span>
            {{scope.row[column.prop]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation">
          <template #default="scope">
            <el-button size="small" icon="edit" @click="$router.push({path: `/optical_cables/${scope.row.id}`})"></el-button>
            <el-button size="small" icon="delete" @click="handleDeleteCable(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float: right; margin-right: 20px;"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[100, 200, 300, 500, 1000, 2000]"
        :total="gridData.length">
      </el-pagination>
      <upload-file dialog-title="导入光缆数据" :upload-url="uploadUrl()" ref="uploadCables" @upload-success="handleUploadSuccess"></upload-file>
      <el-dialog
        width="60%"
        v-model="statDialogVisible"
        title="光缆资源统计">
        <el-form label-width="150px">
          <el-row>
            <el-col :span="24">
              <table class="table table-bordered" style="width: 100%;margin-bottom: 15px;">
                <tbody>
                <tr>
                  <td colspan="6" style="font-size: 16px;">芯数统计</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">光缆总数</td><td>{{gridData.length}}</td><td style="font-weight: bold;">光缆芯总数</td><td>{{coreStat.coreTotal}}</td><td style="font-weight: bold;">已使用芯总数</td><td>{{coreStat.coreUsed}}</td>
                </tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <table class="table table-bordered" style="width: 100%;margin-bottom: 15px;">
                <tbody>
                  <tr>
                    <td colspan="2" style="font-size: 16px;">按类型统计</td>
                  </tr>
                  <tr v-for="(value, key) in statByType" v-bind:key="key">
                    <td style="width: 40%; font-weight: bold;">{{key}}</td><td>{{value}}(条)</td>
                  </tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <table class="table table-bordered" style="width: 100%;margin-bottom: 15px;">
                <tbody>
                <tr>
                  <td colspan="2" style="font-size: 16px;">按起点机房统计</td>
                </tr>
                <tr v-for="(value, key) in statByRoom" v-bind:key="key">
                  <td style="width: 40%; font-weight: bold;">{{key}}</td><td>{{value}}(条)</td>
                </tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
        </el-form>
        <div class="hr-line-dashed"></div>
        <template #footer>
          <span class="dialog-footer">
            <el-button key="btnCancel" type="primary" @click="statDialogVisible = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog
        width="80%"
        v-model="alarmSetDialogVisible"
        title="光缆资源剩余预警设置">
        <el-form label-width="150px" ref="alarmSetForm" :model="alarmFormData">
          <el-row>
            <el-tabs
              v-model="activeAlarmSet"
              type="card"
              editable
              style="width: 98%"
              @edit="handleTabsEdit"
            >
              <el-tab-pane
                v-for="(item, index) in alarmFormData.alarmSets"
                :key="index"
                :label="item.name"
                :name="item.name"
              >
                <el-row :gutter="24" style="margin-bottom: 5px;">
                  <el-col :span="12">
                    <el-text class="mx-1" size="large" style="padding-left: 30px;">光缆筛选</el-text>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="光缆编号">
                      <el-input v-model="item.keyword" placeholder="输入光缆编号的部分进行模糊匹配">
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="起点机房"
                                  :prop="`alarmSets[${index}].fromRoom`">
                      <el-select v-model="item.fromRoom" style="width:100%;" filterable clearable @change="handleFromRoomChange">
                        <el-option :key="room.id" :value="room.id" :label="room.name" v-for="room in allRooms"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="起点机柜"
                                  prop="fromCabinet">
                      <el-select v-model="item.fromCabinet" style="width:100%;" filterable clearable>
                        <el-option v-for="cabinet in fromCabinets" :key="cabinet.id" :value="cabinet.id" :label="cabinet.name"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="终点机房"
                                  prop="toRoom">
                      <el-select v-model="item.toRoom" style="width:100%;" filterable clearable @change="handleToRoomChange">
                        <el-option :key="room.id" :value="room.id" :label="room.name" v-for="room in allRooms"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="终点机柜"
                                  prop="toCabinet">
                      <el-select v-model="item.toCabinet" style="width:100%;" filterable clearable>
                        <el-option v-for="cabinet in toCabinets" :key="cabinet.id" :value="cabinet.id" :label="cabinet.name"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="光缆类型"
                                  prop="type">
                      <el-select v-model="item.cableType" style="width:100%;" filterable clearable>
                        <el-option v-for="cls in cableClass" :key="cls.value" :value="cls.value" :label="cls.label"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">

                  </el-col>
                </el-row>
                <el-row :gutter="24" style="margin-bottom: 5px;">
                  <el-col :span="12">
                    <el-text class="mx-1" size="large" style="padding-left: 30px;">预警触发</el-text>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="24" style="padding-left: 90px;">
                    针对满足以上筛选条件的光缆，统计芯使用情况，
                    当芯使用率超出&nbsp;<el-input v-model="item.usedPerThreshold" style="width: 60px;"></el-input>
                    <span style="padding-left: 5px;">%时触发预警</span><!--，同时触发通知 <el-select style="width: 200px;"></el-select>-->
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="24" style="padding-left: 90px;">
                    <el-checkbox v-model="item.ignoreUsedUp">不检测芯已用完的光缆</el-checkbox>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </el-row>
        </el-form>
        <el-dialog
          width:="40%"
          v-model="addSetDialogVisible"
          title="添加规则"
        >
          <el-row :gutter="24" style="margin-bottom: 5px;">
            <el-col :span="24">
              <el-form label-width="150px" ref="newRuleForm" :model="newRule">
                <el-form-item label="规则名称"
                              :prop="name"
                              :rules="[ { required: true, message: '名称不能为空' }, ]">
                  <el-input v-model="newRule.name" ></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <template #footer>
            <span class="dialog-footer">
              <el-button key="btnOk" type="primary" @click="handleAddAlarmSet()">确定</el-button>
              <el-button key="btnCancel" @click="addSetDialogVisible = false">取消</el-button>
            </span>
          </template>
        </el-dialog>
        <div class="hr-line-dashed"></div>
        <template #footer>
          <span class="dialog-footer">
            <el-button key="btnOk" type="primary" @click="handleSaveAlarmSet()">确定</el-button>
            <el-button key="btnCancel" @click="alarmSetDialogVisible = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog
        width="80%"
        v-model="overlimitDialogVisible"
        title="预警光缆一览">
        <el-table
          :data="overlimitCables"
          border
          style="width: 100%"
          height="500px">
          >
          <el-table-column label="光缆编号" prop="name"></el-table-column>
          <el-table-column label="起点机房" prop="fromRoomName"></el-table-column>
          <el-table-column label="起点ODF" prop="fromAccessoryName"></el-table-column>
          <el-table-column label="起点光缆类型" prop="fromCableSummary"></el-table-column>
          <el-table-column label="芯使用情况" prop="coreOccupation"></el-table-column>
          <el-table-column label="芯剩余情况" prop="coreSurplus"></el-table-column>
          <el-table-column label="终点机房" prop="toRoomName"></el-table-column>
          <el-table-column label="终点ODF" prop="toAccessoryName"></el-table-column>
          <el-table-column label="终点光缆类型" prop="toCableSummary"></el-table-column>
          <el-table-column label="类型" prop="type"></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog
        width="40%"
        v-model="overlimitInfoVisible"
        title="预警信息">
        <span v-if="overlimitCable" style="padding-left: 40px;">
          <div>芯使用情况：{{overlimitCable.coreOccupation}}</div>
          <div>芯剩余情况：{{overlimitCable.coreSurplus}}</div>
          <div>使用率：<el-progress :percentage="Math.round(overlimitCable.coreUsed / overlimitCable.fromCoreCount * 10000) / 100" style="width: 50%;" /></div>
        </span>
      </el-dialog>
    </template>
  </layout>
</template>

<script lang="ts" setup>
import Layout from '@/components/Layout/List.vue';
import UploadFile from '@/components/UploadFile/index.vue';
import { readOpticalCables, removeOpticalCable, removeOpticalCableByIds, readRooms, readCabinets } from '@/api/computerRooms';
import { onMounted, ref, reactive, getCurrentInstance, watch, computed } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { readByUuid } from '@/api/dict';
import { saveSetting, getSetting } from '@/api/settings';
import XLSX from 'xlsx';

const setKey = 'optical_cables.alarm_set';
const columnSetKey = 'optical_cables.visible_columns';
let multipleSelection = [];
const quickSearchField = ref('name');
const searchValue = ref('');
const searchEnumerations = ref(null);
const gridData = ref([]);
const uploadCables = ref();
const currentPage = ref(1);
const pageSize = ref(100);
const allRooms = ref([]);
const fromCabinets = ref([]);
const toCabinets = ref([]);
const statDialogVisible = ref(false);
const coreStat = reactive({ coreTotal: 0, coreUsed: 0 });
const statByType = ref({});
const statByRoom = ref({});
const alarmSetDialogVisible = ref(false);
const alarmFormData = reactive({ alarmSets: [{ name: '默认', fromRoom: null, fromCabinet: null, toRoom: null, toCabinet: null, cableType: null, limit: 'any', usedPerThreshold: 80, ignoreUsedUp: false, keyword: '', terminal: '' }] });
const activeAlarmSet = ref('默认');
const alarmSetForm = ref(null);
const addSetDialogVisible = ref(false);
const cableClass = ref([]);
const newRule = reactive({ name: '' });
const newRuleForm = ref(null);
const overlimitCables = ref([]);
const overlimitDialogVisible = ref(false);
const overlimitInfoVisible = ref(false);
const overlimitCable = ref(null);

const checkedColumns = ref(['name', 'fromRoomName', 'fromAccessoryName', 'fromCableSummary', 'coreOccupation', 'coreSurplus', 'toRoomName', 'toAccessoryName', 'toCableSummary', 'type']);

const allColumns = [
  { label: '光缆编号', prop: 'name', sortable: true },
  { label: '起点机房', prop: 'fromRoomName' },
  { label: '光缆机柜', prop: 'fromCabinetName' },
  { label: '机柜U位', prop: 'fromLocation' },
  { label: '起点ODF', prop: 'fromAccessoryName' },
  { label: '起点光缆类型', prop: 'fromCableSummary' },
  { label: '芯使用情况', prop: 'coreOccupation' },
  { label: '芯剩余情况', prop: 'coreSurplus' },
  { label: '光缆预留情况', prop: 'coreReserve' },
  { label: '终点机房', prop: 'toRoomName' },
  { label: '终点机柜', prop: 'toCabinetName' },
  { label: '终点U位', prop: 'toLocation' },
  { label: '终点ODF', prop: 'toAccessoryName' },
  { label: '终点光缆类型', prop: 'toCableSummary' },
  { label: '类型', prop: 'type', sortable: true },
  { label: '航站楼信息', prop: 'terminal', sortable: true },
  { label: '备注', prop: 'description', sortable: true },
];

const columns = computed({
  get: () => {
    const clns = [];
    for (const c of allColumns) {
      if (checkedColumns.value.indexOf(c.prop) >= 0) {
        clns.push(c);
      }
    }
    return clns;
  },
});

onMounted(() => {
  getSetting(setKey).then((response) => {
    if (response.data) {
      alarmFormData.alarmSets = JSON.parse(response.data);
    }
  });

  getSetting(columnSetKey).then((response) => {
    if (response.data) {
      checkedColumns.value = JSON.parse(response.data);
    }

    loadData();
    loadRooms();
  });

  loadClassification();
});

watch(quickSearchField, (newValue: any, oldvValue: any) => {
  searchValue.value = '';

  if (newValue === 'name' || newValue === 'description') {
    searchEnumerations.value = null;
  } else {
    if (newValue == 'type') {
      searchEnumerations.value = cableClass.value;
    } else if (newValue == 'terminal') {
      searchEnumerations.value = [{ label: 'T1', value: 'T1' }, { label: 'T2', value: 'T2' }];
    } else {
      var enums = [];
      for (const room of allRooms.value) {
        enums.push({ value: room.id, label: room.name });
      }
      searchEnumerations.value = enums;
    }
  }
});

const loadData = () => {
  const searchQuery = {};
  if (quickSearchField.value && searchValue.value) {
    searchQuery[quickSearchField.value] = searchValue.value;
  }

  readOpticalCables(searchQuery).then((response) => {
    for (const record of response) {
      record.coreWarning = false;
      if (record.attrMap) {
        record.terminal = record.attrMap.terminal || '';
      }
    }

    gridData.value = response || [];

    resetCoreWarning();
  }, (response) => {
  });
};

const loadRooms = () => {
  readRooms('').then((response) => {
    allRooms.value = response;
  }, (response) => {
  });
};

const loadClassification = () => {
  readByUuid('cable_class').then((response) => {
    cableClass.value = response;
  });
};

const handleAddAlarmSet = () => {
  newRuleForm.value.validate((valid) => {
    let existed = false;
    for (const s of alarmFormData.alarmSets) {
      if (s.name === newRule.name) {
        existed = true;
        break;
      }
    }

    if (!existed) {
      alarmFormData.alarmSets.push({ name: newRule.name, fromRoom: null, fromCabinet: null, toRoom: null, toCabinet: null, cableType: null, limit: 'any', usedPerThreshold: 80, ignoreUsedUp: false, keyword: '' });
      addSetDialogVisible.value = false;
      activeAlarmSet.value = newRule.name;
    } else {
      ElMessage({
        message: '同名的设置已存在！',
        type: 'warning',
      });
    }
  });
};

const handleAlarmSet = () => {
  alarmSetDialogVisible.value = true;

  loadAllCabinets();
};

const handleViewOverlimit = () => {
  var cables = [];
  for (const cable of gridData.value) {
    if (cable.coreWarning) {
      cables.push(cable);
    }
  }

  overlimitCables.value = cables;
  overlimitDialogVisible.value = true;
};

const handleSaveAlarmSet = () => {
  alarmSetForm.value.validate((valid) => {
    if (valid) {
      saveSetting(setKey, JSON.stringify(alarmFormData.alarmSets)).then((response) => {
        alarmSetDialogVisible.value = false;
        resetCoreWarning();
      });
    } else {
      console.log('error submit!');
    }
  });
};

const handleTabsEdit = (targetName, action) => {
  if (action == 'add') {
    newRule.name = '';
    addSetDialogVisible.value = true;
  } else if (action == 'remove') {
    ElMessageBox.confirm(
      `确认要删除设置'${targetName}'吗？`,
      'Warning',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
      for (const s of alarmFormData.alarmSets) {
        if (s.name === targetName) {
          alarmFormData.alarmSets.splice(alarmFormData.alarmSets.indexOf(s), 1);
          break;
        }
      }
    });
  }
};

const handleEditCable = (cable) => {
  console.log(cable);
};

const handleDeleteCable = (cable) => {
  ElMessageBox.confirm(
    '确认要删除光缆吗?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    },
  ).then(() => {
    removeOpticalCable(cable.id).then(() => {
      loadData();
    });
  }).catch(() => {
    console.log('Cancel');
  });
};

const handleDeleteCables = () => {
  const ids = [];
  for (const row of multipleSelection) {
    ids.push(row.id);
  }

  if (ids.length <= 0) {
    ElMessageBox.alert('未选择任何光缆！');
    return;
  }

  ElMessageBox.confirm(
    '确认要删除选择的光缆吗?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    },
  ).then(() => {
    removeOpticalCableByIds(ids).then(() => {
      loadData();
    });
  }).catch(() => {
    console.log('Cancel');
  });
};

const handleImportCables = () => {
  uploadCables.value.show();
};

const handleExportCables = () => {
  const cr = [];

  const outputColumns = [];
  for (const ac of allColumns) {
    for (const c of checkedColumns.value) {
      if (c === ac.prop) {
        cr.push(ac.label);
        outputColumns.push(ac.prop);
      }
    }
  }

  const aoa = [
    cr,
  ];

  for (const cable of gridData.value) {
    const values = [];
    for (const c of outputColumns) {
      values.push(cable[c]);
    }
    aoa.push(values);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '光缆');
  XLSX.writeFile(workbook, '光缆.xlsx');
};

const handleStat = () => {
  let coreUsed = 0;
  let coreTotal = 0;
  const typeCount = {};
  const roomCount = {};
  for (const cable of gridData.value) {
    const t = cable.type;
    typeCount[t] = typeCount[t] ? typeCount[t] + 1 : 1;

    const roomName = cable.fromRoomName;
    roomCount[roomName] = roomCount[roomName] ? roomCount[roomName] + 1 : 1;
    if (cable.coreUsed) {
      coreUsed = coreUsed + cable.coreUsed;
      coreTotal = coreTotal + cable.fromCoreCount;
    }
  }
  coreStat.coreUsed = coreUsed;
  coreStat.coreTotal = coreTotal;
  statByType.value = typeCount;
  statByRoom.value = roomCount;

  statDialogVisible.value = true;
};

const handleUploadSuccess = () => {
  uploadCables.value.hide();
  loadData();
};

const handleFromRoomChange = (v) => {
  loadCabinets(v, true);
};

const handleToRoomChange = (v) => {
  loadCabinets(v, false);
};

const handleCheckedColumnsChange = () => {
  saveSetting(columnSetKey, JSON.stringify(checkedColumns.value)).then((response) => {
    console.log('saved visible columns `' + JSON.stringify(checkedColumns.value) + '`');
  });
};

const loadAllCabinets = () => {
  for (const s of alarmFormData.alarmSets) {
    if (s.name === activeAlarmSet.value) {
      loadCabinets(s.fromRoom, true);
      loadCabinets(s.toRoom, false);
      break;
    }
  }
};

const loadCabinets = (room, isLocal) => {
  if (room) {
    readCabinets(room).then((response) => {
      if (isLocal) {
        fromCabinets.value = response;
      } else {
        toCabinets.value = response;
      }
    });
  } else {
    if (isLocal) {
      fromCabinets.value = [];
    } else {
      toCabinets.value = [];
    }
  }
};

const resetCoreWarning = () => {
  console.log('resetCoreWarning');
  // alarmFormData.alarmSets;
  for (const record of gridData.value) {
    for (const alarmSet of alarmFormData.alarmSets) {
      const usedPer = record.coreUsed / record.fromCoreCount * 100;
      if (usedPer <= alarmSet.usedPerThreshold || (alarmSet.ignoreUsedUp && usedPer >= 100)) {
        record.coreWarning = false;
        break;
      }

      let coreWarning = true;
      if (alarmSet.fromRoom && alarmSet.fromRoom != record.fromRoomId) {
        coreWarning = false;
      }

      if (alarmSet.fromCabinet && alarmSet.fromCabinet != record.fromCabinetId) {
        coreWarning = false;
      }

      if (alarmSet.toRoom && alarmSet.toRoom != record.toRoomId) {
        coreWarning = false;
      }

      if (alarmSet.toCabinet && alarmSet.toCabinet != record.toCabinetId) {
        coreWarning = false;
      }

      if (alarmSet.cableType && alarmSet.cableType != record.type) {
        coreWarning = false;
      }

      if (!!alarmSet.keyword && record.name.indexOf(alarmSet.keyword) < 0) {
        coreWarning = false;
      }

      record.coreWarning = coreWarning;
      if (coreWarning) {
        break;
      }
    }
  }
};

const uploadUrl = () => {
  const up = (window as any).urlPrefix;
  const url = up + (up.endsWith('/') ? '' : '/') + 'rest/hongqiao/computer_room_import/optical_cables';
  return url;
};

const selectionChange = (rows) => {
  multipleSelection = rows;
};

const showOverlimitInfo = (row) => {
  overlimitCable.value = row;
  overlimitInfoVisible.value = true;
};
</script>
