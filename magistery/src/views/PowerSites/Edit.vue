<template>
  <layout ref="newForm" form-title="编辑节点" :fit="false">
    <el-form ref="formRef" :model="formData" label-width="150px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="名称"
            prop="name"
            :rules="[
            { required: true, message: '名称不能为空' },
          ]">
            <el-input v-model="formData.name" disabled ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="电压等级"
            prop="kilovolt"
            :rules="[ { required: true, message: '电压等级不能为空' }, ]">
            <el-select v-model="formData.kilovolt" style="width: 100%">
              <el-option :key="level.value" v-for="level in voltageLevels" :label="level.label" :value="level.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="类型"
                        prop="type"
                        :rules="[ { required: true, message: '类型不能为空' }, ]">
            <el-select v-model="formData.type" style="width:100%;">
              <el-option :key="siteType.value" v-for="siteType in siteTypes" :label="siteType.label" :value="siteType.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="所在区域"
            prop="area"
            :rules="[ { required: true, message: '区域不能为空' }, ]">
            <el-tree-select v-model="formData.area" :data="anhuiArea" :check-strictly=true style="width:100%;">
            </el-tree-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="hr-line-dashed"></div>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="路由设备">
            <el-select filterable v-model="formData.route" style="width:100%;" @change="loadRoutePorts()" :disabled="formData.routeDisabled">
              <el-option :key="dev.id" v-for="dev in routeList" :value="dev.id" :label="dev.fields.display_name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button key="btnOk" type="primary" @click="newDevice('route')">添加</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="一区加密连接端口">
            <el-select filterable v-model="formData.encrypt_device_link_route_port1" style="width:100%;">
              <el-option :key="p.device_port_id" v-for="p in routePorts" :value="p.device_port_id" :label="p.if_alias + '[' + p.if_name + ']'"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="二区加密连接端口">
            <el-select filterable v-model="formData.encrypt_device_link_route_port2" style="width:100%;">
              <el-option :key="p.device_port_id" v-for="p in routePorts" :value="p.device_port_id" :label="p.if_alias + '[' + p.if_name + ']'"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" :offset="1">
          <el-tabs type="border-card">
            <el-tab-pane label="I区">
              <el-row :gutter="20">
                <el-col :span="20">
                  <el-form-item label="I区接入交换机">
                    <el-select filterable v-model="formData.switch1" style="width:100%;" @change="loadPorts(formData.switch1, true)" :disabled="formData.switch1Disabled">
                      <el-option :key="dev.id" v-for="dev in switchList1" :value="dev.id" :label="dev.fields.display_name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="连接加密装置端口">
                    <el-select filterable clearable v-model="formData.encrypt_device_link_port1" style="width:100%;">
                      <el-option :key="p.device_port_id" v-for="p in ports1" :value="p.device_port_id" :label="p.if_alias + '[' + p.if_name + ']'"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button key="btnOk" type="primary" @click="newDevice('switch1')">添加</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-scrollbar height="350px">
                    <table class="table"  style="width:100%;">
                      <thead>
                      <tr>
                        <th style="width: 120px">端口名称</th>
                        <th >描述</th>
                        <th>状态</th>
                        <th>业务</th>
                        <th>业务主机IP</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr :key="p.name" v-for="p in ports1">
                        <td :title="p.if_name" style="max-width: 200px; text-overflow: ellipsis;overflow:hidden; white-spacing: nowrap">
                          {{p.if_name}}
                        </td>
                        <td :title="p.if_alias" style="max-width: 200px; text-overflow: ellipsis;overflow:hidden; white-spacing: nowrap">
                          {{p.if_alias}}
                        </td>
                        <td>{{p.if_status === 1 ? 'up' : 'down'}}</td>
                        <td>
                          <el-select v-model="p.biz" clearable>
                            <el-option :key="biz.value" v-for="biz in bizTypes1" :value="biz.value" :label="biz.label"></el-option>
                          </el-select>
                        </td>
                        <td>
                          <el-select v-model="p.ip" allow-create filterable clearable>
                            <el-option :key="a" v-for="a in address1" :label="a" :value="a"></el-option>
                          </el-select>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </el-scrollbar>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-tabs type="border-card">
            <el-tab-pane label="II区">
              <el-row :gutter="20">
                <el-col :span="20">
                  <el-form-item label="II区接入交换机">
                    <el-select filterable v-model="formData.switch2" style="width:100%;" @change="loadPorts(formData.switch2, false)" :disabled="formData.switch2Disabled">
                      <el-option :key="dev.id" v-for="dev in switchList2" :value="dev.id" :label="dev.fields.display_name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="连接加密装置端口">
                    <el-select filterable clearable v-model="formData.encrypt_device_link_port2" style="width:100%;">
                      <el-option :key="p.device_port_id" v-for="p in ports2" :value="p.device_port_id" :label="p.if_alias + '[' + p.if_name + ']'"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button key="btnOk" type="primary" @click="newDevice('switch2')">添加</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-scrollbar height="350px">
                    <table class="table"  style="width:100%;">
                      <thead>
                      <tr>
                        <th style="width: 120px">端口名称</th>
                        <th >描述</th>
                        <th>状态</th>
                        <th>业务</th>
                        <th>业务主机IP</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr :key="p.name" v-for="p in ports2">
                        <td :title="p.if_name" style="max-width: 200px; text-overflow: ellipsis;overflow:hidden; white-spacing: nowrap">
                          {{p.if_name}}
                        </td>
                        <td :title="p.if_alias" style="max-width: 200px; text-overflow: ellipsis;overflow:hidden; white-spacing: nowrap">
                          {{p.if_alias}}
                        </td>
                        <td>{{p.if_status === 1 ? 'up' : 'down'}}</td>
                        <td>
                          <el-select v-model="p.biz" clearable>
                            <el-option :key="biz.value" v-for="biz in bizTypes2" :value="biz.value" :label="biz.label"></el-option>
                          </el-select>
                        </td>
                        <td>
                          <el-select v-model="p.ip" allow-create filterable clearable>
                            <el-option :key="a" v-for="a in address1" :label="a" :value="a"></el-option>
                          </el-select>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </el-scrollbar>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <div class="hr-line-dashed"></div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="">
            <el-button key="btnOk" type="primary" @click="saveData()">确定</el-button>
            <el-button key="btnCancel" type="default" @click="$router.push('/power_sites/index')">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <NewDevice ref="newDeviceRef" @created-device="deviceCreated"></NewDevice>
  </layout>
</template>

<script setup>
import Layout from '@/components/Layout/Form.vue';
import NewDevice from '@/views/PowerSites/NewDevice.vue';
import { anhuiStore } from '@/store/anhui';
import { fetchList, fetchPortList } from '@/api/mo';
import { updateSite, getSite, getDeviceInfo, getRouteInfo, checkView } from '@/api/powerSites';
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const formData = reactive({ id: 0, name: '', type: '', area: '', kilovolt: '', route: '1', switch1: '', switch2: '', routeDisabled: false, switch1Disabled: false, switch2Disabled: false, encrypt_device_link_port1: '', encrypt_device_link_port2: '', encrypt_device_link_route_port1: '', encrypt_device_link_route_port2: '' });
const routePorts = ref([]);
const ports1 = ref([]);
const ports2 = ref([]);
const address1 = ref([]);
const address2 = ref([]);
const routeList = ref([]);
const switchList = ref([]);
const switchList1 = ref([]);
const switchList2 = ref([]);
const anhuiArea = ref([]);
const voltageLevels = ref([]);
const siteTypes = ref([]);
const bizTypes1 = ref([]);
const bizTypes2 = ref([]);
const router = useRouter();

const formRef = ref(null);
const newDeviceRef = ref(null);
let init = false;
let switch1BizList = [];
let switch2BizList = [];

onMounted(() => {
  const siteId = router.currentRoute.value.params.id;
  anhuiStore.init().then(() => {
    getSite(siteId).then((site) => {
      formData.id = site.id;
      formData.name = site.name;
      formData.type = site.type;
      formData.area = site.area;
      formData.kilovolt = site.kilovolt;
      if (site.topology_view_id) {
        formData.topology_view_id = site.topology_view_id;
      }
      if (site.device_list) {
        for (const dev of site.device_list) {
          if (dev.role === 'route') {
            formData.route = dev.device_id;
            formData.encrypt_device_link_route_port1 = dev.encrypt_device_link_port1 || '';
            formData.encrypt_device_link_route_port2 = dev.encrypt_device_link_port2 || '';
          } else if (dev.role === 'switch1') {
            formData.switch1 = dev.device_id;
            formData.encrypt_device_link_port1 = dev.encrypt_device_link_port1 || '';
            switch1BizList = dev.biz_list;
          } else if (dev.role === 'switch2') {
            formData.switch2 = dev.device_id;
            formData.encrypt_device_link_port2 = dev.encrypt_device_link_port2 || '';
            switch2BizList = dev.biz_list;
          }
        }
      }

      loadDevices(true, 'all');
    });
  });
});

const loadDevices = (first, dev) => {
  fetchList({ by_type: 'basic_network_device' }).then((response) => {
    anhuiArea.value = anhuiStore.Areas;
    siteTypes.value = anhuiStore.SiteTypes;
    bizTypes1.value = anhuiStore.BizTypes1;
    bizTypes2.value = anhuiStore.BizTypes2;
    voltageLevels.value = anhuiStore.VoltageLevels;

    for (const i in response.data) {
      const dev = response.data[i];
      if (dev.fields.device_type === 2 || dev.fields.device_type === 3 || dev.fields.device_type === 13 || dev.fields.device_type === 14 || dev.fields.device_type === 15) {
        if (dev.engine_label !== '一区' && dev.engine_label !== '二区') {
          routeList.value.push(dev);
        }
      }
      if ((dev.engine_label === '一区' || dev.engine_label === '二区' || dev.fields.display_name.indexOf('一区') > 0 || dev.fields.display_name.indexOf('二区') > 0) && (dev.fields.device_type === 1 || dev.fields.device_type === 2 || dev.fields.device_type === 3)) {
        switchList.value.push(dev);

        if (dev.engine_label === '一区' || dev.fields.display_name.indexOf('一区') > 0) {
          switchList1.value.push(dev);
        } else if (dev.engine_label === '二区' || dev.fields.display_name.indexOf('二区') > 0) {
          switchList2.value.push(dev);
        }
      }
    }

    if (dev === 'all' || dev === 'routes') {
      loadRoutePorts();
    }

    if (dev === 'all' || dev === 'switch1') {
      loadPorts(formData.switch1, true, first ? switch1BizList : []);
    }

    if (dev === 'all' || dev === 'switch2') {
      loadPorts(formData.switch2, false, first ? switch2BizList : []);
    }
  }, (response) => {
  });
};

const loadPorts = (deviceId, forFirst, bizList) => {
  const bizMap = {};
  if (bizList) {
    for (const biz of bizList) {
      bizMap[biz.device_port_id] = biz;
    }
  }

  getDeviceInfo(deviceId).then((response) => {
    const ports = [];
    if (response.ports) {
      for (const port of response.ports) {
        ports.push(port);
      }
    }

    ports.sort(function(p1, p2) {
      return p1.if_index - p2.if_index;
    });

    for (const p of ports) {
      if (bizMap[p.device_port_id]) {
        p.biz = bizMap[p.device_port_id].biz_id;
        p.ip = bizMap[p.device_port_id].biz_address;
      } else {
        p.biz = '';
        if (p.ip_list && p.ip_list.length > 0) {
          p.ip = p.ip_list[0];
        }
      }
    }

    if (forFirst) {
      ports1.value = ports;
      address1.value = response.ip_list;
    } else {
      ports2.value = ports;
      address2.value = response.ip_list;
    }

    init = true;
  }, (response) => {
    if (forFirst) {
      ports1.value = [];
      address1.value = [];
    } else {
      ports2.value = [];
      address2.value = [];
    }
  });
};

const loadRoutePorts = () => {
  getRouteInfo(formData.route).then((response) => {
    const ports = [];
    for (const p of response.ports) {
      ports.push(p);
    }

    ports.sort((p1, p2) => {
      return p1.if_index - p2.if_index;
    });

    routePorts.value = ports;
  });
};

const saveData = () => {
  formRef.value.validate((valid) => {
    if (valid && init) {
      const site = {
        ID: formData.id,
        Name: formData.name,
        Type: formData.type,
        Area: formData.area,
        Kilovolt: parseInt(formData.kilovolt),
      };

      if (formData.topology_view_id) {
        site.topology_view_id = formData.topology_view_id;
      }

      const deviceList = [];
      deviceList.push({ device_id: parseInt(formData.route), encrypt_device_link_port1: parseInt(formData.encrypt_device_link_route_port1), encrypt_device_link_port2: parseInt(formData.encrypt_device_link_route_port2), role: 'route' });

      var bizList1 = [];
      const switch1 = { device_id: parseInt(formData.switch1), encrypt_device_link_port1: parseInt(formData.encrypt_device_link_port1), role: 'switch1' };
      for (const p of ports1.value) {
        if (p.biz && p.biz !== '0') {
          bizList1.push({ device_id: parseInt(formData.switch1), device_port_id: p.device_port_id, biz_id: p.biz, biz_address: p.ip });
        }
      }
      switch1.biz_list = bizList1;

      var bizList2 = [];
      const switch2 = { device_id: parseInt(formData.switch2), encrypt_device_link_port2: parseInt(formData.encrypt_device_link_port2), role: 'switch2' };
      for (const p of ports2.value) {
        if (p.biz && p.biz !== '0') {
          bizList2.push({ device_id: parseInt(formData.switch1), device_port_id: p.device_port_id, biz_id: p.biz, biz_address: p.ip });
        }
      }
      switch2.biz_list = bizList2;

      deviceList.push(switch1);
      deviceList.push(switch2);
      site.device_list = deviceList;

      updateSite(formData.id, site).then(() => {
        checkView(site.ID).then(() => {
          router.push('/power_sites/index');
        }, (response) => {
        });
      }, (response) => {
        console.log(response);
      });
    } else {
      return false;
    }
  });
};

const newDevice = (typ) => {
  if (newDeviceRef && newDeviceRef.value) {
    newDeviceRef.value.showDevice(typ);
  }
};

const deviceCreated = (newType, newId) => {
  formData[newType] = newId;
  loadDevices(false, newType);
};
</script>
