<template lang="">
    <div class="padding-sm">
        <div class="head-container">
        <div class="head-side">
          <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option> 
  </el-select>
  <el-button slot="append" type="primary" size="small" class="graph-btn" @click="gotoGraph">查看曲线图</el-button>
        </div>


            <el-form :inline="true">
        <el-form-item>
        <el-input  placeholder="请输入业务名称"></el-input>
        </el-form-item>
        <el-form-item>
        <el-input  placeholder="填写IP地址"></el-input>
        </el-form-item>
        <el-form-item>
        <!-- <el-input  placeholder="告警时间"><el-button slot="append" icon="el-icon-search"></el-button></el-input> -->
        <el-date-picker  placeholder="告警时间" type="datetime" :picker-options="pickerOptions"></el-date-picker> 
        <el-button type="info" plain icon="el-icon-search"></el-button>
      </el-form-item>
       </el-form>
        </div>
        <div class="table-container">
            <el-table
      :data="permissionList"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="序号"
        >
      </el-table-column>
      <el-table-column
        prop="name"
        label="操作员"
        >
      </el-table-column>
      <el-table-column
        prop="address"
        label="IP地址">
      </el-table-column>
      <el-table-column
        prop="date"
        label="问题类型"
        >
      </el-table-column>
      <el-table-column
        prop="address"
        label="告警时间">
      </el-table-column>
    </el-table>
        </div>
        <div>
            <el-pagination
            @size-change="handleSizeChange"
            :total="3"
            layout="total, prev, pager, next, jumper"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script>
//for 权限管理
export default {
  name: "AbnormalLoginAlarm",
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
      ],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  methods: {
    handleEditPermissions(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      console.log(`当前页: ${val}`);
    },
    gotoGraph(){
      this.$router.push('/alarm-graph')
    }
  },
}
</script>
<style scoped>
.head-container {
  /* padding-top: 22px; */
  display: flex;
  justify-content: space-between;
}

.graph-btn {
  margin-left: 5px;
}

.padding-sm {
  padding: 20px;
}
</style>