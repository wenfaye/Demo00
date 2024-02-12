<template>
  <layout ref="layout" list-title="机房管理" >
    <template #header>
      <el-button @click="handleAddRoom()" :icon="Plus">添加机房</el-button>
      <el-button @click="handleAddCabinet()" type="primary" :icon="Plus">添加机柜</el-button>
      <el-button @click="handleImport()" type="warning" :icon="Upload">导入机房数据</el-button>
      <el-checkbox v-model="browseMode" label="浏览模式" border style="margin-left: 10px; position: relative; top: 3px;" />
      <el-checkbox v-model="showPDU" v-if="browseMode" label="显示PDU信息" border style="margin-left: -20px; position: relative; top: 3px;" />
      <el-checkbox v-model="showExtendFields" v-if="browseMode" label="显示自定义属性" border style="margin-left: -20px; position: relative; top: 3px;" />
    </template>
    <template #list>
      <div style="display: flex; top: 0; left: 0; right: 0; bottom: 0; position: absolute;">
        <div style="width: 280px; margin-right: 10px; border: solid 1px rgba(192, 192, 192, 0.5);">
          <el-input
            style="display:inline-block;margin: 10px; border-radius: 0;"
            v-model="searchValue"
            placeholder="请输入机房名称关键字"
            class="search-input"
            @change="loadRooms()"
            input-style="width:235px"
          >
          </el-input>
          <el-scrollbar style="height: calc(100% - 50px);">
            <p @click="handleTabChange(room)"  style="position: relative;cursor: pointer;" v-for="room in allRooms" :key="room.id" :class="{ 'scrollbar-item': true, 'active': activeTab === room.id }">
              <span class="title" >{{room.name}}</span>
              <span style="float: right; margin-right: 1px; position: absolute; right: 15px;">
                <el-button :icon="Edit" size="small" link @click="handleEditRoom(room)"></el-button>
                &nbsp;
                <el-button :icon="Delete" size="small" link style="margin-left: 0;" @click="handleRemoveRoom(room.id)"></el-button>
              </span>
            </p>
          </el-scrollbar>
        </div>
        <div style="width: calc(100% - 310px);">
          <div v-if="!browseMode" style="height: 100%; display:flex; width: 100%;position: relative;">
            <div class="table-wrap" :style="{'position': 'absolute', left: 0, top: 0, bottom: '20px', 'right': viewCabinet ? '50%' : 0}">
              <el-table
                ref="gridRef"
                border
                :data="roomCabinets"
                @row-dblclick="handleShowCabinet"
                height="calc(100% - 20px)"
                :row-class-name="rowClass"
              >
                <el-table-column label="名称" prop="name" ></el-table-column>
                <el-table-column label="备注" prop="description" ></el-table-column>
                <el-table-column label="操作" prop="operation" width="250">
                  <template #default="scope">
                    <el-button size="small" icon="Right" @click="handleShowCabinet(scope.row)">柜内详情</el-button>
                    <el-button size="small" :icon="Edit" @click="handleEditCabinet(scope.row)"></el-button>
                    <el-button size="small" :icon="Delete" @click="handleDeleteCabinet(scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                style="float: right; margin-right: 20px;"
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                background
                layout="total"
                :page-sizes="[100, 200, 300, 500, 1000, 2000]"
                :total="roomCabinets.length">
              </el-pagination>
            </div>
            <div style="position: absolute; left: 52%; right: 0; top: 0; bottom: 10px; padding-left: 10px; overflow-y: auto; overflow-x: hidden;" class="cabinet-wrap" v-if="viewCabinet">
              <table class="table table-bordered cabinet-table" style="width: 100%;">
                <thead>
                  <tr>
                    <th style="width:85px;">柜内位置</th>
                    <th>设备名称</th>
                    <!--<th>所属单位/系统</th>-->
                    <!--<th>应急联系人</th>-->
                    <!--<th>应急联系方式</th>-->
                  </tr>
                </thead>
                <tbody>
                  <tr v-bind:key="f.location" v-for="f in nowCabinet.facilities">
                    <td>{{f.prev_location || f.location}}U</td>
                    <td :rowspan="f.rackUnit" v-if="f.rackUnit > 0" style="vertical-align: middle;"><a @click="setDevice(nowCabinet, f)" style="color: blue;">{{f.name ? f.name : '(无)'}}</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="cabinet-wrap" v-if="browseMode">
            <div style="display: inline-flex;" v-for="cabinet in roomCabinets" :key="cabinet.id">
              <div class="cabinet" :style="{ width: showExtendFields ? (350 + 150 * validExtendFields.length + 'px') : '350px' }" >
                <table class="table table-bordered cabinet-table" style="width: 100%;" cellpadding="0" cellspacing="0">
                  <thead>
                    <tr>
                      <th :colspan="showExtendFields ? (2 + validExtendFields.length) : 2">
                        {{cabinet.name}}
                      </th>
                    </tr>
                    <tr>
                      <th style="width:50px;">位置</th>
                      <th>设备名称</th>
                      <th v-for="field in validExtendFields" v-bind:key="field.value">{{field.label}}</th>
                      <!--<th>所属单位/系统</th>-->
                      <!--<th>应急联系人</th>-->
                      <!--<th>应急联系方式</th>-->
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-bind:key="f.location" v-for="f in cabinet.facilities">
                      <td>{{f.prev_location || f.location}}U</td>
                      <td :rowspan="f.rackUnit" v-if="f.rackUnit > 0" style="vertical-align: middle; white-space: break-spaces;">
                        <a @click="setDevice(cabinet, f)" style="color: blue;">{{f.name ? f.name : '(无)'}}</a>
                      </td>
                      <td v-for="field in validExtendFields" v-bind:key="field.value">{{f.attributes && f.attributes[field.value]}}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="pdus" v-if="showPDU">
                <span v-if="cabinet.pdus.length <= 0">无关联PDU</span>
                <div v-for="pdu in cabinet.pdus" v-bind:key="pdu.id" style="margin-bottom: 30px; font-size: 20px; font-weight: bold;">
                  <div style="text-align: center;border: solid 1px lightblue;">{{pdu.name}}</div>
                  <div style="text-align: center;border: solid 1px lightblue;" title="剩余插口数/插口总数">{{pdu.attrMap.socketLeft}}/{{pdu.attrMap.socketCount}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--<el-tabs-->
        <!--v-model="activeTab"-->
        <!--type="border-card"-->
        <!--@tab-change="handleTabChange"-->
        <!--style="height: 100%;"-->
      <!--&gt;-->
        <!--<el-tab-pane v-bind:key="room.id" :name="room.id" v-for="room in allRooms">-->
          <!--<template #label>-->
            <!--<span class="custom-tabs-label">-->
              <!--<span>{{room.name}}</span>-->
              <!--<span style="position: relative; top: 2px;left: 10px;color: blue;">-->
                <!--<el-icon title="编辑机房" @click="handleEditRoom(room)"><Edit /></el-icon>-->
                <!--<el-icon title="删除机房" @click="handleRemoveRoom(room.id)" style="margin-left: 5px;"><Close /></el-icon>-->
              <!--</span>-->
            <!--</span>-->
          <!--</template>-->
        <!--</el-tab-pane>-->
      <!--</el-tabs>-->
      <el-dialog
        width="50%"
        v-model="deviceDialogVisible"
        title="设备选择">
        <el-form ref="fieldsForm" label-width="150px" :model="deviceData">
          <el-row>
            <el-col :span="20">
              <el-form-item label="分类" prop="deviceCategory">
                <el-select v-model="deviceData.deviceCategory" style="width: 100%;">
                  <el-option label="非纳管设备" value="non_monitored"></el-option>
                  <el-option label="已纳管设备" value="is_monitored"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="deviceData.deviceCategory !== 'is_monitored'">
            <el-col :span="20">
              <el-form-item label="设备类型" prop="deviceType">
                <el-select v-model="deviceData.deviceType" style="width: 100%;">
                  <el-option label="光纤配线架" value="odf"></el-option>
                  <el-option label="网络设备" value="network_device"></el-option>
                  <el-option label="普通设备" value="general"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="deviceData.deviceCategory === 'is_monitored'">
            <el-col :span="20">
              <el-form-item label="设备选择" prop="selectedDevice">
                <el-select  style="width: 100%;" clearable filterable v-model="deviceData.selectedDevice">
                  <el-option v-bind:key="dev.id" v-for="dev in allDevices" :label="dev.fields.display_name" :value="dev.id">
                    <div style="max-width: 600px;overflow: hidden;text-overflow: ellipsis;" :title="dev.fields.display_name">{{dev.fields.display_name}}</div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="deviceData.deviceType === 'odf'">
            <el-col :span="20">
              <el-form-item label="接口类型" prop="interfaceType">
                <el-select v-model="deviceData.interfaceType" style="width: 100%;">
                  <el-option label="FC" value="fc"></el-option>
                  <el-option label="SC" value="sc"></el-option>
                  <el-option label="ST" value="st"></el-option>
                  <el-option label="LC" value="lc"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="deviceData.deviceCategory === 'non_monitored'" >
            <el-col :span="20">
              <el-form-item
                  label="描述"
                  prop="inputDevice"
                  :rules="[
                { required: true, message: '不能为空！' },
              ]">
                <el-input  style="width: 100%;" v-model="deviceData.inputDevice"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="deviceData.deviceCategory === 'non_monitored' && deviceData.deviceType === 'odf'" >
            <el-col :span="20">
              <el-form-item
                label="芯数"
                prop="coreCount">
                <el-select v-model="deviceData.coreCount" style="width: 100%;">
                  <el-option v-for="c in coreCountOptions" :key="c" :value="c" :label="c + '芯'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="deviceData.deviceCategory === 'non_monitored' && deviceData.deviceType === 'odf'" >
            <el-col :span="20">
              <el-form-item
                label="芯使用"
                prop="coreOccupation">
                <el-input v-model="deviceData.coreOccupation" type="textarea" :rows="5"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="deviceData.deviceCategory === 'non_monitored'" >
            <el-col :span="20">
              <el-form-item label="占用空间">
                <el-select v-model="deviceData.occupyUnits" style="width: 100%;">
                  <el-option v-bind:key="n" v-for="n in 42" :label="n + 'U'" :value="n"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="field in extendFields" v-bind:key="field.value">
            <el-col :span="20">
              <el-form-item :label="field.label" :prop="value">
                <el-input type="text" v-model="deviceData[field.value]"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="20">
              <el-form-item label="备注" prop="description">
                <el-input type="textarea" v-model="deviceData.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="hr-line-dashed"></div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="">
                <el-button key="btnOk" type="primary" @click="saveDevice()">确定</el-button>
                <el-button key="btnCancel" type="default" @click="deviceDialogVisible = false">取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
      <el-dialog
        width="50%"
        v-model="roomPropertyVisible"
        title="机房属性">
        <el-form ref="rForm" :model="roomForm" label-width="150px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="名称"
                  prop="name"
                  :rules="[{ required: true, message: '不能为空！' },
              ]">
                <el-input v-model="roomForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="备注">
                <el-input type="textarea" v-model="roomForm.description" :rows="5"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="hr-line-dashed"></div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="">
                <el-button key="btnOk" type="primary" @click="saveRoom()">确定</el-button>
                <el-button key="btnCancel" type="default" @click="roomPropertyVisible = false">取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
      <el-dialog
        width="50%"
        v-model="cabinetPropertyVisible"
        title="机柜属性">
        <el-form ref="cForm" :model="cabinetForm" label-width="150px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="名称"
                            prop="name"
                            :rules="[{ required: true, message: '不能为空！' },
              ]">
                <el-input v-model="cabinetForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="U数"
                            :rules="[{ required: true, message: '不能为空！' },
              ]">
                <el-input v-model="cabinetForm.units"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="备注">
                <el-input type="textarea" v-model="cabinetForm.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="hr-line-dashed"></div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="">
                <el-button key="btnOk" type="primary" @click="saveCabinet()">确定</el-button>
                <el-button key="btnCancel" type="default" @click="cabinetPropertyVisible = false">取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
      <el-dialog
        width="50%"
        v-model="importDialogVisible"
        title="导入机房数据">
        <el-form label-width="150px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="文件内容格式">
                <el-select v-model="cabinetLayout">
                  <el-option label="机柜水平排布" :value="1"></el-option>
                  <el-option label="机柜垂直排布" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="操作">
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  :action="uploadUrl()"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :on-success="handleUploadSuccess"
                  :auto-upload="false"
                  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                >
                  <template #trigger>
                    <el-button type="primary">选择文件</el-button>
                  </template>
                  <el-button class="ml-3" type="success" @click="submitUpload" style="margin-left: 5px; vertical-align: top;">
                    上传
                  </el-button>
                  <!--<template #tip>-->
                    <!--<div class="el-upload__tip text-red">-->
                      <!--只能上传一个文件，格式为.xlsx或.xls-->
                    <!--</div>-->
                  <!--</template>-->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="hr-line-dashed"></div>
        <template #footer>
          <span class="dialog-footer">
            <el-button key="btnCancel" type="primary" @click="importDialogVisible = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog
        width="50%"
        v-model="odfPanelDialogVisible"
        title="光纤配线架视图">
      </el-dialog>
    </template>
  </layout>
</template>
<script lang="ts" setup>
import Layout from '@/components/Layout/List.vue';
import { readRooms, readCabinets, readCabinetFacilities, readPowerSockets, updateInnerFacility, createRoom, updateRoom, removeRoom, createCabinet, updateCabinet, removeCabinet } from '@/api/computerRooms';
import { readByUuid } from '@/api/dict';
import { fetchList } from '@/api/mo';
import { onMounted, ref, reactive, getCurrentInstance, watch, computed } from 'vue';
import {
  Delete,
  Edit,
  Plus,
  Upload,
} from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, genFileId } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();

const allDevices = ref([]);
const viewCabinet = ref(false);
const activeTab = ref(0);
// const deviceCategory = ref('non_monitored');
// const deviceType = ref('odf');
// const selectedDevice = ref(null);
// const inputDevice = ref(null);
// const coreOccupation = ref('');
// const occupyUnits = ref(1);
// const coreCount = ref(24);
// const description = ref(24);
const deviceData = reactive({ deviceCategory: 'non_monitored', deviceType: 'odf', interfaceType: '', selectedDevice: null, inputDevice: null, occupyUnits: 1, coreOccupation: '', coreCount: 24, description: '' });
const deviceDialogVisible = ref(false);
const allRooms = ref([]);
const roomCabinets = ref([]);
const cabinetFacilities = ref([]);
const nowCabinet = ref(null);
const editingUnit = ref(null);
const coreCountOptions = [2, 4, 6, 12, 18, 24, 36, 48, 64, 96, 144];
const roomForm = reactive({ id: 0, name: '', description: '' });
const roomPropertyVisible = ref(false);
const rForm = ref(null);
const cabinetForm = reactive({ id: 0, name: '', roomId: 0, description: '' });
const cabinetPropertyVisible = ref(false);
const cForm = ref(null);
const importDialogVisible = ref(false);
const upload = ref<UploadInstance>();
const cabinetLayout = ref(1);
const currentPage = ref(1);
const pageSize = ref(1000);
const searchValue = ref('');
const browseMode = ref(true);
const showPDU = ref(false);
const showExtendFields = ref(false);
const odfPanelDialogVisible = ref(false);
const extendFields = ref([]);
const allPowerSockets = ref([]);

const validExtendFields = computed({
  get: () => {
    return showExtendFields.value ? extendFields.value : [];
  },
});

onMounted(() => {
  loadRooms();
  loadSockets();

  fetchList({ by_type: 'basic_network_device' }).then((response) => {
    allDevices.value = response.data || [];
  }, (response) => {
  });

  loadExtendFields();
});

const handleTabChange = (room) => {
  activeTab.value = room.id;
  loadCabinets();
  const l = window.location;
  const url = l.origin + l.pathname + '#/computer_rooms?id=' + activeTab.value;
  window.history.pushState({}, 0, url);
};

const handleRemoveRoom = (id) => {
  ElMessageBox.confirm(
    '确认要删除机房吗?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    },
  ).then(() => {
    removeRoom(id).then((response) => {
      loadRooms();
    });
  }).catch(() => {
    console.log('Cancel');
  });
};

const handleEditRoom = (room) => {
  roomForm.id = room.id;
  roomForm.name = room.name;
  roomForm.description = room.description;
  roomPropertyVisible.value = true;
};

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const handleImport = () => {
  importDialogVisible.value = true;
};

const loadRooms = (roomId) => {
  const id = router.currentRoute.value.query.id;
  if (id) {
    activeTab.value = parseInt(id);
  }

  readRooms(searchValue.value, false).then((response) => {
    allRooms.value = response;
    if (response.length > 0) {
      let isExist = false;
      for (const r of response) {
        if (r.id === activeTab.value) {
          isExist = true;
        }
      }
      if (!isExist) {
        activeTab.value = response[0].id;
      }

      if (roomId) {
        activeTab.value = roomId;
      }
    }
    loadCabinets();
  }, (response) => {
  });
};

const loadCabinets = () => {
  if (activeTab.value) {
    readCabinets(activeTab.value).then((response) => {
      for (const cabinet of response) {
        cabinet.facilities = translateDevices(cabinet.devices, cabinet.units);
        cabinet.pdus = [];
      }

      roomCabinets.value = response;
      viewCabinet.value = false;

      loadSockets(activeTab.value);
    }, (response) => {
    });
  }
};

const loadSockets = (roomId) => {
  readPowerSockets({ room_id: roomId }).then((response) => {
    for (const cabinet of roomCabinets.value) {
      for (const socket of response) {
        if (socket.cabinetId === cabinet.id) {
          cabinet.pdus.push(socket);
        }
      }
    }
  }, (response) => {
    console.log(response);
  });
};

const loadExtendFields = () => {
  readByUuid('cabinet_extend_fields').then((response) => {
    extendFields.value = response || [];

    for (const field of extendFields.value) {
      deviceData[field.value] = '';
    }
  });
};

const saveDevice = () => {
  const cabinetId = nowCabinet.value.id;
  const location = editingUnit.value.location;
  const t = deviceData.deviceCategory === 'non_monitored' ? 'accessory' : 'device';
  const d = { cabinetId: cabinetId, roomId: activeTab.value, description: deviceData.description };

  if (deviceData.deviceCategory === 'non_monitored') {
    editingUnit.value.name = deviceData.inputDevice || '';
    d.rackUnit = deviceData.occupyUnits;
    d.name = editingUnit.value.name;
    d.type = deviceData.deviceType;

    if (deviceData.deviceType === 'odf') {
      const attributes = { interfaceType: deviceData.interfaceType, coreCount: deviceData.coreCount, coreOccupation: (deviceData.coreOccupation || '').replaceAll('\r', '').replaceAll('\n', ',') };
      d.attributes = attributes;
    }

    for (const field of extendFields.value) {
      if (!d.attributes) {
        d.attributes = {};
      }
      d.attributes[field.value] = deviceData[field.value];
    }
  } else {
    for (const dev of allDevices.value) {
      if (dev.id === deviceData.selectedDevice) {
        d.deviceId = dev.id;
      }
    }
  }

  updateInnerFacility(cabinetId, location, t, d).then((response) => {
    if (deviceData.deviceCategory === 'non_monitored') {
      editingUnit.value.name = deviceData.inputDevice || '';
    } else {
      for (const dev of allDevices.value) {
        if (dev.id === deviceData.selectedDevice) {
          editingUnit.value.name = dev.fields.display_name || '';
        }
      }
    }

    // editingUnit.value.rackUnit = response.rackUnit;
    editingUnit.value.accessoryId = response.accessoryId;
    editingUnit.value.deviceId = response.deviceId;
    editingUnit.value.attributes = response.attributes;

    deviceDialogVisible.value = false;
  }, (response) => {
  });
};

const setDevice = (c, u) => {
  nowCabinet.value = c;
  editingUnit.value = u;
  deviceData.description = u.description || '';
  if (u.deviceId) {
    deviceData.deviceCategory = 'is_monitored';
    deviceData.selectedDevice = u.deviceId;
  } else if (u.accessoryId) {
    deviceData.deviceCategory = 'non_monitored';
    deviceData.inputDevice = u.name;
    deviceData.occupyUnits = u.rackUnit;
    if (u.attributes) {
      deviceData.deviceType = u.type || 'odf';
      if (u.type === 'odf') {
        deviceData.coreCount = u.attributes.coreCount;
        deviceData.coreOccupation = (u.attributes.coreOccupation || '').replaceAll(',', '\n');
        deviceData.interfaceType = u.attributes.interfaceType || null;
      }
    }
  } else {
    deviceData.deviceCategory = 'non_monitored';
    deviceData.inputDevice = '';
    deviceData.occupyUnits = 1;

    deviceData.coreCount = '12';
    deviceData.coreOccupation = '';
  }

  for (const field of extendFields.value) {
    if (u.attributes) {
      deviceData[field.value] = u.attributes[field.value];
    } else {
      deviceData[field.value] = '';
    }
  }

  deviceDialogVisible.value = true;
};

const handleShowCabinet = (cabinet) => {
  nowCabinet.value = cabinet;

  readCabinetFacilities(cabinet.id).then((response) => {
    cabinetFacilities.value = translateDevices(response, cabinet.units);
  }, (response) => {
  });
  viewCabinet.value = true;
};

const handleEditCabinet = (cabinet) => {
  cabinetForm.id = cabinet.id;
  cabinetForm.name = cabinet.name;
  cabinetForm.units = cabinet.units;
  cabinetForm.description = cabinet.description;
  cabinetPropertyVisible.value = true;
};

const handleDeleteCabinet = (cabinet) => {
  ElMessageBox.confirm(
    '确认要删除机柜吗?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    },
  ).then(() => {
    removeCabinet(cabinet.id).then((response) => {
      loadCabinets();
    });
  }).catch(() => {
    console.log('Cancel');
  });
};

const handleAddRoom = () => {
  roomForm.id = 0;
  roomForm.name = '';
  roomForm.description = '';
  roomPropertyVisible.value = true;
};

const handleAddCabinet = () => {
  cabinetForm.id = 0;
  cabinetForm.name = '';
  cabinetForm.units = 42;
  cabinetForm.description = '';
  cabinetPropertyVisible.value = true;
};

const handleUploadSuccess = () => {
  upload.value!.clearFiles();
  importDialogVisible.value = false;
  loadCabinets();
};

const uploadUrl = () => {
  const up = (window as any).urlPrefix;
  const url = up + (up.endsWith('/') ? '' : '/') + 'rest/hongqiao/computer_room_import/room_data?room_id=' + activeTab.value + '&version=' + cabinetLayout.value;
  return url;
};

const rowClass = (row) => {
  return row.row === nowCabinet.value ? 'active' : 'inactive';
};

const submitUpload = () => {
  upload.value!.submit();
};

const saveRoom = () => {
  rForm.value.validate((valid) => {
    if (valid) {
      if (roomForm.id === 0) {
        createRoom({ name: roomForm.name, description: roomForm.description }).then((newRoom) => {
          roomPropertyVisible.value = false;
          loadRooms(newRoom);
        });
      } else {
        updateRoom(roomForm.id, { id: roomForm.id, name: roomForm.name, description: roomForm.description }).then(() => {
          roomPropertyVisible.value = false;
          loadRooms(roomForm.id);
        });
      }
    }
  });
};

const saveCabinet = () => {
  cForm.value.validate((valid) => {
    if (valid) {
      if (cabinetForm.id === 0) {
        createCabinet({ name: cabinetForm.name, roomId: activeTab.value, description: cabinetForm.description, units: cabinetForm.units }).then(() => {
          cabinetPropertyVisible.value = false;
          loadCabinets();
        });
      } else {
        updateCabinet(cabinetForm.id, { id: cabinetForm.id, name: cabinetForm.name, description: cabinetForm.description, units: cabinetForm.units }).then(() => {
          cabinetPropertyVisible.value = false;
          loadCabinets();
        });
      }
    }
  });
};

const translateDevices = (devices, units) => {
  const facilities = [];
  if (devices.length > 0) {
    const mapByLocation = {};
    for (const r of devices) {
      mapByLocation[r.location] = r;
    }

    var rackUnit = 1;
    var prevDevice = null;
    for (let i = 1; i <= units; i++) {
      if (mapByLocation[i]) {
        const d = mapByLocation[i];

        var overlap = false;
        for (var j = i + 1; j <= i + d.rackUnit - 1; j++) {
          if (mapByLocation[j]) {
            overlap = true;
          }
        }

        rackUnit = d.rackUnit;
        if (rackUnit > 1 && !overlap) {
          // facilities.push(d);
          prevDevice = d;
          facilities.push({ location: i, name: '', rackUnit: -1 });
        } else {
          d.rackUnit = 1;
          facilities.push(d);
        }
      } else {
        // 没有设备起始于此位置
        if (rackUnit > 1) {
          rackUnit--;

          if (rackUnit === 1) {
            prevDevice.prev_location = i;
            facilities.push(prevDevice);
            prevDevice = null;
          } else {
            facilities.push({ location: i, name: '', rackUnit: -1 });
          }
        } else {
          facilities.push({ location: i, name: '', rackUnit: 1 });
        }
      }
    }
  } else {
    for (let i = units; i > 0; i--) {
      facilities.push({ location: i, name: '', rackUnit: 1 });
    }
  }
  return facilities.reverse();
};
</script>

<style>
  .el-tabs__content {
    height: calc(100% - 55px);
    padding: 10px;
  }

  .el-tabs__content > .el-tab-pane {
    height: 100%;
  }

  .table-wrap {
    height: 100%;
  }

  .cabinet-wrap {
    height: 100%;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: auto;
  }

  .cabinet {
    width: 350px;
    /*height: calc(100% - 20px);*/
    margin-left: 20px;
    margin-top: 5px;
    border: solid 1px silver;
    border-radius: 5px;
    display: inline-block;
    vertical-align: top;
  }

  .pdus {
    width: 100px;
    margin-left: 10px;
    margin-top: 8px;
    display: inline-block;
    vertical-align: top;
    border: solid 1px rgba(192, 192, 192, 0.5);
  }

  .cabinet-wrap .cabinet-table tbody td {
    padding: 1px 5px;
    font-size: 14px;
  }

  .cabinet-wrap .cabinet-table tbody .no-device {
    /*display: none;*/
  }

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

  .el-table__row.active, .el-table--enable-row-hover .el-table__body tr.active:hover>td.el-table__cell {
    background-color: #388bdf;
    color: white;
  }
</style>
