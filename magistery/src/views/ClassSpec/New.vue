<template>
  <layout ref="newForm" form-title="新建类型" :fit="false">
    <el-form
      ref="newForm"
      :model="formData"
      label-width="120px"
      style="max-width: 100%;"
    >
      <el-space direction="vertical" fill style="width: 100%;">
        <el-card>
          <template #header>
            <div class="el-card-header">
              <span>基本属性</span>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                prop="name"
                label="名称"
              >
                <el-input v-model="formData.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="label"
                label="标签"
              >
                <el-input v-model="formData.description" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="父类型">
                <el-tree-select placeholder="无" clearable style="width:100%;" v-model="formData.parentId" :data="typesData" check-strictly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="description"
                label="备注"
              >
                <el-input v-model="formData.description" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <template #header>
            <div class="el-card-header">
              <span>自定义字段</span>
            </div>
          </template>
          <el-button size="small" icon="Plus" @click="addField()">添加</el-button>
        </el-card>
        <el-card>
          <template #header>
            <div class="el-card-header">
              <span>实例显示布局</span>
            </div>
          </template>
          <el-form-item label="表单布局">
            <el-button size="small" icon="Plus">添加</el-button>
          </el-form-item>
          <el-form-item label="列表布局">
            <el-button size="small" icon="Plus" @click="$router.push('/list_layouts/new')">添加</el-button>
          </el-form-item>
        </el-card>
        <el-card>
          <el-button type="primary" @click="submitForm(newForm)">确定</el-button>
          <el-button >取消</el-button>
        </el-card>
      </el-space>
    </el-form>
    <field-spec-set ref="fieldSet"></field-spec-set>
  </layout>
</template>

<script lang="ts" setup>
import Layout from '@/components/Layout/Form.vue';
import FieldSpecSet from '@/components/FieldSpecSet/index.vue';
import { defineProps, reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';

const fieldSet = ref(null);
const listDesigner = ref(null);
const newForm = ref<FormInstance>();

const formData = reactive({
  name: '',
  description: '',
  parentId: '',
});

const typesData = [
  {
    value: '1',
    label: '网络设备',
    children: [
      {
        value: '1-1',
        label: '交换机',
      },
      {
        value: '1-2',
        label: '路由器',
      },
    ],
  },
  {
    value: '2',
    label: '服务器',
    children: [
      {
        value: '2-1',
        label: '刀片服务器',
      },
      {
        value: '2-2',
        label: '塔式服务器',
      },
    ],
  },
  {
    value: '3',
    label: '设备耗材',
  },
];

const addField = () => {
  fieldSet.value.show();
};

const submitForm = async(formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
    } else {
      console.log('error submit!', fields);
    }
  });
};

</script>
