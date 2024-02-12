<template lang="">
    <div class="padding-sm">
        <div class="head-container">
          <div>
            <el-button @click="handleCreate" type="primary" size="medium">新建</el-button>
          </div>
            <el-form :inline="true">
        <el-form-item>
        <el-input  placeholder="请输入业务名称"></el-input>
        </el-form-item>
        <el-form-item>
        <el-input  placeholder="填写IP地址"></el-input>
        </el-form-item>
        <el-form-item>
        <el-input  placeholder="请输入端口号"><el-button slot="append" icon="el-icon-search"></el-button></el-input>
        
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
        label="业务名称"
        >
      </el-table-column>
      <el-table-column
        prop="address"
        label="IP地址">
      </el-table-column>
      <el-table-column
        prop="date"
        label="端口号"
        >
      </el-table-column>
      <el-table-column
        prop="name"
        label="操作"
        >
        <template slot-scope="scope">
        <el-button  @click="handleDelete(scope.row)" size="mini">删除</el-button>
        <el-button  @click="handleDelete(scope.row)" size="mini" type="primary">启用</el-button>
        <el-button  @click="handleDelete(scope.row)" size="mini" type="danger">禁用</el-button>
      </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="状态">
        <template slot-scope="scope">
        <el-tag size="mini" effect="danger" >已禁用</el-tag>
        <el-tag size="mini" type="success">已启用</el-tag>
      </template>
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
        <el-dialog
          title="请选择IP地址"
          :visible.sync="createDialogVisible"
          width="30%">
          <el-select v-model="ipSelected" filterable placeholder="请选择">
    <el-option
      v-for="item in ipOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="createDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="createDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
//for 编辑权限
export default {
  name: "EditPermissions",
  props: ['id'],
  data() {
    return {
      ipOptions: [{
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
      ipSelected: '',
      createDialogVisible: false,
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
    handleDelete(row) {
      console.log(row);
    },
    handleCreate() {
      this.createDialogVisible = true
    },
    handleSizeChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  mounted() {
    const id = this.$route.params.id;
    console.log(id);
  },
}
</script>
<style>
.head-container {
  /* padding-top: 22px; */
  display: flex;
  justify-content: space-between
}

.padding-sm {
  padding: 20px;
}
</style>