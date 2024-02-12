<template lang="">
    <div class="padding-sm">
        <div class="head-container">
        <div class="head-side">

        </div>


            <el-form :inline="true">
                <el-form-item><el-select v-model="value" placeholder="请选择操作员">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option> 
  </el-select></el-form-item>
                <el-form-item><el-select v-model="value" placeholder="请选择时间">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option> 
  </el-select></el-form-item>
                <el-form-item><el-select v-model="value" placeholder="请选择类型">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option> 
  </el-select></el-form-item>
  <el-button type="info" plain icon="el-icon-search"></el-button>
       </el-form>
        </div>
        <div class="table-container">

        </div>

    </div>
</template>
<script>
//for 权限管理
export default {
  name: "AbnormalLoginAlarm",
  data() {
    return {
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