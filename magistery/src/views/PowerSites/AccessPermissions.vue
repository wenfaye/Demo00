<template>
  <layout ref="layout" list-title="厂站访问权限设置" :stat-visible="false" >
    <template #list>
      <el-table
        border
        :data="gridData"
        style="width: 100%">
        <el-table-column
          key="area"
          prop="area"
          label="厂站所在区域"
        >
        </el-table-column>
        <el-table-column
          key="ip"
          prop="ip"
          label="可访问网段"
        >
          <template #default="scope">
            <pre style="text-decoration: underline;color: blue;" @click="editIp(scope.row)">{{scope.row.ip ? scope.row.ip : "（无）"}}</pre>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        width="40%"
        title="网段设置"
        top="5vh"
        v-model="ipDialogVisible"
        :close-on-click-modal="false"
        append-to-body>
        <el-form ref="fieldsForm" label-width="150px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="网段">
                <el-input :rows="4" type="textarea" v-model="ipRange"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button type="primary" @click="saveIp()">确定</el-button>
          <el-button @click="ipDialogVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </template>
  </layout>
</template>

<script  lang="ts" setup>
import Layout from '@/components/Layout/List.vue';
import { anhuiStore } from '@/store/anhui';
import { onMounted, ref, reactive } from 'vue';

import { fetchPermissions, updatePermissions } from '@/api/permissions';

const gridData = ref([]);
const editingRow = ref(null);
const ipDialogVisible = ref(false);
const ipRange = ref('');

onMounted(() => {
  anhuiStore.init().then(() => {
    fetchPermissions().then((perms) => {
      const permMap = {};
      if (perms) {
        for (const perm of perms) {
          permMap[perm.name] = perm.ip_list;
        }
      }

      const d = [{ area: '所有区域', ip: permMap['所有区域'] ? permMap['所有区域'].join('\n') : '' }];
      for (const area of anhuiStore.Areas) {
        d.push({ area: area.value, ip: permMap[area.value] ? permMap[area.value].join('\n') : '' });
      }

      gridData.value = d;
    });
  });
});

const editIp = (row) => {
  ipRange.value = row.ip;
  editingRow.value = row;
  ipDialogVisible.value = true;
};

const saveIp = () => {
  editingRow.value.ip = ipRange.value;

  const permData = [];
  for (const d of gridData.value) {
    permData.push({ name: d.area, ip_list: d.ip ? d.ip.split('\n') : [] });
  }

  updatePermissions(permData).then(() => {
    ipDialogVisible.value = false;
  });
};
</script>
