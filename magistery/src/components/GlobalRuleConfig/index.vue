<template>
  <el-dialog v-model="dialogVisible" title="全局设置">
    <el-form v-loading="loading" ref="formRef" :rules="rules" :model="globalRuleConfigData" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="重试次数"
            prop="retries">
            <el-input-number v-model="globalRuleConfigData.retries" /> 次
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="超时时长"
            prop="timeout">
            <el-input-number v-model="globalRuleConfigData.timeout" /> 秒
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="发包间隔"
            prop="send_interval">
            <el-input-number v-model="globalRuleConfigData.send_interval" /> 秒
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="帧长"
            prop="icmp_packet_size">
            <el-input-number v-model="globalRuleConfigData.icmp_packet_size" /> 字节
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="TTL"
            prop="icmp_ttl">
            <el-input-number v-model="globalRuleConfigData.icmp_ttl" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="snmp读共同体名"
            prop="snmp_params">
            <div class="address_scope">
              <el-col :span="22">
                <div class="all-label">
                  <el-tag
                    v-for="(itm, index) in globalRuleConfigData.snmp_params"
                    :key="index"
                    closable
                    @close="handleCloseTag(index)"
                  >
                    {{ itm.read_community }}
                  </el-tag>
                </div>
              </el-col>
              <el-col class="line" :span="2">
                <el-button class="button-new-tag" size="small" @click="openSnmpDialog">
                  <el-icon><plus /></el-icon>
                </el-button>
              </el-col>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="需扫描端口"
            prop="ports">
            <div class="address_scope">
              <el-col :span="22">
                <div class="all-label">
                  <el-tag
                    v-for="(port, index) in globalRuleConfigData.ports"
                    :key="index"
                    closable
                    @close="handleClosePort(index)"
                  >
                    {{ port }}
                  </el-tag>
                </div>
              </el-col>
              <el-col class="line" :span="2">
                <el-button class="button-new-tag" size="small" @click="openPortDialog">
                  <el-icon><plus /></el-icon>
                </el-button>
              </el-col>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" offset="2">
          <el-form-item
            label=""
            prop="no_skip_tcp_if_icmp_timeout">
            <el-checkbox v-model="globalRuleConfigData.no_skip_tcp_if_icmp_timeout" label="不管能不能 ping 通都扫描端口" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="发现新增IP通知规则"
            prop="engine_id">
            <el-select multiple v-model="globalRuleConfigData.notifications" placeholder="默认" style="width: 100%;" >
              <el-option v-for="notificaNode in notificaNodes" :value="notificaNode.id" :label="notificaNode.name" :key="notificaNode.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="saveGlobalRuleConfig(formRef)">
          确定
        </el-button>
        <el-button  @click="resetForm(formRef)"> 取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style style lang="scss" scoped>
.address_scope{
  display: flex;
  width: 100%;
  ::v-deep{
    .el-col{
      padding: 0px !important;
    }
    .el-col-2{
      text-align: center;
    }
  }
}
.all-label {
  width: 100%;
  min-height: 60px;
  // border: 1px solid #ccc;
  margin-bottom: 5px;
  padding: 6px;
  border-radius:4px;
  box-shadow: 0 0 0 1px #dcdfe6;
  .el-tag {
    margin: 0 5px 5px 0;
    padding-right: 3px;
  }
}
.el-input-number{
  margin-right: 10px;
}
</style>

<script lang="ts" setup>
import { onMounted, ref, reactive, defineEmits, defineExpose } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getGlobalScanParam, updateGlobalScanParam, notificationsNodes } from '@/api/devices';
import * as _ from 'lodash';

const formRef = ref<FormInstance>();
const globalRuleConfigData = reactive({
  retries: '',
  timeout: '',
  send_interval: '',
  icmp_packet_size: '',
  icmp_ttl: '',
  snmp_params: [],
  ports: [],
  no_skip_tcp_if_icmp_timeout: '',
  notifications: [],
});
const loading = ref(false);
const notificaNodes = ref([]);
const emit = defineEmits(['createdGlobalRuleConfig']);
const dialogVisible = ref(false);

onMounted(() => {
  notificationsNodes().then((response) => {
    notificaNodes.value = response;
  });
});

const rules = reactive<FormRules<any>>({});

const showGlobalRuleConfigDialog = () => {
  dialogVisible.value = true;
  getGlobalScanParam().then((response) => {
    if (response) {
      globalRuleConfigData.retries = response.retries;
      globalRuleConfigData.timeout = response.timeout;
      globalRuleConfigData.send_interval = response.send_interval;
      globalRuleConfigData.icmp_packet_size = response.icmp_packet_size;
      globalRuleConfigData.icmp_ttl = response.icmp_ttl;
      globalRuleConfigData.snmp_params = response.snmp_params ? response.snmp_params : [];
      globalRuleConfigData.ports = response.ports ? response.ports : [];
      globalRuleConfigData.no_skip_tcp_if_icmp_timeout = response.no_skip_tcp_if_icmp_timeout;
      globalRuleConfigData.notifications = response.notifications;
    }
  });
};

const saveGlobalRuleConfig = async(formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const ruleObj = {
        retries: globalRuleConfigData.retries,
        timeout: globalRuleConfigData.timeout,
        send_interval: globalRuleConfigData.send_interval,
        icmp_packet_size: globalRuleConfigData.icmp_packet_size,
        icmp_ttl: globalRuleConfigData.icmp_ttl,
        snmp_params: globalRuleConfigData.snmp_params,
        ports: globalRuleConfigData.ports,
        no_skip_tcp_if_icmp_timeout: globalRuleConfigData.no_skip_tcp_if_icmp_timeout,
        notifications: globalRuleConfigData.notifications,
      };
      loading.value = true;
      updateGlobalScanParam(ruleObj).then((response) => {
        ElMessage({ message: '更新成功', type: 'success' });
        emit('createdGlobalRuleConfig', response);
        dialogVisible.value = false;
        loading.value = false;
      }, (response) => {
        loading.value = false;
      });
    }
  });
};

const openSnmpDialog = () => {
  ElMessageBox.prompt(
    '请输入 SNMP v2 参数',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    },
  )
    .then((data) => {
      globalRuleConfigData.snmp_params.push({
        version: 'v2c',
        read_community: data.value,
      });
      console.log(globalRuleConfigData.snmp_params);
    })
    .catch(() => {
    });
};

const openPortDialog = () => {
  ElMessageBox.prompt(
    '请输入 TCP 端口',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^[0-9]*$/,
      inputErrorMessage: 'TCP 端口必须为数字',
    },
  )
    .then((data) => {
      globalRuleConfigData.ports.push(_.toNumber(data.value));
    })
    .catch(() => {
    });
};

const resetForm = (formEl: FormInstance | undefined) => {
  dialogVisible.value = false;
  if (!formEl) return;
  formEl.resetFields();
};

const handleCloseTag = (index: number) => {
  globalRuleConfigData.snmp_params.splice(index, 1);
};

const handleClosePort = (index: number) => {
  globalRuleConfigData.ports.splice(index, 1);
};

defineExpose({ showGlobalRuleConfigDialog });
</script>

