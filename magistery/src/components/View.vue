<template>
  <layout ref="layout" list-title="服务器信息" :stat-visible="checkStat" >
    <template v-slot:header>
      <el-button size="small" type="primary" icon="plus">添加</el-button>
      <el-button size="small" type="success" icon="edit">编辑</el-button>
      <el-button size="small" type="danger" icon="delete">删除</el-button>

  &nbsp;&nbsp;&nbsp; <el-checkbox v-model="checkStat" style="margin-right: 25px;" label="统计" size="small" border></el-checkbox>

      <el-button :title="queryBySimple ? '切换为高级查询' : '切换为快速查询'" class="query-switch" icon="sort" size="small" @click="queryBySimple=!queryBySimple"></el-button>

      <el-input v-if="queryBySimple" placeholder="名称或IP" class="input-with-select" size="small" style="width:250px;margin-right: 0;">
        <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
      </el-input>

      <div v-if="!queryBySimple" class="select-with-button" style="display: inline-table;">
        <el-select slot="prepend" placeholder="请选择查询方式" style="width: 192px;" size="small">
          <el-option label="所有windows" value="1"></el-option>
          <el-option label="所有linux" value="2"></el-option>
          <el-option label="所有.1网段的主机" value="3"></el-option>
        </el-select>
        <el-button icon="setting" size="small" @click="showAdvanceSearch()" style="background-color: #f5f7fa;padding-left: 22px;padding-right: 22px;"></el-button>
      </div>
    </template>
    <template v-slot:stat>
      <el-row style="margin-left:-5px;margin-right:-5px;">
        <el-col :span="8" style="margin-bottom: 10px; height:115px;padding: 5px 10px;">
          <div class="widget style1 lazur-bg" style="background-color: #00AA00; height:100%;padding: 5px 10px; border-radius: 5px;">
            <el-row>
              <el-col :span="8">
                <i class="fa fa-smile-o fa-5x"></i>
              </el-col>
              <el-col :span="16">
                <span> 运行状况正常的对象 </span>
                <h2 style='cursor:pointer;' class="font-bold">1</h2>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8" style="margin-bottom: 10px; height:115px;padding: 5px 10px;">
          <div class="widget style1 red-bg" style=" height:100%;padding: 5px 10px; border-radius: 5px;">
            <el-row>
              <el-col :span="8">
                <i class="fa fa-bell-o fa-5x"></i>
              </el-col>
              <el-col :span="16">
                <span> 有未处理完告警的对象 </span>
                <h2 style='cursor:pointer;' class="font-bold">4</h2>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8" style="margin-bottom: 10px; height:115px;padding: 5px 10px;">
          <div class="widget style1 blue-bg" style="background-color: #d3d3d3; height:100%;padding: 5px 10px; border-radius: 5px;">
            <el-row>
              <el-col :span="8">
                <i class="fa fa-frown-o fa-5x"></i>
              </el-col>
              <el-col :span="16">
                <span> 失联的对象 </span>
                <h2 style='cursor:pointer;' class="font-bold">0</h2>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </template>
    <template v-slot:grid>
      <el-table
        border
        :data="[{name:'11',address:'192.1.1.1',run_state:'ok', cpu:'30', mem:'70'}]"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="address"
          label="IP地址">
        </el-table-column>
        <el-table-column
          prop="run_state"
          label="运行状态">
        </el-table-column>
        <el-table-column
          prop="cpu"
          label="平均CPU利用率">
        </el-table-column>
        <el-table-column
          prop="mem"
          label="平均内存利用率">
        </el-table-column>
      </el-table>
    </template>
  </layout>
</template>

<script lang="ts" setup>
import Layout from './Layout/List.vue';

const queryBySimple = true;
const checkStat = false;
const checkSearch = false;

const showAdvanceSearch = () => {
  this.$refs.layout.advanceVisible = true;
};
</script>
