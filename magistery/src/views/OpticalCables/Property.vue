<template>
  <layout ref="layout" form-title="光缆属性" :fit="false">
    <el-form ref="propertyForm" :model="formData" label-width="160px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="光缆编号"
            prop="name"
            :disabled="editMode"
            :rules="[
            { required: true, message: '光缆编号不能为空' },
          ]">
            <el-input v-model="formData.name" ></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
          <!--<el-form-item-->
            <!--label="对端序号"-->
            <!--prop="peer_no"-->
            <!--:rules="[-->
            <!--{ required: true, message: '对端序号不能为空' },-->
          <!--]">-->
            <!--<el-input v-model="formData.peer_no" ></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="起点机房"
            prop="local_room_id"
            :rules="[
            { required: true, message: '起点机房不能为空' },
          ]">
            <el-select v-model="formData.local_room_id" style="width: 100%;" filterable @change="loadCabinets(true)">
              <el-option v-for="room in rooms" :key="room.id" :value="room.id" :label="room.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="终点机房"
            prop="peer_room_id"
            :rules="[
            { required: true, message: '终点机房不能为空' },
          ]">
            <el-select v-model="formData.peer_room_id" style="width: 100%;" filterable @change="loadCabinets(false)">
              <el-option v-for="room in rooms" :key="room.id" :value="room.id" :label="room.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="起点ODF"
            prop="local_odf"
            :rules="[
            { required: true, message: 'ODF不能为空' },
          ]">
            <el-select v-model="formData.local_cabinet_id" style="width: 50%;" @change="loadCabinet(true)" placeholder="所在机柜" clearable>
              <el-option v-for="cabinet in localCabinets" :key="cabinet.id" :value="cabinet.id" :label="cabinet.name"></el-option>
            </el-select>
            <el-select v-model="formData.local_odf" style="width: 48%; margin-left: 2%;" placeholder="选择ODF" clearable>
              <el-option v-for="item in localCabinetOdfs" :key="item.accessoryId" :label="item.name" :value="item.accessoryId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="终点ODF"
            prop="peer_odf">
            <el-select v-model="formData.peer_cabinet_id" style="width: 50%;" @change="loadCabinet(false)" placeholder="所在机柜" clearable>
              <el-option v-for="cabinet in peerCabinets" :key="cabinet.id" :value="cabinet.id" :label="cabinet.name"></el-option>
            </el-select>
            <el-select v-model="formData.peer_odf" style="width: 48%; margin-left: 2%;" placeholder="选择ODF" clearable>
              <el-option v-for="item in peerCabinetOdfs" :key="item.accessoryId" :label="item.name" :value="item.accessoryId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="起点类型"
            prop="local_core_count"
            :rules="[
            { required: true, message: '起点光缆类型不能为空' },
          ]">
            <el-select v-model="formData.local_odf_type" style="width: 50%; " placeholder="选择光缆类型" @change="selectFromOdfType()">
              <el-option v-for="item in odfTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="formData.local_core_count" style="width: 48%; margin-left: 2%;" @change="selectFromCoreCount()">
              <el-option v-for="c in coreCountOptions" :key="c" :value="c" :label="c + '芯'"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="终点类型"
            prop="peer_core_count"
            >
            <el-select v-model="formData.peer_odf_type" style="width: 50%;" placeholder="选择光缆类型">
              <el-option v-for="item in odfTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="formData.peer_core_count" style="width: 48%; margin-left: 2%;">
              <el-option v-for="c in coreCountOptions" :key="c" :value="c" :label="c + '芯'"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="芯使用"
            prop="core_occupation">
            <el-input v-model="formData.core_occupation" type="textarea" :rows="4" placeholder="芯使用情况，一行输入一个区间，例如：&#10;1-4&#10;12&#10;18-24"></el-input>
          </el-form-item>
          <el-form-item
            label="芯预留"
            prop="core_occupation">
            <el-input v-model="formData.core_reserve" type="textarea" :rows="4" placeholder="芯预留情况，一行输入一个区间，例如：&#10;1-4&#10;12&#10;18-24"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="类型"
            prop="type"
            :rules="[
            { required: true, message: '类型不能为空' },
          ]">
            <el-select v-model="formData.type" style="width: 100%;">
              <el-option v-for="cls in cableClass" :key="cls.value" :value="cls.value" :label="cls.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="航站楼"
            prop="terminal">
            <el-select v-model="formData.terminal" style="width: 100%;" clearable fiterable>
              <el-option value="T1" label="T1"></el-option>
              <el-option value="T2" label="T2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="备注"
            prop="description">
            <el-input v-model="formData.description" type="textarea" :rows="4"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="hr-line-dashed"></div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="">
            <el-button key="btnOk" type="primary" @click="submitForm()">确定</el-button>
            <el-button key="btnCancel" type="default" @click="$router.push('/optical_cables')">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </layout>
</template>

<script lang="ts" setup>
import Layout from '@/components/Layout/Form.vue';
import { getRooms, getCabinets } from '@/api/odfs';
import { getCabinetWithAccessories, createOpticalCable, updateOpticalCable, getOpticalCable } from '@/api/computerRooms';
import { readByUuid } from '@/api/dict';
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const coreCountOptions = [2, 4, 6, 12, 18, 24, 36, 48, 64, 96, 144];
const router = useRouter();
const rooms = ref([]);
const localCabinets = ref([]);
const peerCabinets = ref([]);
const formData = reactive({ id: 0 });
const cableClass = ref([]);
const odfTypes = ref([]);
const localCabinetOdfs = ref([]);
const peerCabinetOdfs = ref([]);

const propertyForm = ref(null);
const editMode = ref(false);

onMounted(() => {
  const id = router.currentRoute.value.params.id;
  const localRoomId = router.currentRoute.value.query.local_room_id;
  const peerRoomId = router.currentRoute.value.query.peer_room_id;
  if (id && id !== 'new') {
    editMode.value = true;
    getOpticalCable(id).then((response) => {
      const o = response.coreOccupation || '';
      const r = response.coreReserve || '';

      formData.id = response.id || 0;
      formData.name = response.name;
      formData.description = response.description;
      formData.local_room_id = response.fromRoomId;
      formData.local_cabinet_id = response.fromCabinetId;
      formData.local_odf = response.fromAccessoryId;
      formData.local_odf_type = response.fromOdfType;
      formData.local_core_count = response.fromCoreCount;
      formData.peer_room_id = response.toRoomId;
      formData.peer_cabinet_id = response.toCabinetId;
      formData.peer_odf = response.toAccessoryId;
      formData.peer_odf_type = response.toOdfType;
      formData.peer_core_count = response.toCoreCount;
      formData.type = response.type;
      if (response.attrMap) {
        formData.terminal = response.attrMap.terminal || '';
      }
      formData.core_occupation = o.replaceAll(',', '\n');
      formData.core_reserve = r.replaceAll(',', '\n');
      loadRooms();
    });
  } else {
    if (localRoomId && peerRoomId) {
      formData.local_room_id = parseInt(localRoomId);
      formData.peer_room_id = parseInt(peerRoomId);
    }
    loadRooms();
  }

  loadTypes();
  loadClassification();
});

const loadClassification = () => {
  readByUuid('cable_class').then((response) => {
    cableClass.value = response;
  });
};

const loadTypes = () => {
  readByUuid('odf_types').then((response) => {
    odfTypes.value = response;
  });
};

const loadRooms = () => {
  getRooms().then((response) => {
    rooms.value = response;

    if (formData.local_room_id) {
      loadCabinets(true);
    }

    if (formData.peer_room_id) {
      loadCabinets(false);
    }
  });
};

const loadCabinets = (isLocal) => {
  if (isLocal) {
    getCabinets(formData.local_room_id).then((response) => {
      localCabinets.value = response;
      loadCabinet(isLocal);
    });
  } else {
    getCabinets(formData.peer_room_id).then((response) => {
      peerCabinets.value = response;
      loadCabinet(isLocal);
    });
  }
};

const loadCabinet = (isLocal) => {
  if (isLocal) {
    if (formData.local_cabinet_id) {
      getCabinetWithAccessories(formData.local_cabinet_id, 'odf').then((response) => {
        localCabinetOdfs.value = response.devices;
      });
    } else {
      localCabinetOdfs.value = 42;
      formData.local_location = null;
      formData.local_rack_unit = null;
    }
  } else {
    if (formData.peer_cabinet_id) {
      getCabinetWithAccessories(formData.peer_cabinet_id, 'odf').then((response) => {
        peerCabinetOdfs.value = response.devices;
      });
    } else {
      peerCabinetOdfs.value = 42;
      formData.peer_location = null;
      formData.peer_rack_unit = null;
    }
  }
};

const selectFromOdfType = () => {
  if (!formData.peer_odf_type && formData.local_odf_type) {
    formData.peer_odf_type = formData.local_odf_type;
  }
};

const selectFromCoreCount = () => {
  if (!formData.peer_core_count) {
    formData.peer_core_count = formData.local_core_count;
  }
};

const submitForm = () => {
  propertyForm.value.validate((valid) => {
    if (valid) {
      const o = formData.core_occupation || '';
      const r = formData.core_reserve || '';
      const data = { id: formData.id, name: formData.name, description: formData.description, type: formData.type, fromRoomId: formData.local_room_id, toRoomId: formData.peer_room_id, fromAccessoryId: formData.local_odf, coreOccupation: o.replaceAll('\r', '').replaceAll('\n', ','), coreReserve: r.replaceAll('\r', '').replaceAll('\n', ',') };
      data.attributes = { terminal: formData.terminal, from_odf_type: formData.local_odf_type, from_core_count: formData.local_core_count, core_reserve: r.replaceAll('\r', '').replaceAll('\n', ',') };
      if (formData.peer_odf) {
        data.toAccessoryId = formData.peer_odf;
      }

      if (formData.peer_odf_type) {
        data.attributes.to_odf_type = formData.peer_odf_type;
        data.attributes.to_core_count = formData.peer_core_count;
      }

      data.attributes = JSON.stringify(data.attributes);

      if (formData.id) {
        updateOpticalCable(formData.id, data).then((response) => {
          console.log(response);
          router.push('/optical_cables');
        });
      } else {
        createOpticalCable(data).then((response) => {
          console.log(response);
          router.push('/optical_cables');
        });
      }
    } else {
      console.log('error submit!');
    }
  });
};
</script>
