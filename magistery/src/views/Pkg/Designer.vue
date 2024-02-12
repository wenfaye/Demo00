<template>
  <layout ref="layout" list-title="设备面板视图设计" :fit="false">
    <template #list>
      <el-row :gutter="20" style="height: 100%;">
        <el-col :span="4" style="height: 100%;border-right: solid 1px silver;">
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" :default-expanded-keys="[1]">
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span v-if="!(data.children && data.children.length)" style="position: relative;top: 3px;margin-left: 4px; color: blue;">
                  <el-icon :size="14" @click="addElement(node, data)" circle style=" border: solid 1px silver;">
                    <Plus />
                  </el-icon>
                </span>
              </span>
            </template>
          </el-tree>
        </el-col>
        <el-col :span="14" style="height: 100%;">
        </el-col>
        <el-col :span="6" style="height: 100%;border-left: solid 1px silver;">
          <el-form ref="nodeForm" :model="formData" label-width="120px" label-position="top">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item
                  label="图片Url"
                  prop="image_url"
                  :rules="[ { required: true, message: '图片Url不能为空' }, ]">
                  <el-input v-model="formData.image_url" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="X坐标"
                  prop="x"
                  :rules="[ { required: true, message: 'X坐标不能为空' }, ]">
                  <el-input v-model="formData.x" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="Y坐标"
                  prop="y"
                  :rules="[ { required: true, message: 'Y坐标不能为空' }, ]">
                  <el-input v-model="formData.y" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="宽度"
                  prop="width"
                  :rules="[ { required: true, message: '宽度不能为空' }, ]">
                  <el-input v-model="formData.width" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="高度"
                  prop="height"
                  :rules="[ { required: true, message: '高度不能为空' }, ]">
                  <el-input v-model="formData.height" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>

    </template>
  </layout>
</template>

<script lang="ts" setup>
import Layout from '@/components/Layout/List.vue';
import { onMounted, ref, reactive } from 'vue';
import type Node from 'element-plus/es/components/tree/src/model/node';
import {
  Plus,
} from '@element-plus/icons-vue';
interface Tree {
  label: string
  children?: Tree[]
}

const defaultProps = {
  children: 'children',
  label: 'label',
};

const data: Tree[] = [
  {
    id: 1,
    label: '设备',
    children: [
      {
        label: '端口',
        children: [
          {
            type: 'interface',
            label: 'GigabitEthernet1/0/1',
          },
          {
            type: 'interface',
            label: 'GigabitEthernet1/0/2',
          },
          {
            type: 'interface',
            label: 'GigabitEthernet1/0/3',
          },
          {
            type: 'interface',
            label: 'GigabitEthernet1/0/4',
          },
          {
            type: 'interface',
            label: 'GigabitEthernet1/0/5',
          },
          {
            type: 'interface',
            label: 'GigabitEthernet1/0/6',
          },
        ],
      },
      {
        label: '电源',
        children: [
          {
            type: 'power',
            label: 'PowerSupply1',
          },
          {
            type: 'power',
            label: 'PowerSupply2',
          },
          {
            type: 'power',
            label: 'PowerSupply3',
          },
        ],
      },
      {
        label: '模块',
        children: [
          {
            type: 'module',
            label: 'Module1',
          },
          {
            type: 'module',
            label: 'Module2',
          },
          {
            type: 'module',
            label: 'Module3',
          },
          {
            type: 'module',
            label: 'Module4',
          },
        ],
      },
    ],
  },
];
const formData = reactive({ image_url: '', x: 0, y: 0 });

const addElement = (node: any, data: any) => {
};

const handleNodeClick = (data: Tree) => {
  // if select module
  // if select port
  // if select power supply
  if (data.type === 'interface') {
    console.log(data);
  } else if (data.type === 'power') {
    console.log(data);
  } else if (data.type === 'module') {
    console.log(data);
  }
  console.log(data);
};
</script>
