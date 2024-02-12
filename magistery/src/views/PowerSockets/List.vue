<template>
  <layout ref="layout" list-title="机柜电源管理" >
    <template #header>
      <el-button icon="plus" @click="handleAddPower">添加</el-button>
      <el-button type="warning" icon="upload" @click="handleImportSockets">导入</el-button>
      <el-button type="warning" icon="download" @click="handleExportSockets">导出</el-button>
      <el-button type="info" icon="tickets" @click="handleStat">统计</el-button>
    </template>
    <template #list>
      <el-table
        :data="allPowerSockets"
        >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
            prop="name"
            label="名称">
        </el-table-column>
        <el-table-column
          prop="roomName"
          label="所在机房">
        </el-table-column>
        <el-table-column
          prop="cabinetName"
          label="所在机柜">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="socketCount"
          label="插口总数">
          <template #default="scope">
            {{JSON.parse(scope.row.attributes).socketCount}}
          </template>
        </el-table-column>
        <el-table-column
          prop="socketLeft"
          label="剩余插口数">
          <template #default="scope">
            {{JSON.parse(scope.row.attributes).socketLeft}}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation" width="250">
          <template #default="scope">
            <el-button size="small" icon="edit" @click="handleEdit(scope.row)"></el-button>
            <el-button size="small" icon="delete" @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        width="40%"
        v-model="powerPropertyVisible"
        title="电源属性">
        <el-form ref="pForm" :model="powerForm" label-width="150px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '名称不能为空！' }, ]">
                <el-input v-model="powerForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '类型不能为空！' }, ]">
                <el-select v-model="powerForm.type" style="width: 100%;">
                  <el-option label="PDU" value="pdu"></el-option>
                  <el-option label="STS" value="sts"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="机房" prop="room" :rules="[{ required: true, message: '所在机房不能为空！' }, ]">
                <el-select v-model="powerForm.room" style="width: 100%;" @change="loadCabinets" filterable>
                  <el-option v-for="room in allRooms" :key="room.id" :label="room.name" :value="room.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="机柜" prop="cabinet" :rules="[{ required: true, message: '所在机柜不能为空！' }, ]">
                <el-select v-model="powerForm.cabinet" style="width: 100%;">
                  <el-option v-for="cabinet in roomCabinets" :key="cabinet.id" :label="cabinet.name" :value="cabinet.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="插口总数" prop="socketCount" :rules="[{ required: true, message: '插口总数不能为空！' }, ]">
                <el-input v-model="powerForm.socketCount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="剩余插口数" prop="socketLeft" :rules="[{ required: true, message: '剩余插口数不能为空！' }, ]">
                <el-input v-model="powerForm.socketLeft"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button key="btnOk" type="primary" @click="handleSavePower">确定</el-button>
            <el-button key="btnCancel" type="default" @click="powerPropertyVisible = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog
        width="40%"
        v-model="statDialogVisible"
        title="统计">
        <el-form ref="sForm" :model="statForm" label-width="150px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="机房选择" prop="type">
                <el-select v-model="statForm.roomIds" style="width: 100%;" placeholder="未选择则统计所有机房" clearable filterable multiple>
                  <el-option v-for="room in allRooms" :key="room.id" :label="room.name" :value="room.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
              <el-button key="btnOk" type="primary" @click="handleDoStat">确定</el-button>
                <el-button key="btnCancel" type="default" @click="statDialogVisible = false">取消</el-button>
            </span>
        </template>
      </el-dialog>
      <el-dialog
        width="60%"
        v-model="statResultVisible"
        title="统计结果">
        <el-row>
          <el-col :span="24">
            <el-tabs
              v-model="activeRoom"
              type="card"
              class="demo-tabs"
            >
              <el-tab-pane v-for="item in statResult" :label="item.roomName" :name="item.roomId" v-bind:key="item.roomId">
                <div style="width: 100%; min: 400px; max-height: 500px; overflow-y: auto;">
                  <table class="table" style="width: 100%;">
                    <thead>
                      <tr>
                        <th>机柜</th>
                        <th>PDU插口数</th>
                        <th>剩余插口数</th>
                        <th>STS插口数</th>
                        <th>剩余插口数</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="cabinet in item.stat" v-bind:key="cabinet.cabinetId">
                        <td>{{cabinet.cabinetName}}</td>
                        <td>{{cabinet.pduSocketTotal}}</td>
                        <td>{{cabinet.pduSocketTotal - cabinet.pduSocketUsed}}</td>
                        <td>{{cabinet.stsSocketTotal}}</td>
                        <td>{{cabinet.stsSocketTotal - cabinet.stsSocketUsed}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <template #footer>
          <span class="dialog-footer">
            <el-button key="btnOk" type="primary" @click="handleOutputStat">导出</el-button>
            <el-button key="btnCancel" type="default" @click="statResultVisible = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog
        width="50%"
        v-model="importDialogVisible"
        title="导入">
        <el-form label-width="150px">
          <el-row>
            <el-col :span="24">
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
    </template>
  </layout>
</template>
<script lang="ts" setup>
import Layout from '@/components/Layout/List.vue';
import { onMounted, ref, reactive, getCurrentInstance, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { readRooms, readCabinets, readPowerSockets, readPowerSocketStat, createPowerSocket, updatePowerSocket, deletePowerSocket } from '@/api/computerRooms';
import { ElMessageBox, ElMessage, genFileId } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import XLSX from 'xlsx';

const powerForm = reactive({ id: 0, name: '', type: 'pdu', description: '', room: '', cabinet: '', socketCount: 8, socketLeft: 0 });
const powerPropertyVisible = ref(false);
const statForm = reactive({ roomIds: [] });
const statDialogVisible = ref(false);
const statResultVisible = ref(false);
const statResult = ref([]);
const allRooms = ref([]);
const allPowerSockets = ref([]);
const roomCabinets = ref([]);
const pForm = ref(null);
const sForm = ref(null);
const activeRoom = ref('');
const importDialogVisible = ref(false);
const upload = ref<UploadInstance>();

onMounted(() => {
  readRooms('', false).then((response) => {
    allRooms.value = response;
  }, (response) => {
    console.log(response);
  });

  loadSockets();
});

const loadSockets = () => {
  readPowerSockets().then((response) => {
    allPowerSockets.value = response;
  }, (response) => {
    console.log(response);
  });
};

const handleSavePower = () => {
  pForm.value.validate((valid) => {
    if (valid) {
      const attributes = { socketCount: powerForm.socketCount, socketLeft: powerForm.socketLeft };

      const data = { id: powerForm.id, name: powerForm.name, type: powerForm.type, roomId: powerForm.room, cabinetId: powerForm.cabinet, attributes: JSON.stringify(attributes) };
      if (powerForm.id) {
        updatePowerSocket(powerForm.cabinet, powerForm.id, data).then((response) => {
          console.log(response);
          powerPropertyVisible.value = false;
          loadSockets();
        });
      } else {
        createPowerSocket(powerForm.cabinet, data).then((response) => {
          console.log(response);
          powerPropertyVisible.value = false;
          loadSockets();
        });
      }
    } else {
      console.log('validate failed!');
    }
  });
};

const handleAddPower = () => {
  powerForm.id = 0;
  powerForm.name = '';
  powerPropertyVisible.value = true;
};

const handleEdit = (row) => {
  powerForm.id = row.id;
  powerForm.name = row.name;
  powerForm.type = row.type;
  powerForm.room = row.roomId;
  powerForm.cabinet = row.cabinetId;
  powerForm.socketCount = JSON.parse(row.attributes).socketCount;
  powerForm.socketLeft = JSON.parse(row.attributes).socketLeft;
  powerPropertyVisible.value = true;

  loadCabinets();
};

const handleDelete = (row) => {
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
    deletePowerSocket(row.cabinetId, row.id).then(() => {
      loadSockets();
    }, (response) => {
    });
  });
};

const handleStat = () => {
  statForm.roomIds = [];
  statDialogVisible.value = true;
};

const handleDoStat = () => {
  readPowerSocketStat({ roomIds: statForm.roomIds }).then((response) => {
    statResult.value = response;
    activeRoom.value = response[0].roomId;
    statResultVisible.value = true;
  }, (response) => {
  });

  statDialogVisible.value = false;
};

const handleOutputStat = () => {
  const workbook = XLSX.utils.book_new();
  for (const sr of statResult.value) {
    const aoa = [
      ['机柜', 'PDU插口数', '剩余插口数', 'STS插口数', '剩余插口数'],
    ];

    for (const s of sr.stat) {
      aoa.push([s.cabinetName, s.pduSocketTotal, s.pduSocketTotal - s.pduSocketUsed, s.stsSocketTotal, s.stsSocketTotal - s.stsSocketUsed]);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(workbook, worksheet, sr.roomName);
  }
  XLSX.writeFile(workbook, '光缆.xlsx');

  statResultVisible.value = false;
};

const handleImportSockets = () => {
  importDialogVisible.value = true;
};

const handleExportSockets = () => {
  const aoa = [
    ['名称', '所在机房', '所在机柜', '类型', '插口总数', '剩余插口数'],
  ];

  for (const socket of allPowerSockets.value) {
    const attr = JSON.parse(socket.attributes);
    aoa.push([socket.name, socket.roomName, socket.cabinetName, socket.type, attr.socketCount, attr.socketLeft]);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '机房电源');
  XLSX.writeFile(workbook, '机房电源.xlsx');
};

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const handleUploadSuccess = () => {
  importDialogVisible.value = false;
  loadSockets();
};

const loadCabinets = () => {
  if (powerForm.room) {
    readCabinets(powerForm.room).then((response) => {
      roomCabinets.value = response;
    }, (response) => {
      roomCabinets.value = [];
    });
  }
};

const submitUpload = () => {
  upload.value!.submit();
};

const uploadUrl = () => {
  const url = (window as any).urlPrefix + '/rest/hongqiao/computer_room_import/power_sockets';
  return url;
};
</script>
