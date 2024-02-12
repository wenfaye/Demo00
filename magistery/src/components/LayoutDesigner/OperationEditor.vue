<template>
  <el-dialog
    width="60%"
    title="操作"
    draggable
    v-model="dialogVisible">
    <el-form ref="operationForm" :model="operationData" label-width="100px">
      <!--<el-row :gutter="20">-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="来源">-->
            <!--<el-select v-model="source" style="width: 100%;">-->
              <!--<el-option label="内建" value="builtin"></el-option>-->
              <!--<el-option label="自定义" value="custom"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <el-row v-if="source === 'custom'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="标签">
            <el-input v-model="operationData.label"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图标">
            <el-select v-model="operationData.icon" style="width:100%;">
              <el-option value="plus"><el-icon style="vertical-align: middle;margin-right: 10px;"><Plus /></el-icon>plus</el-option>
              <el-option value="edit"><el-icon style="vertical-align: middle;margin-right: 10px;"><Edit /></el-icon>edit</el-option>
              <el-option value="delete"><el-icon style="vertical-align: middle;margin-right: 10px;"><Delete /></el-icon>delete</el-option>
              <el-option value="setting"><el-icon style="vertical-align: middle;margin-right: 10px;"><Setting /></el-icon>setting</el-option>
              <el-option value="upload"><el-icon style="vertical-align: middle;margin-right: 10px;"><Upload /></el-icon>upload</el-option>
              <el-option value="download"><el-icon style="vertical-align: middle;margin-right: 10px;"><Download /></el-icon>download</el-option>
              <el-option value="search"><el-icon style="vertical-align: middle;margin-right: 10px;"><Search /></el-icon>search</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="source === 'custom'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="主题">
            <el-select v-model="operationData.btn_type" style="width: 100%;">
              <el-option label="默认" value=""></el-option>
              <el-option label="首要" value="primary"></el-option>
              <el-option label="成功" value="success"></el-option>
              <el-option label="信息" value="info"></el-option>
              <el-option label="警告" value="waining"></el-option>
              <el-option label="危险" value="danger"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="示例">
            <el-button :type="operationData.btn_type" :icon="operationData.icon">{{operationData.label}}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="source === 'custom'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="行为">
            <el-select style="width:100%;" v-model="operationData.action">
              <el-option value="jump_to_page" label="跳转至页面"></el-option>
              <el-option value="jump_to_url" label="跳转至url"></el-option>
              <el-option value="open_modal" label="打开模态框"></el-option>
              <el-option value="access_remote" label="访问远程操作"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="operationData.action === 'jump_to_page'" label="页面">
            <el-select style="width:100%;" v-model="operationData.page">
              <el-option label="添加"></el-option>
              <el-option label="编辑"></el-option>
              <el-option label="列表"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="operationData.action === 'open_modal'" label="模态框">
            <el-select style="width:100%;" v-model="operationData.page">
              <el-option label="分派"></el-option>
              <el-option label="批注"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="operationData.action === 'jump_to_url' || operationData.action === 'access_remote'" label="Url">
            <el-input></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="source === 'custom'" :gutter="20">
        <el-col :span="12">
          <el-form-item v-if="operationData.action === 'jump_to_page' || operationData.action === 'jump_to_url'" label="新窗口显示">
            <el-checkbox></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>
      <el-row v-if="source === 'builtin'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="类型">
            <el-select v-model="operationData.type" style="width: 100%;">
              <el-option label="添加" value="add"></el-option>
              <el-option label="编辑" value="edit"></el-option>
              <el-option label="删除" value="delete"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="跳转页">
            <el-select v-model="operationData.type" style="width: 100%;">
              <el-option label="添加" value="add"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="source === 'builtin'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="示例">
            <el-button type="primary" v-if="operationData.type === 'add'" icon="plus">添加</el-button>
            <el-button type="info" v-if="operationData.type === 'edit'" icon="plus">编辑</el-button>
            <el-button type="danger" v-if="operationData.type === 'delete'" icon="plus">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineExpose, defineProps, ref, reactive } from 'vue';

defineProps({
  operation: {
    default: {},
  },
});

const source = ref('custom');

const operationData = reactive({ label: '', btn_type: '', type: 'add', action: 'jump_to_page' });

const dialogVisible = ref(false);
const hide = () => {
  dialogVisible.value = false;
};

const show = () => {
  dialogVisible.value = true;
};

defineExpose({ show, hide });
</script>
