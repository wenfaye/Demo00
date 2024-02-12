<template>
  <el-dialog v-model="dialogVisible" title="添加设备">
    <el-form v-loading="loading"  ref="formRef" :model="deviceData" label-width="150px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="IP地址"
            prop="address"
            :rules="[
            { required: true, message: 'IP地址不能为空' },
          ]">
            <el-input v-model="deviceData.address" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="自定义名"
            prop="zhName">
            <el-input v-model="deviceData.zhName" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="设备类型"
            prop="deviceType">
            <el-select v-model="deviceData.deviceType" placeholder="自动识别" style="width: 100%;" >
              <el-option value="switch" label="交换机"></el-option>
              <el-option value="routes" label="路由器"></el-option>
              <el-option value="switch_route" label="交换路由"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="采集引擎"
            prop="deviceType">
            <el-select v-model="deviceData.engine_id" placeholder="默认" style="width: 100%;" >
              <el-option v-for="smpNode in smpNodes" :value="smpNode.id" :label="smpNode.name" :key="smpNode.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-tabs type="border-card">
            <el-tab-pane label="Snmp访问参数">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    label="版本"
                    prop="snmpVersion">
                    <el-select v-model="deviceData.snmpVersion" style="width: 100%;" >
                      <el-option label="V1" value="v1"></el-option>
                      <el-option label="V2" value="v2c"></el-option>
                      <el-option label="V3" value="v3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="端口"
                    prop="snmpPort">
                    <el-input v-model="deviceData.snmpPort" ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="deviceData.snmpVersion === 'v2c' || deviceData.snmpVersion === 'v1'">
                <el-col :span="12">
                  <el-form-item
                    label="读共同体名"
                    prop="readCommunity">
                    <el-input v-model="deviceData.readCommunity" type="password" show-password autocomplete="new-password" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="写共同体名"
                    prop="writeCommunity">
                    <el-input v-model="deviceData.writeCommunity" type="password" show-password autocomplete="new-password" ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="deviceData.snmpVersion === 'v3'">
                <el-col :span="12">
                  <el-form-item
                    label="安全级别"
                    prop="secLevel">
                    <el-select v-model="deviceData.secLevel"  style="width:100%;" clearable>
                      <el-option value="noAuthNoPriv" label="noAuthNoPriv"></el-option>
                      <el-option value="authNoPriv" label="authNoPriv"></el-option>
                      <el-option value="authPriv" label="authPriv"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="安全名"
                    prop="secName">
                    <el-input v-model="deviceData.secName" ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="deviceData.snmpVersion === 'v3'">
                <el-col :span="12">
                  <el-form-item
                    label="加密方式"
                    prop="privProto">
                    <el-select v-model="deviceData.privProto" style="width:100%;" clearable>
                      <el-option value="des" label="des"></el-option>
                      <el-option value="aes" label="aes"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="授权方式"
                    prop="authProto">
                    <el-select v-model="deviceData.authProto" style="width:100%;" clearable>
                      <el-option value="md5" label="md5"></el-option>
                      <el-option value="sha" label="sha"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="deviceData.snmpVersion === 'v3'">
                <el-col :span="12">
                  <el-form-item
                    label="加密密码"
                    prop="privPass">
                    <el-input v-model="deviceData.privPass" type="password" autocomplete="new-password"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="授权密码"
                    prop="authPass">
                    <el-input v-model="deviceData.authPass" type="password" autocomplete="new-password"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24" style="text-align: right;">
                  <el-button @click="testSnmp()"> 测试</el-button>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="SSH访问参数">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    label="用户名"
                    prop="sshUser">
                    <el-input v-model="deviceData.sshUser" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="使能密码"
                    prop="sshEnablePassword">
                    <el-input v-model="deviceData.sshEnablePassword" type="password" autocomplete="new-password"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    label="密码"
                    prop="sshPassword">
                    <el-input v-model="deviceData.sshPassword"  type="password"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="使能命令"
                    type="password"
                    prop="sshEnableCommand">
                    <el-input v-model="deviceData.sshEnableCommand" ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    label="端口"
                    prop="sshPort">
                    <el-input v-model="deviceData.sshPort" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="私钥"
                    prop="sshPrivateKey">
                    <el-input v-model="deviceData.sshPrivateKey" ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    label="兼容模式"
                    prop="useExternalSSH">
                    <el-input v-model="deviceData.useExternalSSH" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24" style="text-align: right;">
                  <el-button @click="testSsh()"> 测试</el-button>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="Telnet参数">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    label="用户名"
                    prop="telnetUser">
                    <el-input v-model="deviceData.telnetUser" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="使能密码"
                    prop="telnetEnablePassword">
                    <el-input v-model="deviceData.telnetEnablePassword" type="password" autocomplete="new-password"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    label="密码"
                    prop="telnetPassword">
                    <el-input v-model="deviceData.telnetPassword"  type="password" autocomplete="new-password"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="使能命令"
                    type="password"
                    prop="telnetEnableCommand">
                    <el-input v-model="deviceData.telnetEnableCommand" ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    label="端口"
                    prop="telnetPort">
                    <el-input v-model="deviceData.telnetPort" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24" style="text-align: right;">
                  <el-button @click="testTelnet()"> 测试</el-button>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="saveDevice()">
          确定
        </el-button>
        <el-button @click="dialogVisible = false"> 取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive, defineExpose, defineEmits } from 'vue';
import { testParam } from '@/api/powerSites';
import { createMo, samplingNodes } from '@/api/mo';

const formRef = ref(null);
const deviceData = reactive({ readCommunity: '', writeCommunity: '', snmpVersion: 'v2c', deviceType: 'switch_route', snmpPort: 161, sshPort: 22, telnetPort: 23 });
const dialogVisible = ref(false);
const loading = ref(false);
const smpNodes = ref([]);
const emit = defineEmits(['createdDevice']);
let newType: string = '';

onMounted(() => {
  samplingNodes().then((response) => {
    smpNodes.value = response;
  });
});

const showDevice = (t: string) => {
  newType = t;
  if (formRef.value) {
    formRef.value.resetFields();
  }
  dialogVisible.value = true;
};

const saveDevice = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const mo = {
        types: [deviceData.deviceType || 'network_device'],
        fields: { address: deviceData.address },
        custom_name: deviceData.zhName,
        access_params: {},
      };

      if (deviceData.engine_id) {
        mo.fields.engine_id = deviceData.engine_id;
      }

      if (deviceData.readCommunity && deviceData.snmpVersion !== 'v3') {
        const snmpParam = {
          version: deviceData.snmpVersion,
          port: deviceData.snmpPort || 161,
          read_community: deviceData.readCommunity || '',
          write_community: deviceData.writeCommunity || '',
        };
        mo.access_params.snmp = snmpParam;
      } else if (deviceData.secName && deviceData.snmpVersion === 'v3') {
        const snmpParam = {
          version: deviceData.snmpVersion,
          sec_level: deviceData.secLevel || '',
          sec_name: deviceData.secName || '',
          priv_proto: deviceData.privProto || '',
          priv_pass: deviceData.privPass || '',
          auth_proto: deviceData.authProto || '',
          auth_pass: deviceData.authPass || '',
        };
        mo.access_params.snmp = snmpParam;
      }

      if (deviceData.sshUser) {
        const sshParam = {
          port: deviceData.sshPort || 22,
          username: deviceData.sshUser || '',
          password: deviceData.sshPassword || '',
          enable_command: deviceData.sshEnableCommand || '',
          enable_password: deviceData.sshEnablePassword || '',
          private_key: deviceData.sshPrivateKey || '',
          use_external_ssh: deviceData.useExternalSSH === 'on',
        };
        mo.access_params.ssh = sshParam;
      }
      if (deviceData.telnetUser) {
        const telnetParam = {
          port: deviceData.telnetPort || 23,
          username: deviceData.telnetUser || '',
          password: deviceData.telnetPassword || '',
          enable_command: deviceData.telnetEnableCommand || '',
          enable_password: deviceData.telnetEnablePassword || '',
        };
        mo.access_params.telnet = telnetParam;
      }

      loading.value = true;
      createMo(mo).then((response) => {
        alert('创建成功！');
        emit('createdDevice', newType, response);
        dialogVisible.value = false;
        loading.value = false;
      }, (response) => {
        loading.value = false;
      });
    }
  });
};

const testSnmp = () => {
  const p = {
    'snmp.address': deviceData.address,
    'snmp.port': deviceData.snmpPort || 161,
    'snmp.version': deviceData.snmpVersion,
    'snmp.read_community': deviceData.readCommunity || '',
    'snmp.write_community': deviceData.writeCommunity || '',
    'snmp.sec_level': deviceData.secLevel || '',
    'snmp.sec_name': deviceData.secName || '',
    'snmp.priv_proto': deviceData.privProto || '',
    'snmp.priv_pass': deviceData.privPass || '',
    'snmp.auth_proto': deviceData.authProto || '',
    'snmp.auth_pass': deviceData.authPass || '',
  };
  test('snmp', p);
};

const testSsh = () => {
  const p = {
    'ssh.address': deviceData.address,
    'ssh.port': deviceData.sshPort || 22,
    'ssh.user_name': deviceData.sshUser || '',
    'ssh.user_password': deviceData.sshPassword || '',
    'ssh.enable_command': deviceData.sshEnableCommand || '',
    'ssh.enable_password': deviceData.sshEnablePassword || '',
    'ssh.private_key': deviceData.sshPrivateKey || '',
    'ssh.use_external_ssh': deviceData.useExternalSSH === 'on',
  };
  test('ssh', p);
};

const testTelnet = () => {
  const p = {
    'telnet.address': deviceData.address,
    'telnet.port': deviceData.telnetPort || 23,
    'telnet.user_name': deviceData.telnetUser || '',
    'telnet.user_password': deviceData.telnetPassword || '',
    'telnet.enable_command': deviceData.telnetEnableCommand || '',
    'telnet.enable_password': deviceData.telnetEnablePassword || '',
  };
  test('telnet', p);
};

const test = (t: any, d: any) => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      testParam(t, d).then((response) => {
        loading.value = false;
        if (response.error) {
          alert(JSON.stringify(response.error));
        } else if (response.value && response.value.result === 1) {
          alert(JSON.stringify(response.value.messages));
        } else {
          alert('测试成功！');
        }
      }, (response) => {
        loading.value = false;
      });
    }
  });
};

defineExpose({ showDevice });
</script>
