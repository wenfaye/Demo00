<template>
  <el-dialog
    width="50%"
    v-model="importDialogVisible"
    :title="dialogTitle">
    <el-row>
      <el-col :span="24">
        <el-upload
          ref="upload"
          class="upload-demo"
          :action="uploadUrl"
          :limit="1"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
          :auto-upload="false"
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
          <el-button class="ml-3" type="success" @click="submitUpload" style="margin-left: 10px;margin-top: -3px;">
            上传
          </el-button>
          <!--<template #tip>-->
            <!--<div class="el-upload__tip text-red">-->
              <!--只能上传一个文件，格式为.xlsx或.xls-->
            <!--</div>-->
          <!--</template>-->
        </el-upload>
      </el-col>
    </el-row>
    <div class="hr-line-dashed"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button key="btnCancel" type="primary" @click="importDialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineExpose, defineEmits, reactive, ref } from 'vue';
import { genFileId } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';

defineProps({
  uploadUrl: {
    default: '',
  },
  dialogTitle: {
    default: '',
  },
});

const emit = defineEmits(['upload-success']);

const importDialogVisible = ref(false);
const upload = ref<UploadInstance>();

const show = () => {
  importDialogVisible.value = true;
};

const hide = () => {
  importDialogVisible.value = false;
};

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const handleSuccess = () => {
  emit('upload-success');
};

const submitUpload = () => {
  upload.value!.submit();
};

defineExpose({ show, hide });
</script>
