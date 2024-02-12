<template lang="">
    <div class="padding-sm">
        <div class="head-container">
            <el-form :inline="true">
        <el-form-item>
        <el-input  placeholder="填写用户姓名"></el-input>
        </el-form-item>
        <el-form-item>
        <el-input  placeholder="填写IP地址"></el-input>
        </el-form-item>
        <el-form-item>
        <el-input  placeholder="填写当前状态"></el-input>
        </el-form-item>
        <el-form-item>
        <el-input  placeholder="填写用户等级"><el-button slot="append" icon="el-icon-search"></el-button></el-input>        
        </el-form-item>
       </el-form>
        </div>
        <div class="table-container">
            <el-table
      :data="permissionList"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="用户姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="描述"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="用户等级">
      </el-table-column>
      <el-table-column
        prop="date"
        label="IP地址"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="操作"
        width="180">
        <template slot-scope="scope">
        <el-button @click="handleEditPermissions(scope.row)" type="text" size="small">编辑权限</el-button>
      </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="状态">
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
    name: "PermissionManagement",
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
        // console.log(row);
        this.$router.push({
					path:`/edit-prmissions/${row.name}`
					// params:{id:row.name},
				})
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
    justify-content: end;
}

.padding-sm {
    padding: 20px;
}
</style>