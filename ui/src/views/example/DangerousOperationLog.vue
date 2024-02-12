<template lang="">
    <div class="padding-sm">
        <div class="head-container">
          <div></div>
            <el-form :inline="true">
        <el-form-item>
        <el-input  placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
        <el-input  placeholder="填写IP地址"></el-input>
        </el-form-item>
        <el-form-item>
        <el-date-picker placeholder="请输入时间" type="datetime" :picker-options="pickerOptions"></el-date-picker>
        <el-button type="info" plain icon="el-icon-search"></el-button>
        <!-- <el-input  placeholder="请输入时间"><el-button slot="append" icon="el-icon-search"></el-button></el-input> -->
        </el-form-item>
       </el-form>
        </div>

        <div class="table-container">
            <el-table
      :data="permissionList"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="name"
        label="操作类型">
      </el-table-column>
      <el-table-column
        prop="address"
        label="内容">
      </el-table-column>
      <el-table-column
        prop="date"
        label="IP地址">
      </el-table-column>
      <el-table-column
        prop="address"
        label="时间">
      </el-table-column>
    </el-table>
        </div>
        <div>
            <el-pagination
            @size-change="handleSizeChange"
            layout="total, prev, pager, next, jumper"
            :total="3">
            </el-pagination>
        </div>
    </div>
</template>
<script>
//for 权限管理
export default {
    name: "DangerousOperationLog",
    data() {
        return {
            permissionList: [
            {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
            {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
            {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }
            ]
        }
    },
    methods: {
        handleEditPermissions(row) {
        console.log(row);
      },
      handleSizeChange(val) {
        console.log(`当前页: ${val}`);
      }
    },
}
</script>
<style>
.head-container {
    /* padding-top: 22px; */
    display: flex;
    justify-content: space-between;
}

.padding-sm {
    padding: 20px;
}
</style>