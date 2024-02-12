<template>
  <el-dialog v-model="dialogVisible" title="地址段设置">
    <el-form v-loading="loading" ref="formRef" :model="ruleConfigData" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="采集引擎"
            prop="engine_id">
            <el-select v-model="ruleConfigData.engine_id" placeholder="默认" style="width: 100%;" >
              <el-option v-for="smpNode in smpNodes" :value="smpNode.id" :label="smpNode.name" :key="smpNode.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="IP地址段">
            <div class="address_scope">
              <el-col :span="11">
                <el-form-item prop="ipStart">
                  <el-input v-model="ruleConfigData.ipStart" style="width: 100%; padding: 0px;"/>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="ipEnd">
                  <el-input v-model="ruleConfigData.ipEnd" style="width: 100%; padding: 0px;" />
                </el-form-item>
              </el-col>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="描述"
            prop="description">
            <el-input v-model="ruleConfigData.description" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="Snmp参数"
            prop="snmp_params">
            <div class="address_scope">
              <el-col :span="22">
                <div class="all-label">
                  <el-tag
                    v-for="(itm, index) in ruleConfigData.snmp_params"
                    :key="index"
                    closable
                    @close="handleCloseTag(itm, index)"
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
            label="结果保留时间"
            prop="retention_time">
            <el-input v-model="ruleConfigData.retention_time">
              <template #append>天</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="扫描周期设置"
            prop="schedule_expression">
            <div class="address_scope">
              <el-col :span="24">
                <div class="all-label">
                  <cron-element-plus
                    v-model="cron"
                    :button-props="{ type: 'primary' }"
                    @error="error=$event"
                    locale="zh"/>
                </div>
              </el-col>
            </div>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="扫描周期设置"
            prop="cron">
            <div class="address_scope">
              <el-col :span="24">
                <div class="all-label">
                  <noVue3Cron
                    :cron-value="cron"
                    @change="changeCron"
                    max-height="400px"
                    i18n="cn"
                  />
                </div>
              </el-col>
            </div>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="扫描周期设置"
            prop="cron">
            <el-input v-model="cron" placeholder="cron表达式..." readonly>
              <template #append>
                <el-popover v-model:visible="cronPopover" width="700px" trigger="manual" placement="top">
                  <noVue3Cron
                    id="cron-vue3"
                    :cron-value="cron"
                    @change="changeCron"
                    @close="cronPopover=false"
                    max-height="300px"
                    i18n="cn"
                  />
                  <template #reference>
                    <el-button @click="cronPopover = !cronPopover">设置</el-button>
                  </template>
                </el-popover>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="saveRuleConfig(formRef)">
          确定
        </el-button>
        <el-button @click="resetForm(formRef)"> 取消</el-button>
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
    #cron-vue3 .language{
      display: none !important;
    }
    #cron-vue3 .bottom value{
      display: none !important;
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
.cron {
  width: 700px;
  margin: 0 auto;
  margin-top: 100px;
  h1 {
    font-size: 50px;
    text-align: center;
  }
}

</style>

<script lang="ts" setup>

import { onMounted, ref, reactive, defineEmits, defineExpose } from 'vue';
import { addScanParams, samplingNodes, getScanParamById, updateScanParamById } from '@/api/devices';
import { ElMessageBox, ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import * as _ from 'lodash';

const formRef = ref<FormInstance>();
const ruleConfigData = reactive({ engine_id: '', description: '', ipStart: '', ipEnd: '', snmp_params: [], retention_time: -1, schedule_expression: '' });
const loading = ref(false);
const smpNodes = ref([]);
const action = ref('new');
const ruleId = ref('');
const error = ref('');
const cron = ref('');
const cronPopover = ref(false);
const emit = defineEmits(['createdRuleConfig']);
const dialogVisible = ref(false);

onMounted(() => {
  samplingNodes().then((response) => {
    smpNodes.value = response;
  });
});
const rules = reactive<FormRules<any>>({
  description: [{
    required: true,
    message: '请输入所属部门',
    trigger: 'blur',
  }],
  retention_time: [{
    required: true,
    message: '请输入保留时间',
    trigger: 'blur',
  }],
  ipStart: [{
    required: true,
    message: '请输入开始地址',
    trigger: 'blur',
  }],
  ipEnd: [{
    required: true,
    message: '请输入结束地址',
    trigger: 'blur',
  }],
});

const showRuleConfigDialog = (typ?: string, res?:any) => {
  if (typ == 'edit') {
    action.value = 'edit';
    ruleId.value = res.id;
    getScanParamById(res.id).then((response) => {
      ruleConfigData.engine_id = response.engine_id || '';
      ruleConfigData.description = response.description;
      ruleConfigData.ipStart = response.address.split('-')[0];
      ruleConfigData.ipEnd = response.address.split('-')[1];
      ruleConfigData.snmp_params = response.snmp_params ? response.snmp_params : [];
      ruleConfigData.retention_time = response.retention_time;
      ruleConfigData.schedule_expression = response.schedule_expression;
      cron.value = ruleConfigData.schedule_expression ? ruleConfigData.schedule_expression : '';
    });
  } else {
    action.value = 'new';
    if (formRef.value) {
      formRef.value.resetFields();
    }
  }
  dialogVisible.value = true;
};

const saveRuleConfig = async(formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const ruleObj = {
        // engine_id: 0,
        description: ruleConfigData.description,
        address: ruleConfigData.ipStart + '-' + ruleConfigData.ipEnd,
        snmp_params: [...ruleConfigData.snmp_params],
        retention_time: _.toNumber(ruleConfigData.retention_time),
        schedule_expression: ruleConfigData.schedule_expression,
      };
      if (!!ruleConfigData.engine_id && ruleConfigData.engine_id != '') {
        try {
          ruleObj.engine_id = parseInt(ruleConfigData.engine_id);
        } catch (e) { /* console.log(e) */ }
      }
      loading.value = true;
      if (action.value == 'new') {
        addScanParams(ruleObj).then((response) => {
          emit('createdRuleConfig', response);
          ElMessage({ message: '创建成功', type: 'success' });
          dialogVisible.value = false;
          loading.value = false;
        }, (response) => {
          loading.value = false;
        });
      } else {
        updateScanParamById(ruleId.value, ruleObj).then((response) => {
          emit('createdRuleConfig', response);
          ElMessage({ message: '更新成功', type: 'success' });
          dialogVisible.value = false;
          loading.value = false;
        }, (response) => {
          loading.value = false;
        });
      }
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  dialogVisible.value = false;
  if (!formEl) return;
  formEl.resetFields();
};

const handleCloseTag = (itm: any, index: number) => {
  // const idex: number = _.findIndex(ruleConfigData.snmp_params, function(o) { return o.read_community == itm.read_community; });
  ruleConfigData.snmp_params.splice(index, 1);
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
      ruleConfigData.snmp_params.push({
        version: 'v2c',
        read_community: data.value,
      });
    })
    .catch(() => {
    });
};

const changeCron = (val: any) => {
  if (typeof (val) !== 'string') return false;
  cron.value = val;
  ruleConfigData.schedule_expression = cron;
};

defineExpose({ showRuleConfigDialog });
</script>

