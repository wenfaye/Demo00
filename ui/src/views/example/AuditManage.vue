<template lang="">
    <div class="padding-sm">
        <div class="head-container">
        <div class="head-side">
        <el-button type="danger" icon="el-icon-link" @click="handleDisconnectSelected">选中的断开</el-button>
        </div>

        <el-form :inline="true" ref="topForm" :model="topForm">
          <el-form-item>
        <el-input  placeholder="输入节点名称"  v-model="topForm.accessPointName"></el-input>
        </el-form-item>
        <el-form-item>
        <el-input  placeholder="输入安全准入装置"  v-model="topForm.auditDeviceName"></el-input>
        </el-form-item>
        <el-form-item>
        <el-input  placeholder="输入调度操作员姓名"  v-model="topForm.personnelName"></el-input>
        </el-form-item>
        <el-form-item>
        <el-input  placeholder="输入审核人员姓名"  v-model="topForm.userName"><el-button slot="append" icon="el-icon-search" @click="handleGetList"></el-button></el-input>        
        </el-form-item>
        </el-form>

        </div>
        <div class="table-container">
            <el-table
      :data="auditList"
      ref="auditTable"
      >
      <el-table-column
      type="selection"
      width="55">
    </el-table-column>
      <el-table-column
        prop="accessPointName"
        label="节点名称"
        >
      </el-table-column>
      <el-table-column
        prop="auditDeviceName"
        label="安全准入装置"
        >
      </el-table-column>
      <el-table-column
        prop="flatName"
        label="平面名称">
      </el-table-column>
      <el-table-column
        prop="flatIp"
        label="平面IP"
        >
      </el-table-column>
      <el-table-column
        prop="personnelName"
        label="调度操作员姓名">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="审核人员姓名">
      </el-table-column>
      <el-table-column
        prop="time"
        label="准入起止时间">
      </el-table-column>
      <el-table-column
        prop="statusStr"
        label="状态">
        <template slot-scope="scope">
        <el-tag size="mini" effect="plain" v-if="!scope.row.status">{{scope.row.statusStr}}</el-tag>
        <el-tag size="mini" type="success" v-if="scope.row.status">{{scope.row.statusStr}}</el-tag>

      </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.status" type="primary" size="mini" @click="handleReview(scope.row)">审核</el-button>
          <el-button v-if="scope.row.status" plain type="primary" size="mini" @click="handleCheck(scope.row)">查看</el-button>
          <el-button v-if="scope.row.status" type="danger" size="mini" @click="handleDisconnect(scope.row)">断开</el-button>
        </template>
      </el-table-column>
    </el-table>
        </div>
        <div>
            <el-pagination
            @size-change="handleSizeChange"
            :total="total"
            layout="total, prev, pager, next, jumper"
            >
            </el-pagination>
        </div>
        <el-dialog
          title="审核"
          :visible.sync="reviewDialogVisible"
          width="1100px">
        <div class="review-container">
          <div class="photo-wrap">
            <img src="/api/file/show_162.png"/>
            <h3>工作照</h3>
          </div>
          <div class="photo-wrap">
            <img src="/api/file/show_162.png"/>
            <h3>申请照</h3>
          </div>
          <div class="flex-sub">
            <el-form :label-position="labelPosition">
              <el-form-item :label-width="formLabelWidth" label="节点名称">{{curRow.accessPointName}}</el-form-item>
              <el-form-item :label-width="formLabelWidth" label="安全准入装置">{{curRow.auditDeviceName}}</el-form-item>
              <el-form-item :label-width="formLabelWidth" label="平面名称">{{curRow.flatName}}</el-form-item>
              <el-form-item :label-width="formLabelWidth" label="平面IP">{{curRow.flatIp}}</el-form-item>
              <el-form-item :label-width="formLabelWidth" label="调度操作员姓名">{{curRow.personnelName}}</el-form-item>
              <el-form-item :label-width="formLabelWidth" label="审核人员姓名">{{curRow.userName}}</el-form-item>
            </el-form>
          </div>
          <div class="admin-operation">
            <h2>审核人员授权操作</h2>
            <el-form :label-position="labelPosition" ref="authorizationForm" :model="authorizationForm" :rules="authorizationRules">
              <el-form-item label-width="90" label="开始时间">
                <el-radio v-if="!curRow.status" v-model="authorizationForm.startType" label="1">即刻开始</el-radio>
                <span v-if="curRow.status">{{reviewInfo.startTime}}</span>
              </el-form-item>
              <el-form-item label-width="90" label="结束时间">
                <el-radio-group v-if="!curRow.status" v-model="authorizationForm.endType" @change="endTimeRadioChange">
                  <el-form-item prop="endTime">
                    <!-- :picker-options="pickerOptions" -->
                    <el-radio label="1">
                      <el-date-picker v-model="authorizationForm.endTime" size="mini" placeholder="选择日期时间" type="datetime"  :disabled="endTimeDisabled.picker" :picker-options="endTimePickerOptions">
                      </el-date-picker></el-radio>
                  </el-form-item>
                  <el-form-item prop="endHours">
                  <el-radio label="2"><el-input v-model="authorizationForm.endHours" type="number" placeholder="授权时长(单位:小时)"  size="mini" min="0" :disabled="endTimeDisabled.duration"></el-input></el-radio>
                </el-form-item>
              </el-radio-group>
              <span v-if="curRow.status">{{reviewInfo.endTime}}</span>
              </el-form-item>
             
            </el-form>
          </div>
        </div>

        <span v-if="!curRow.status" slot="footer" class="dialog-footer">
          <el-button type="danger" @click="handleReject" icon="el-icon-circle-close">拒绝</el-button>
          <el-button type="success" @click="handleResolve" icon="el-icon-circle-check">通过</el-button>
        </span>

        </el-dialog>
    </div>

</template>
<script>
//for 权限管理
import { fetchList, fetchInfo, fetchReject, fetchPass, fetchOff } from '@/api/audit'
export default {
  name: "AbnormalLoginAlarm",
  data() {
    const vali_endTime = (rule, value, callback) => {
      const { endType } = this.authorizationForm;
      if (endType == "1") {
        if (!value || !value.length) {
          // callback(this.$message.error('结束时间不能为空'));
          this.$message.error('结束时间不能为空');
        } else {
          callback();
        }
      }

    };

    const vali_endHours = (rule, value, callback) => {
      const { endType } = this.authorizationForm;
      if (endType == "2") {
        if (!value || !value.length) {
          // callback(this.$message.error('授权时长不能为空'));
          this.$message.error('授权时长不能为空');
        } else {
          callback();
        }
      }

    };

    return {
      endTimePickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < (new Date).getTime() - 24 * 3600000
        }
      },
      authorizationRules: {
        endTime: [
          { validator: vali_endTime, trigger: 'blur' }
        ],
        endHours: [
          { validator: vali_endHours, trigger: 'blur' }
        ]
      },
      endTimeDisabled: {
        picker: false,
        duration: true,
      },
      formLabelWidth: '120px',
      labelPosition: 'right',
      reviewDialogVisible: false,
      total: 0,
      auditList: [
      ],
      authorizationForm: {
        startType: "1",
        endType: "1",
        endTime: "",
        endHours: "",
        startTime: ""
      },
      topForm: {
        accessPointName: '',
        auditDeviceName: '',
        page: '',
        pageSize: 20,
        personnelName: '',
        userName: ''
      },
      curRow: {},
      reviewInfo: {}
    }
  },
  async mounted() {
    await this.handleGetList();
    this.$bus.$on('reReloadAudit',this.handleGetList)
  },
  beforeDestroy(){
			this.$bus.$off('reReloadAudit')
		},
  methods: {
    async handleResolve() {
 
      const { endType } = this.authorizationForm;
      if (endType == "1") {
        const {endTime} = this.authorizationForm;
        if (!endTime) {
          this.$message.error('结束时间不能为空')
        }else{
          const { id } = this.curRow;
      const resolveData = {
        endHours: this.authorizationForm.endHours,
        endTime: this.authorizationForm.endTime,
        endType: Number(this.authorizationForm.endType),
        startTime: this.authorizationForm.startTime,
        startType: Number(this.authorizationForm.startType),
      }
      const rejectRsp = await fetchPass(id, resolveData);
      const { msg } = rejectRsp;
      if (msg && msg.length) {
        this.$message({
          message: msg,
          type: 'success'
        });
        this.$refs.topForm.resetFields();
        await this.handleGetList();
        this.reviewDialogVisible = false
      }
        }
      }else{
        const {endHours} = this.authorizationForm;
        if (!endHours || !endHours.length) {
          this.$message.error('授权时长不能为空')
        }else{
          const { id } = this.curRow;
      const resolveData = {
        endHours: this.authorizationForm.endHours,
        endTime: this.authorizationForm.endTime,
        endType: Number(this.authorizationForm.endType),
        startTime: this.authorizationForm.startTime,
        startType: Number(this.authorizationForm.startType),
      }
      const rejectRsp = await fetchPass(id, resolveData);
      const { msg } = rejectRsp;
      if (msg && msg.length) {
        this.$message({
          message: msg,
          type: 'success'
        });
        this.$refs.topForm.resetFields();
        await this.handleGetList();
        this.reviewDialogVisible = false
      }
        }
      }

      
      // this.$refs['authorizationForm'].validate(async (valid) => {        
      //   if (valid) {
      //     const { id } = this.curRow;
      //     const resolveData = {
      //       endHours: this.authorizationForm.endHours,
      //       endTime: this.authorizationForm.endTime,
      //       endType: Number(this.authorizationForm.endType),
      //       startTime: this.authorizationForm.startTime,
      //       startType: Number(this.authorizationForm.startType),
      //     }
      //     const rejectRsp = await fetchPass(id, resolveData);
      //     const { msg } = rejectRsp;
      //     if (msg && msg.length) {
      //       this.$message({
      //         message: msg,
      //         type: 'success'
      //       });
      //       this.$refs.topForm.resetFields();
      //       await this.handleGetList();
      //       this.reviewDialogVisible = false
      //     }
      //   } else {
      //     console.log('error submit!!');
      //     return false;
      //   }
      // });

    },
    async handleReject() {
      const { id } = this.curRow;
      const rejectRsp = await fetchReject(id);
      const { msg } = rejectRsp;
      if (msg && msg.length) {
        this.$message({
          message: msg,
          type: 'success'
        });
        this.$refs.topForm.resetFields();
        await this.handleGetList();
        this.reviewDialogVisible = false
      }
    },
    endTimeRadioChange(val) {
      if (val == "1") {
        this.endTimeDisabled.picker = false;
        this.endTimeDisabled.duration = true;
      } else {
        this.endTimeDisabled.picker = true;
        this.endTimeDisabled.duration = false;
      }
    },
    async handleDisconnect(row) {
      this.curRow = row;
      try {
        await this.showDisconnectMessageBoxAsync(row.accessPointName);
        await this.disconnectRow(row);
      } catch (error) {
        console.log(error);
      }
    },
    async handleDisconnectSelected() {
      // console.dir(this.$refs.auditTable.selection);
      const cur_select = this.$refs.auditTable.selection;
      if (cur_select && cur_select.length) {
        for (let i = 0; i < cur_select.length; i++) {
          try {
            await this.showDisconnectMessageBoxAsync(cur_select[i].accessPointName);
            const offRsp = await fetchOff(cur_select[i].id);
          } catch (error) {
            console.log(error);
          }
        }
        this.$message({
        message: `成功断开${cur_select.length}次链接`,
        type: 'success'
      });
      this.$refs.topForm.resetFields();
      await this.handleGetList();
    } else {
      this.$message('请先勾选');
    }
  },
  async disconnectRow(row) {
    const offRsp = await fetchOff(row.id);
    const { msg } = offRsp;
    if (msg && msg.length) {
      this.$message({
        message: msg,
        type: 'success'
      });
      this.$refs.topForm.resetFields();
      await this.handleGetList();
    }
  },
  showDisconnectMessageBoxAsync(accessPointName) {
    const msg = (accessPointName && accessPointName.length) ? `确定断开吗\"${accessPointName}\"？` : '确定断开吗？';
    return this.$confirm(msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  },
  async handleReview(row) {
    const { id } = row;
    const infoRsp = await fetchInfo(id);
    if (infoRsp.data && infoRsp.data.info) {
      // this.reviewInfo = infoRsp.data.info;
      this.curRow = row;
    }
    this.reviewDialogVisible = true;
  },
  async handleCheck(row) {
    const { id } = row;
    const infoRsp = await fetchInfo(id);
    this.curRow = row;
    if (infoRsp.data && infoRsp.data.info) {
      this.reviewInfo = infoRsp.data.info;
    }
    this.reviewDialogVisible = true;
  },
  // handleEditPermissions(row) {
  //   console.log(row);
  // },
  handleSizeChange(val) {
    console.log(`当前页: ${val}`);
  },
  async handleGetList() {
    const auditRes = await fetchList(this.topForm);
    if (auditRes.data && auditRes.data.list) {
      this.total = auditRes.data.count;
      this.auditList = auditRes.data.list;
    } else {

    }
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

.padding-sm {
  padding: 20px;
}

.review-container {
  display: flex;
}

.photo-wrap {
  width: 200px;
  margin-right: 20px;
}

.photo-wrap img {
  display: block;
  width: 200px;
  height: 200px;
}

.photo-wrap h3 {
  margin-top: 10px
}

.flex-sub {
  flex: 1;
}

.admin-operation {
  width: 333px;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #dcdfe6;
}

.admin-operation h2 {
  font-weight: 400;
  margin-bottom: 25px;
  line-height: 0;
}

[class*=radio-group]>label+label {
  margin-top: 20px;
}
</style>