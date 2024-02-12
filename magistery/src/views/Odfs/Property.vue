<template>
  <layout ref="newForm" form-title="新建光纤对象" :fit="false">
    <el-form ref="formRef" :model="formData" label-width="160px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="序号"
            prop="name"
            :rules="[
            { required: true, message: '序号不能为空' },
          ]">
            <el-input v-model="formData.name" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="对端序号"
            prop="peer_no"
            :rules="[
            { required: true, message: '对端序号不能为空' },
          ]">
            <el-input v-model="formData.peer_no" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="终点机房"
            prop="peer_room_id"
            :rules="[
            { required: true, message: '终点机房不能为空' },
          ]">
            <el-select v-model="formData.peer_room_id" style="width: 100%;">
              <el-option v-for="room in rooms" :key="room.id" :value="room.id" :label="room.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="起点机房"
            prop="room_id"
            :rules="[
            { required: true, message: '起点机房不能为空' },
          ]">
            <el-select v-model="formData.room_id" style="width: 100%;" @change="loadCabinets()">
              <el-option v-for="room in rooms" :key="room.id" :value="room.id" :label="room.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="本端机柜"
            prop="cabinet_id"
            :rules="[
            { required: true, message: '本端机柜不能为空' },
          ]">
            <el-select v-model="formData.cabinet_id" style="width: 100%;" @change="loadCabinet()">
              <el-option v-for="cabinet in cabinets" :key="cabinet.id" :value="cabinet.id" :label="cabinet.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="模式"
            prop="mode">
            <el-select v-model="formData.mode" style="width: 100%;">
              <el-option label="单模" value="single"></el-option>
              <el-option label="多模" value="multiple"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="柜内位置"
            prop="location"
            :rules="[
            { required: true, message: '柜内位置不能为空' },
          ]">
            <el-select v-model="formData.location" style="width: 100%;">
              <el-option v-for="i in 42" :key="i" :label="i + 'U'" :value="i"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="芯数"
            prop="core_count">
            <el-select v-model="formData.core_count" style="width: 100%;">
              <el-option :value="2" label="2芯"></el-option>
              <el-option :value="4" label="4芯"></el-option>
              <el-option :value="6" label="6芯"></el-option>
              <el-option :value="12" label="12芯"></el-option>
              <el-option :value="18" label="18芯"></el-option>
              <el-option :value="24" label="24芯"></el-option>
              <el-option :value="36" label="36芯"></el-option>
              <el-option :value="48" label="48芯"></el-option>
              <el-option :value="64" label="64芯"></el-option>
              <el-option :value="96" label="96芯"></el-option>
              <el-option :value="144" label="144芯"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="柜内高度"
            prop="rack_unit">
            <el-select v-model="formData.rack_unit" style="width:100%;">
              <el-option v-for="i in cabinetUnits" :key="i" :value="i" :label="i + 'U'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="位置"
            prop="area">
            <el-select v-model="formData.area" style="width: 100%;">
              <el-option v-for="odfArea in odfAreas" :key="odfArea.value" :value="odfArea.value" :label="odfArea.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="芯使用"
            prop="core_occupation">
            <el-input v-model="formData.core_occupation" type="textarea" :rows="4"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="备注"
            prop="description">
            <el-input v-model="formData.description" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="类型"
            prop="classification">
            <el-select v-model="formData.classification" style="width: 100%;">
              <el-option v-for="odfType in odfTypes" :key="odfType.value" :value="odfType.value" :label="odfType.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="hr-line-dashed"></div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="">
            <el-button key="btnOk" type="primary" @click="saveData()">确定</el-button>
            <el-button key="btnCancel" type="default" @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </layout>
</template>

<script lang="ts" setup>
import Layout from '@/components/Layout/Form.vue';
import { getRooms, getCabinets, getCabinet, createOdf, getOdf, updateOdf } from '@/api/odfs';
import { readByUuid } from '@/api/dict';
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const rooms = ref([]);
const cabinets = ref([]);
const odfAreas = ref([]);
const odfTypes = ref([]);
const formData = reactive({ mode: 'single', core_count: 24, core_occupation: '', rack_unit: 2, description: '' });
const formRef = ref(null);
const cabinetUnits = ref(42);
let odfId = '';

onMounted(() => {
  const id = router.currentRoute.value.params.id;
  if (id && id !== 'new') {
    odfId = id;
    getOdf(id).then((response) => {
      const keys = Object.keys(response);
      keys.forEach((item) => {
        if (item === 'core_occupation') {
          formData[item] = response[item].replace(/\,/g, '\n');
        } else {
          formData[item] = response[item];
        }
      });
      loadRooms();
    });
  } else {
    loadRooms();
  }

  loadAreas();
  // loadTypes();
});

const loadRooms = () => {
  getRooms().then((response) => {
    rooms.value = response;

    if (formData.room_id) {
      loadCabinets();
    }
  });
};

const loadCabinets = () => {
  getCabinets(formData.room_id).then((response) => {
    cabinets.value = response;
    loadCabinet();
  });
};

const loadAreas = () => {
  readByUuid('odf_areas').then((response) => {
    odfAreas.value = response;
  });
};

const loadTypes = () => {
  readByUuid('odf_types').then((response) => {
    odfTypes.value = response;
  });
};

const loadCabinet = () => {
  if (formData.cabinet_id) {
    getCabinet(formData.cabinet_id).then((response) => {
      cabinetUnits.value = response.units;
    });
  }
};

const saveData = () => {
  formRef.value.validate((valid) => {
    const d = {
      name: formData.name,
      room_id: formData.room_id,
      cabinet_id: formData.cabinet_id,
      location: formData.location,
      rack_unit: formData.rack_unit,
      description: formData.description,
      attributes: {
        peer_no: formData.peer_no,
        peer_room_id: formData.peer_room_id,
        mode: formData.mode,
        area: formData.area,
        core_count: formData.core_count,
        core_occupation: formData.core_occupation.trim().replace(/\n/g, ','),
        classification: formData.classification,
      },
    };

    if (odfId) {
      d.id = parseInt(odfId);
      updateOdf(odfId, d).then((response) => {
        router.go(-1);
      });
    } else {
      createOdf(d).then((response) => {
        router.go(-1);
      });
    }
  });
};
</script>
