<template>
  <el-dialog
    width="80%"
    title="自定义字段"
    draggable
    v-model="fieldDialogVisible">
    <el-form ref="fieldForm" :model="fieldData" label-width="150px">
      <el-tabs type="border-card">
        <el-tab-pane label="字段属性">
          <el-row>
            <el-col :span="11">
              <el-form-item label="标签" prop="label" :rules="[{ required: true, message: '不能为空'}]">
                <el-input v-model="fieldData.label" placeholder="请输入标签"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="唯一名称" prop="name" :rules="[{ required: true, message: '不能为空'}]">
                <el-input v-model="fieldData.name" placeholder="请输入名称">
                  <el-button slot="append" icon="el-icon-place" @click="generateName">生成唯一标识</el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="数据类型" prop="type">
                <el-select style="width:100%;" v-model="fieldData.type">
                  <el-option value="string" label="字符型"></el-option>
                  <el-option value="integer" label="整型"></el-option>
                  <el-option value="float" label="浮点型"></el-option>
                  <el-option value="ipaddress" label="IP地址"></el-option>
                  <el-option value="email" label="Email"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="缺省值" prop="template">
                <el-input v-model="fieldData.template" placeholder="请输入缺省值，也可以输入模板字符串">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="fieldData.type === 'string'">
            <el-col :span="11">
              <el-form-item label="最小长度" prop="restrictions.minLength">
                <el-input v-model="fieldData.restrictions.minLength" placeholder="输入最少字符限制，为空表示无限制"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="最大长度" prop="restrictions.maxLength">
                <el-input v-model="fieldData.restrictions.maxLength" placeholder="输入最多字符限制，为空表示无限制"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="fieldData.type === 'string'">
            <el-col :span="11">
              <el-form-item label="匹配模式" prop="restrictions.pattern">
                <el-input v-model="fieldData.restrictions.pattern" placeholder="正则表达式，为空表示无需匹配任何特定模式"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="fieldData.type === 'integer'">
            <el-col :span="11">
              <el-form-item label="最小值" prop="restrictions.minValue">
                <el-input v-model="fieldData.restrictions.minValue" placeholder="输入最小数值限制，为空表示无限制"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="最大值" prop="restrictions.maxValue">
                <el-input v-model="fieldData.restrictions.maxValue" placeholder="输入最小数值限制，为空表示无限制"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="其它约束">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="值唯一" key="isUniquely"></el-checkbox>
                  <el-checkbox label="不能为空" key="isRequired"></el-checkbox>
                  <el-checkbox label="不可修改" key="isReadonly"></el-checkbox>
                  <el-checkbox label="新建时不可见" key="isHiddenOnNew"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="fieldData.type === 'string' || fieldData.type === 'integer'">
            <el-col :span="22">
              <el-form-item label="枚举值">
                <div>
                  <el-radio-group v-model="fieldData.enumType">
                    <el-radio :label="1">无</el-radio>
                    <el-radio :label="2">自定义</el-radio>
                    <el-radio :label="3">系统属性</el-radio>
                    <el-radio :label="4">系统数据库</el-radio>
                    <el-radio :label="5">外部数据库</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="">
                <div v-if="fieldData.enumType === 2" style="width: 100%;">
                  <el-table
                    border>
                    <el-table-column label="标签">
                      <template #default>
                        <el-input></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="值">
                      <template #default>
                        <el-input></el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button type="primary" icon="el-icon-plus" size="small">添加</el-button>
                </div>
                <div v-if="fieldData.enumType === 3" style="width: 100%;">
                  <el-select style="width:100%">
                    <el-option label="用户" value="1"></el-option>
                    <el-option label="部门"  value="2"></el-option>
                    <el-option label="厂商"  value="3"></el-option>
                  </el-select>
                </div>
                <div v-if="fieldData.enumType === 4" style="width:100%">
                  <el-input type="textarea" placeholder="请输入查询的sql语句" rows="5">

                  </el-input>
                  <el-button type="primary" icon="el-icon-plus" size="small">测试</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="输入域(缺省)">
          <el-row>
            <el-col :span="11">
              <el-form-item label="输入组件" prop="inputType">
                <el-select v-model="fieldData.inputType"  style="width:100%;">
                  <el-option value="auto" label="系统自动决定"></el-option>
                  <el-option value="textfield" label="文本框"></el-option>
                  <el-option value="textarea" label="文本域"></el-option>
                  <el-option value="number" label="数字输入框"></el-option>
                  <el-option value="select" label="下拉选择框"></el-option>
                  <el-option value="selectboxes" label="复合选择框"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="fieldData.inputType === 'select'">
              <el-form-item label="支持手动输入" prop="helptext">
                <el-checkbox ></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="占位符" prop="placeholder">
                <el-input v-model="fieldData.placeholder" placeholder="输入域值为空时的显示值"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="帮助说明" prop="helptext">
                <el-input v-model="fieldData.helptext" placeholder="输入域值为空时的显示值"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary">确定</el-button>
        <el-button @click="fieldDialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineExpose, reactive, ref } from 'vue';

const fieldDialogVisible = ref(false);
const checkList = reactive([]);
const fieldData = reactive({ type: 'string', inputType: 'auto', enumType: 1, restrictions: {}});

const hide = () => {
  fieldDialogVisible.value = false;
};

const show = () => {
  fieldDialogVisible.value = true;
};

defineExpose({ show, hide });
</script>
