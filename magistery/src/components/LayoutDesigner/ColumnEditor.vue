<template>
  <el-dialog
    width="60%"
    title="列属性"
    draggable
    v-model="dialogVisible">
    <el-form ref="columnForm" :model="columnData" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="标签">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据映射">
            <el-input></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="宽度">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最小宽度">
            <el-input></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="对齐方式">
            <el-select style="width: 100%;">
              <el-option label="左对齐" :value="left"></el-option>
              <el-option label="右对齐" :value="right"></el-option>
              <el-option label="居中" :value="center"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序">
            <el-radio-group v-model="columnData.sortable">
              <el-radio :label="true">支持</el-radio>
              <el-radio :label="false">不支持</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="格式化">
            <el-select v-model="columnData.formatter" style="width: 100%;">
              <el-option label="无" value=""></el-option>
              <el-option label="日期" value="date"></el-option>
              <el-option label="时间" value="time"></el-option>
              <el-option label="百分比" value="percentage"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, defineExpose } from 'vue';

defineProps({
  column: {
    default: {},
  },
});

const columnData = reactive({ sortable: false, align: 'right', formatter: '' });

const dialogVisible = ref(false);

const hide = () => {
  dialogVisible.value = false;
};

const show = () => {
  dialogVisible.value = true;
};

defineExpose({ show, hide });
</script>
