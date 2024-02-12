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
                prop="description"
                label="备注"
              >
                <el-input type="textarea" v-model="formData.description" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <template #header>
            <div class="el-card-header">
              <span>字段</span>
              <el-button type="primary" class="button" @click="addField()">添加字段</el-button>
            </div>
          </template>
          <el-space size="large" style="width: 100%;" wrap>
            <el-tag type="info" style="width: 300px;">名称</el-tag>
            <el-tag type="info" style="width: 300px;">描述</el-tag>
            <el-tag type="info" style="width: 300px;">厂商</el-tag>
            <el-tag type="info" style="width: 300px;">型号</el-tag>
            <el-tag type="info" style="width: 300px;">采购价格</el-tag>
            <el-tag type="info" style="width: 300px;">采购日期</el-tag>
          </el-space>
        </el-card>
        <el-card>
          <template #header>
            <div class="el-card-header">
              <span>显示组件</span>
              <span>
                <el-button type="primary" class="button" @click="addModal()">添加模态框</el-button>
                <el-button type="primary" class="button" @click="addPropertyPage()">添加属性页</el-button>
                <el-button type="primary" class="button" @click="addListPage()">添加列表页</el-button>
              </span>
            </div>
          </template>
          <el-table :data="components">
            <el-table-column prop="label" label="名称"></el-table-column>
            <el-table-column prop="type" label="类型">
              <template #default="scope">
                <span v-if="scope.row.type === 'list'">列表页</span>
                <span v-if="scope.row.type === 'property'">属性页</span>
                <span v-if="scope.row.type === 'modal'">模态框</span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="备注"></el-table-column>
            <el-table-column label="操作">
              <template #default>
                <el-button type="info" icon="edit" size="small">编辑</el-button>
                <el-button type="danger" icon="edit" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
import { useRouter } from 'vue-router';
import Layout from '@/components/Layout/Form.vue';
import FieldSpecSet from '@/components/FieldSpecSet/index.vue';
import { defineProps, reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';

const router = useRouter();

const comSelection = ref('2');
const comSelectDialogVisible = ref(false);
const fieldSet = ref(null);
const listDesigner = ref(null);
const newForm = ref<FormInstance>();

const components = reactive([
  { label: '列表', type: 'list', description: '定义列表页面' },
  { label: '新建', type: 'property', description: '定义新建页面' },
  { label: '编辑', type: 'property', description: '定义编辑页面' },
]);

const formData = reactive({
  name: '',
  description: '',
  parentId: '',
});

const addField = () => {
  fieldSet.value.show();
};

const addListPage = () => {
  router.push('/list_page_layouts/new');
};

const addPropertyPage = () => {
  router.push('/property_page_layouts/new');
};

const addModal = () => {
  console.log('modal');
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
