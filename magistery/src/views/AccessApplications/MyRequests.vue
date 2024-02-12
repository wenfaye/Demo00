<template>
  <layout ref="layout" list-title="我的申请" :stat-visible="false" >
    <template #header>
      <el-dropdown>
        <el-button type="primary">
          新建申请<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleNewNode()">数据网新节点接入申请</el-dropdown-item>
            <el-dropdown-item @click="handleNewBiz()">数据网新业务接入申请</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template #list>
      <el-table
        border
        table-layout="auto"
        :data="gridData"
        style="width: 100%">
        <el-table-column
          key="title"
          prop="title"
          label="标题"
        >
        </el-table-column>
        <el-table-column
          key="dk_site_id"
          prop="dk_site_id"
          label="厂站名称"
        >
          <template #default="scope">
            <span>{{allSiteMap[scope.row.dk_site_id] ? allSiteMap[scope.row.dk_site_id].name : scope.row.dk_site_id}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="request_company"
          prop="request_company"
          label="申请单位"
        >
        </el-table-column>
        <el-table-column
          key="requester"
          prop="requester"
          label="联系人"
        >
        </el-table-column>
        <el-table-column
          key="access_net"
          prop="access_net"
          label="接入网络"
        >
          <template #default="scope">
            <span v-if="scope.row.access_net === 'sd_access'">省调接入网</span>
            <span v-if="scope.row.access_net === 'dd_access1'">地调第一接入网</span>
            <span v-if="scope.row.access_net === 'dd_access2'">地调第二接入网</span>
          </template>
        </el-table-column>
        <el-table-column
          key="access_net"
          prop="access_net"
          label="申请类型"
        >
          <template #default="scope">
            <span v-if="scope.row.type === 'new_node'">新节点接入</span>
            <span v-if="scope.row.type === 'new_biz'">新业务接入</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--key="debug_manu"-->
          <!--prop="debug_manu"-->
          <!--label="网络接入调试厂家"-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--key="debug_time"-->
          <!--prop="debug_time"-->
          <!--label="申请调试时间"-->
        <!--&gt;-->
          <!--<template #default="scope">-->
           <!--<span v-if="scope.row.debug_time && scope.row.debug_time.indexOf('0001') === 0"></span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          key="state"
          prop="state"
          label="状态"
        >
          <template #default="scope">
            <span style="color: blue;" v-if="scope.row.state === 'approving'">待审批</span>
            <span style="color: blue;" v-if="scope.row.state === 'approved'">已审批</span>
            <span style="color: blue;" v-if="scope.row.state === 'rejected'">已退回</span>
            <span style="color: blue;" v-if="scope.row.state === 'allocated'">已分配地址</span>
          </template>
        </el-table-column>
        <el-table-column
          key="created_at"
          prop="created_at"
          label="提交申请时间"
        >
          <template #default="scope">
            <span v-if="scope.row.created_at && scope.row.created_at.length > 19">{{scope.row.created_at.substring(0, 10)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="operations"
          prop="operations"
          width="280"
          label="操作"
        >
          <template #default="scope">
            <span v-if="scope.row.state !== 'allocated'">
              <!--<el-button size="small" icon="edit" :record-id="scope.row.id" @click="handleEdit()">编辑</el-button>-->
              <el-popconfirm title="确认要删除吗？" @confirm="handleDeleteRequest(scope.row)" v-if="scope.row.state === 'approving' || scope.row.state === 'rejected'">
                <template #reference>
                  <el-button size="small" icon="delete" :record-id="scope.row.id">删除</el-button>
                </template>
              </el-popconfirm>
              <el-button size="small" icon="view" :record-id="scope.row.id" @click="handleShowView(scope.row)">查看</el-button>
            </span>
            <span v-if="scope.row.state === 'allocated'">
              <el-button size="small" icon="view" :record-id="scope.row.id" @click="handleShowView(scope.row)">查看</el-button>
              <el-button size="small" type="primary" icon="view" :record-id="scope.row.id" @click="handleShowIP(scope.row)">查看IP</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        width="80%"
        top="3vh"
        :close-on-click-modal="false"
        v-model="newBizDialogVisible"
        title="数据网新业务接入申请"
      >
        <el-scrollbar height="700px" style="padding-left: 20px; padding-right: 20px;">
          <el-form ref="bizFormRef" :model="nodeFormData" label-width="240px">
            <el-row>
              <el-col :span="12">
                <el-form-item prop="request_company" label="申请单位名称" :rules="[ { required: true, message: '申请单位不能为空！' } ]">
                  <el-select v-model="nodeFormData.request_company" clearable allow-create filterable style="width: 100%;">
                    <el-option :label="v" :value="v" v-for="(v) in companies" v-bind:key="v"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="dk_site_id" label="厂站选择" :rules="[ { required: true, message: '厂站不能为空！' } ]">
                  <el-select v-model="nodeFormData.dk_site_id" @change="handleNodeChange()" clearable filterable remote allow-create :remote-method="handleLoadSite" style="width: 100%;" placeholder="输入厂站关键字进行查找">
                    <el-option :label="site.name" :value="site.id" v-for="site in siteList" v-bind:key="site.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="requester" label="联系人" :rules="[ { required: true, message: '联系人不能为空！' } ]">
                  <el-input v-model="nodeFormData.requester"  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="top_voltage" label="电压等级" :rules="[ { required: true, message: '电压等级不能为空！' } ]">
                  <el-select v-model="nodeFormData.top_voltage" style="width: 100%;">
                    <el-option :label="vo.label" :value="vo.value" v-for="vo in voltageLevels" v-bind:key="vo.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="接入网络">
                  <el-checkbox v-model="nodeFormData.sdAccess" label="省调接入网" />
                  <el-checkbox v-model="nodeFormData.ddAccess1" label="地调第一接入网" />
                  <el-checkbox v-model="nodeFormData.ddAccess2" label="地调第二接入网" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="网络接入调试厂家">
                  <el-input v-model="nodeFormData.debug_manu"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="申请调试时间">
                  <el-date-picker
                    type="date"
                    style="width: 100%;"
                    v-model="nodeFormData.debug_time"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider content-position="left" style="margin-top: 30px;">
              <el-checkbox v-model="checkZone1">一区新增业务</el-checkbox>
            </el-divider>
            <table v-if="checkZone1" class="table table-bordered" style="width: 100%;" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>业务名</th>
                  <th>业务端口号</th>
                  <th>接入网描述</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="biz in nodeFormData.bizList1" v-bind:key="biz.name">
                  <td>
                    <!--<el-input v-model="biz.name" />-->
                    <el-select v-model="biz.name" style="width: 100%;" :disabled="biz.running_state && biz.running_state !== 1008">
                      <el-option v-for="b in bizTypes1" :label="b.label" :value="b.value" v-bind:key="b.value"></el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-input v-model="biz.ports" placeholder="可以英文逗号分割输入多个端口号" :disabled="biz.running_state && biz.running_state !== 1008"></el-input>
                  </td>
                  <td>
                    <el-input v-model="biz.description" :disabled="biz.running_state && biz.running_state !== 1008"></el-input>
                  </td>
                  <td>
                    <el-popconfirm title="确认要删除吗？" @confirm="handleDeleteBiz1(biz)" v-if="!biz.running_state || biz.running_state === 1008">
                      <template #reference>
                        <el-button icon="delete" size="small" />
                      </template>
                    </el-popconfirm>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="checkZone1" style="text-align: right;padding-right: 10px;">
              <el-button key="newBiz1" type="primary" icon="plus" style="margin-top: 20px;margin-right: 20px;" @click="handleAddBiz1()">添加</el-button>
            </div>
            <el-divider content-position="left" style="margin-top: 30px;">
              <el-checkbox v-model="checkZone2">二区新增业务</el-checkbox>
            </el-divider>
            <table v-if="checkZone2" class="table table-bordered" style="width: 100%;" cellpadding="0" cellspacing="0">
              <thead>
              <tr>
                <th>业务名</th>
                <th>业务端口号</th>
                <th>接入网描述</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="biz in nodeFormData.bizList2" v-bind:key="biz.name">
                  <td>
                    <!--<el-input v-model="biz.name" />-->
                    <el-select v-model="biz.name" style="width: 100%;" :disabled="biz.running_state && biz.running_state !== 1008">
                      <el-option v-for="b in bizTypes2" :label="b.label" :value="b.value" v-bind:key="b.value"></el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-input v-model="biz.ports" placeholder="可以英文逗号分割输入多个端口号" :disabled="biz.running_state && biz.running_state !== 1008"></el-input>
                  </td>
                  <td>
                    <el-input v-model="biz.description" :disabled="biz.running_state && biz.running_state !== 1008"></el-input>
                  </td>
                  <td>
                    <el-popconfirm title="确认要删除吗？" @confirm="handleDeleteBiz1(biz)" v-if="!biz.running_state || biz.running_state === 1008">
                      <template #reference>
                        <el-button icon="delete" size="small" />
                      </template>
                    </el-popconfirm>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="checkZone2" style="text-align: right;padding-right: 10px;">
              <el-button key="newBiz1" type="primary" icon="plus" style="margin-top: 20px;margin-right: 20px;" @click="handleAddBiz2()">添加</el-button>
            </div>
          </el-form>
        </el-scrollbar>
        <template #footer>
          <span class="dialog-footer">
            <el-button icon="View" @click="handlePreview('new_biz')">预览</el-button>
            <el-button type="primary" icon="CircleCheck" @click="handleCreateRequest('new_biz')">
              提交申请
            </el-button>
            <el-button icon="CircleClose" @click="newBizDialogVisible = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog
        width="80%"
        top="3vh"
        :close-on-click-modal="false"
        v-model="newNodeDialogVisible"
        title="数据网新节点接入申请">
        <el-scrollbar height="700px" style="padding-left: 20px; padding-right: 20px;">
          <el-form ref="nodeFormRef" :model="nodeFormData" label-width="240px">
            <el-row>
              <el-col :span="12">
                <el-form-item prop="request_company" label="申请单位名称" :rules="[ { required: true, message: '单位不能为空！' } ]">
                  <el-select v-model="nodeFormData.request_company" clearable allow-create filterable style="width: 100%;">
                    <el-option :label="v" :value="v" v-for="(v) in companies" v-bind:key="v"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="dk_site_id" label="新增厂站" :rules="[ { required: true, message: '节点不能为空！' } ]">
                  <el-select v-model="nodeFormData.dk_site_id" @change="handleNodeChange()" clearable filterable allow-create style="width: 100%;">
                    <el-option :label="site.name" :value="site.id" v-for="site in siteList" v-bind:key="site.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="requester" label="联系人" :rules="[ { required: true, message: '联系人不能为空！' } ]">
                  <el-input v-model="nodeFormData.requester"  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="top_voltage" label="电压等级" :rules="[ { required: true, message: '电压等级不能为空！' } ]">
                  <el-select v-model="nodeFormData.top_voltage" style="width: 100%;">
                    <el-option :label="vo.label" :value="vo.value" v-for="vo in voltageLevels" v-bind:key="vo.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="接入网络">
                  <el-checkbox v-model="nodeFormData.sdAccess" label="省调接入" />
                  <el-checkbox v-model="nodeFormData.ddAccess1" label="地调第一接入网" />
                  <el-checkbox v-model="nodeFormData.ddAccess2" label="地调第二接入网" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="!onlyOneSelect">
              <el-col :span="12" v-if="nodeFormData.sdAccess">
                <el-form-item label="省调接入路由器设备厂家型号">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.sd_route_model">
                    <el-option :label="m" :value="m" v-for="m in routeModels" v-bind:key="m"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="省调接入交换机设备厂家型号" >
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.sd_switch_model">
                    <el-option :label="m" :value="m" v-for="m in switchModels" v-bind:key="m"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="省调接入上联设备1">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.sd_uplink1">
                    <el-option :label="up" :value="up" v-for="up in sdAccessPoints[nodeFormData.owner]" v-bind:key="up"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="省调可接入上联设备2">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.sd_uplink2">
                    <el-option :label="up" :value="up" v-for="up in sdAccessPoints[nodeFormData.owner]" v-bind:key="up"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="nodeFormData.ddAccess1">
                <el-form-item label="地调第一接入路由器设备厂家型号">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_route_model1">
                    <el-option :label="m" :value="m" v-for="m in routeModels" v-bind:key="m"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="地调第一接入交换机设备厂家型号" >
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_switch_model1">
                    <el-option :label="m" :value="m" v-for="m in switchModels" v-bind:key="m"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="地调第一接入网上联设备1">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_first_uplink1">
                    <el-option :label="up" :value="up" v-for="up in ddAccessPoints1[nodeFormData.owner]" v-bind:key="up"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="地调第一接入网上联设备2">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_first_uplink2">
                    <el-option :label="up" :value="up" v-for="up in ddAccessPoints1[nodeFormData.owner]" v-bind:key="up"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="nodeFormData.ddAccess2">
                <el-form-item label="地调第二接入路由器设备厂家型号">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_route_model2">
                    <el-option :label="m" :value="m" v-for="m in routeModels" v-bind:key="m"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="地调第二接入交换机设备厂家型号" >
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_switch_model2">
                    <el-option :label="m" :value="m" v-for="m in switchModels" v-bind:key="m"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="地调第二接入网上联设备1">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_second_uplink1">
                    <el-option :label="up" :value="up" v-for="up in ddAccessPoints2[nodeFormData.owner]" v-bind:key="up"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="地调第二接入网上联设备2">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_second_uplink2">
                    <el-option :label="up" :value="up" v-for="up in ddAccessPoints2[nodeFormData.owner]" v-bind:key="up"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="onlyOneSelect">
              <el-col :span="12" v-if="nodeFormData.sdAccess">
                <el-form-item label="省调接入路由器设备厂家型号">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.sd_route_model">
                    <el-option :label="m" :value="m" v-for="m in routeModels" v-bind:key="m"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="省调接入交换机设备厂家型号" >
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.sd_switch_model">
                    <el-option :label="m" :value="m" v-for="m in switchModels" v-bind:key="m"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="nodeFormData.sdAccess">
                <el-form-item label="省调接入上联设备1">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.sd_uplink1">
                    <el-option :label="up" :value="up" v-for="up in sdAccessPoints[nodeFormData.owner]" v-bind:key="up"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="省调可接入上联设备2">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.sd_uplink2">
                    <el-option :label="up" :value="up" v-for="up in sdAccessPoints[nodeFormData.owner]" v-bind:key="up"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="nodeFormData.ddAccess1">
                <el-form-item label="地调第一接入路由器设备厂家型号">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_route_model1">
                    <el-option :label="m" :value="m" v-for="m in routeModels" v-bind:key="m"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="地调第一接入交换机设备厂家型号" >
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_switch_model1">
                    <el-option :label="m" :value="m" v-for="m in switchModels" v-bind:key="m"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="nodeFormData.ddAccess1">
                <el-form-item label="地调第一接入网上联设备1">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_first_uplink1">
                    <el-option :label="up" :value="up" v-for="up in ddAccessPoints1[nodeFormData.owner]" v-bind:key="up"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="地调第一接入网上联设备2">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_first_uplink2">
                    <el-option :label="up" :value="up" v-for="up in ddAccessPoints1[nodeFormData.owner]" v-bind:key="up"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="nodeFormData.ddAccess2">
                <el-form-item label="地调第二接入路由器设备厂家型号">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_route_model2">
                    <el-option :label="m" :value="m" v-for="m in routeModels" v-bind:key="m"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="地调第二接入交换机设备厂家型号" >
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_switch_model2">
                    <el-option :label="m" :value="m" v-for="m in switchModels" v-bind:key="m"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="nodeFormData.ddAccess2">
                <el-form-item label="地调第二接入网上联设备1">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_second_uplink1">
                    <el-option :label="up" :value="up" v-for="up in ddAccessPoints2[nodeFormData.owner]" v-bind:key="up"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="地调第二接入网上联设备2">
                  <el-select style="width: 100%;" filterable clearable allow-create v-model="nodeFormData.dd_second_uplink2">
                    <el-option :label="up" :value="up" v-for="up in ddAccessPoints2[nodeFormData.owner]" v-bind:key="up"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="I区纵向加密装置厂家型号">
                  <el-select v-model="nodeFormData.vert_encryptor_model1" allow-create filterable clearable style="width: 100%;"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="II区纵向加密装置厂家型号">
                  <el-select v-model="nodeFormData.vert_encryptor_model2" allow-create filterable clearable style="width: 100%;"></el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="网络接入调试厂家">
                  <el-input v-model="nodeFormData.debug_manu"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="申请调试时间">
                  <el-date-picker
                    type="date"
                    style="width: 100%;"
                    v-model="nodeFormData.debug_time"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider content-position="left" style="margin-top: 30px;">一区接入业务</el-divider>
            <table class="table table-bordered" style="width: 100%;" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>业务名</th>
                  <th>业务端口号</th>
                  <th>备注</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="biz in nodeFormData.bizList1" v-bind:key="biz.name">
                  <td>
                    <!--<el-input v-model="biz.name" />-->
                    <el-select v-model="biz.name" style="width: 100%;">
                      <el-option v-for="b in bizTypes1" :label="b.label" :value="b.value" v-bind:key="b.value"></el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-input v-model="biz.ports" placeholder="可以英文逗号分割输入多个端口号" />
                  </td>
                  <td>
                    <el-input v-model="biz.description"></el-input>
                  </td>
                  <td>
                    <el-popconfirm title="确认要删除吗？" @confirm="handleDeleteBiz1(biz)">
                      <template #reference>
                        <el-button icon="delete" size="small" />
                      </template>
                    </el-popconfirm>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="text-align: right;padding-right: 10px;">
              <el-button key="newBiz1" type="primary" icon="plus" style="margin-top: 20px;margin-right: 20px;" @click="handleAddBiz1()">添加</el-button>
            </div>
            <el-divider content-position="left" style="margin-top: 30px;">二区接入业务</el-divider>
            <table class="table table-bordered" style="width: 100%;" cellspacing="0" cellpadding="0">
              <thead>
              <tr>
                <th>业务名</th>
                <th>业务端口号</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="biz in nodeFormData.bizList2" v-bind:key="biz.name">
                  <td>
                    <!--<el-input v-model="biz.name" />-->
                    <el-select v-model="biz.name" style="width: 100%;">
                      <el-option v-for="b in bizTypes2" :label="b.label" :value="b.value" v-bind:key="b.value"></el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-input v-model="biz.ports" placeholder="可以英文逗号分割输入多个端口号" />
                  </td>
                  <td>
                    <el-input v-model="biz.description"></el-input>
                  </td>
                  <td>
                    <el-popconfirm title="确认要删除吗？" @confirm="handleDeleteBiz2(biz)">
                      <template #reference>
                        <el-button icon="delete" size="small" />
                      </template>
                    </el-popconfirm>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="text-align: right;padding-right: 10px;">
              <el-button key="newBiz1" type="primary" icon="plus" style="margin-top: 20px;margin-right: 20px;" @click="handleAddBiz2()">添加</el-button>
            </div>
          </el-form>
        </el-scrollbar>
        <template #footer>
          <span class="dialog-footer">
            <el-button icon="View" @click="handlePreview('new_node')">预览</el-button>
            <el-button type="primary" icon="CircleCheck" @click="handleCreateRequest('new_node')">
              提交申请
            </el-button>
            <el-button icon="CircleClose" @click="newNodeDialogVisible = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
      <allocated-address ref="allocatedIP"></allocated-address>
      <request-view ref="requestView"></request-view>
    </template>
  </layout>
</template>

<script lang="ts" setup>
import Layout from '@/components/Layout/List.vue';
import { onMounted, ref, reactive, computed, getCurrentInstance } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { anhuiStore } from '@/store/anhui';
import { genImage } from '@/utils';
import { getStations, getRouterTypes, getSwitchTypes, getStationInfo } from '@/api/dkCloud';
import { getRequests, createRequest, deleteRequest, getAllocatedAddress } from '@/api/accessRequests';
import AllocatedAddress from '@/views/AccessApplications/ShowAllocatedIP.vue';
import RequestView from '@/views/AccessApplications/ShowRequestView.vue';

const viewWrap = ref(null);
const gridData = ref([]);
const nodeFormRef = ref(null);
const bizFormRef = ref(null);
const nodeFormData = reactive({ request_company: '', dk_site_id: null, requester: '', top_voltage: '', owner: '', vert_encryptor_model1: '', vert_encryptor_model2: '', bizList1: [], bizList2: [], sdAccess: true, ddAccess1: false, ddAccess2: false, sd_route_model: '', sd_switch_model: '', dd_route_model1: '', dd_switch_model1: '', dd_route_model2: '', dd_switch_model2: '', debug_manu: '', debug_time: '', sd_uplink1: '', sd_uplink2: '', dd_first_uplink1: '', dd_first_uplink2: '', dd_second_uplink1: '', dd_second_uplink2: '' });
const newNodeDialogVisible = ref(false);
const newBizDialogVisible = ref(false);
const previewDialogVisible = ref(false);
const previewShowButton = ref(true);

const checkZone1 = ref(true);
const checkZone2 = ref(false);
const tabPosition = ref('省调接入网');

const voltageLevels = ref([]);
const cityCompanies = ref([]);
const bizTypes1 = ref([]);
const bizTypes2 = ref([]);
const siteList = ref([]);

const newSiteList = ref([]);
const allSiteList = ref([]);
const allSiteMap = ref({});

const routeModels = ref([]);
const switchModels = ref([]);

const sdAccessPoints = { 3401: ['肥西变', '众兴变'], 3402: ['修试工区', '繁昌变'], 3403: ['蚌埠变', '禹会变'], 3404: ['汤庄变', '洛河变'], 3405: ['西梁山变', '采石变'], 3406: ['显通变', '濉溪变'], 3407: ['朱村变', '官山变'], 3408: ['安庆变', '石牌变'] };
sdAccessPoints[3410] = ['徽州变', '万安变'];
sdAccessPoints[3411] = ['建阳变', '清流变'];
sdAccessPoints[3412] = ['太和边', '颍州变'];
sdAccessPoints[3413] = ['姬村变', '埇桥变'];
sdAccessPoints[3415] = ['城东基地', '皋城变'];
sdAccessPoints[3416] = ['涡阳变', '蒙城变'];
sdAccessPoints[3417] = ['池州变', '观牛变'];
sdAccessPoints[3418] = ['敬亭变', '宁国变'];

const ddAccessPoints1 = { 3401: ['主调', '备调', '竹溪变', '肥东', '巢湖', '螺丝岗', '庐江', '常青变', '肥西', '紫云', '长丰', '秋浦'], 3402: ['主调', '备调', '繁昌', '通江', '繁南', '无为', '芜湖', '普庆', '南陵'], 3403: ['主调', '备调', '高湖汇聚', '涂山汇聚', '秦集汇聚'], 3404: ['主调', '备调', '张集汇聚', '潘集汇聚', '寿县汇聚', '芦集汇聚', '凤台县调'], 3405: ['主调', '备调', '含山县', '和县汇聚', '恒兴汇聚', '采石汇聚', '当涂汇聚'], 3406: ['主调', '备调', '濉溪县调', '杨柳', '五里郢'], 3407: ['主调', '备调', '滨江汇聚', '丹阳汇聚', '丹阳汇聚', '义安区汇聚', '枞阳县调'], 3408: ['主调', '备调', '安庆变', '武昌变', '岳西县', '桐城县', '宿松县', '望江县', '潜山县', '怀宁县', '太湖县'] };
ddAccessPoints1[3410] = ['主调', '备调', '潜口汇聚', '歙县', '太平', '黟县', '祁门', '黟县汇聚', '休宁'];
ddAccessPoints1[3411] = ['主调', '备调', '明光', '定远', '全椒', '宝桥', '天长', '建阳', '城郊', '来安'];
ddAccessPoints1[3412] = ['主调', '备调', '牛庄变', '阜南县调', '临泉县汇聚', '太和县', '界首县调', '阜阳城郊', '刑集汇聚', '花园汇聚', '颍上县调'];
ddAccessPoints1[3413] = ['主调', '备调', '城郊县调', '双庆汇聚', '萧县县调', '马井汇聚', '砀山汇聚', '埇桥县调', '灵璧县调', '刘尧汇聚', '泗县县调'];
ddAccessPoints1[3415] = ['主调', '备调', '农电', '叶集', '挥手', '霍邱', '春秋唐', '霍山', '舒城', '金寨'];
ddAccessPoints1[3416] = ['主调', '备调', '利辛县调', '茨淮汇聚', '谯城变', '涡阳县', '蒙城县', '蒙城变汇聚'];
ddAccessPoints1[3417] = ['主调', '备调', '菊江汇聚', '石台县调', '蓉城汇聚', '青阳县调', '贵池区调', '东至县调', '风岭汇聚'];
ddAccessPoints1[3418] = ['主调', '备调', '泾县', '绩溪县', '广德县', '郎溪县', '旌德县', '宁国市', '雄鹿变', '宁国变', '凤凰变', '昌明变'];

const ddAccessPoints2 = { 3401: ['地调', '备调', '韦寨汇聚', '薛桥汇聚', '郭王汇聚', '徐寨汇聚', '孙楼汇聚', '吕蒙汇聚'], 3402: ['主调', '备调', '无为', '芜湖', '易太', '通江', '清竹', '南陵', '繁昌', '喻村'], 3403: ['主调', '备调', '星河变汇聚', '洪武变汇聚', '戴湖变汇聚', '怀远县调', '固镇县调', '五河县调', '凤阳县调'], 3404: ['主调', '备调', '樊庙汇聚', '凤台汇聚', '寿县汇聚', '潘集汇聚', '西山汇聚'], 3405: ['主调', '备调', '章塘', '含山', '苏李', '当涂', '香泉', '和县', '塔岗'], 3406: ['主调', '备调', '开渠变', '文昌宫变', '濉溪县公司'], 3407: ['主调', '备调', '渡江变汇聚', '顺安变汇聚', '朱村变汇聚', '枞阳县调'], 3408: ['主调', '备调', '仙河变', '泉河变', '邓村变', '潜山县', '宿松县', '桐城县', '太湖县', '怀宁县', '岳西县', '望江县'] };
ddAccessPoints2[3410] = ['主调', '备调', '歙县', '吴川', '区调', '黟县', '休宁', '韩村', '祁门'];
ddAccessPoints2[3411] = ['主调', '备调', '天长', '全椒', '明光', '明都', '定远', '贺庄', '滁县', '来安', '城郊'];
ddAccessPoints2[3412] = ['地调', '备调', '韦寨汇聚', '薛桥汇聚', '郭王汇聚', '徐寨汇聚', '孙楼汇聚', '吕蒙汇聚'];
ddAccessPoints2[3413] = ['主调', '备调', '灵璧县调', '泗县县调', '勋庄变', '双庆变', '埇桥县调', '孟楼变', '埇桥县调', '埇桥县调', '城郊县调'];
ddAccessPoints2[3415] = ['主调', '备调', '城郊', '霍邱', '崔庄', '蓼城', '霍山', '叶桥', '叶集', '金寨', '文峰', '古碑', '石岗', '舒城'];
ddAccessPoints2[3416] = ['主调', '备调', '利辛县调', '夏湖汇聚', '漆园汇聚', '蒙城县调', '华佗变', '涡阳县调', '耿黄变'];
ddAccessPoints2[3417] = ['主调', '备调', '蓉城变', '池州变', '观牛变', '东至', '贵池', '青阳', '石台'];
ddAccessPoints2[3418] = ['主调', '备调', '绩溪县', '军塘变', '泾县', '梅丰变', '旌德县', '宁国市', '东津变', '梓山变', '广德县', '郎溪县'];

const companies = { 3401: '合肥供电公司', 3402: '芜湖供电公司', 3403: '蚌埠供电公司', 3404: '淮南供电公司', 3405: '马鞍山供电公司', 3406: '淮北供电公司', 3407: '铜陵供电公司', 3408: '安庆供电公司', 3410: '黄山供电公司', 3411: '滁州供电公司', 3412: '阜阳供电公司', 3413: '宿州供电公司', 3415: '六安供电公司', 3416: '亳州供电公司', 3417: '池州供电公司', 3418: '宣城供电公司' };

const allocatedIP = ref(null);
const requestView = ref(null);

onMounted(() => {
  anhuiStore.init().then(() => {
    voltageLevels.value = anhuiStore.VoltageLevels;
    cityCompanies.value = anhuiStore.CityCompanies;
    bizTypes1.value = anhuiStore.BizTypes1;
    bizTypes2.value = anhuiStore.BizTypes2;

    loadRequest();

    getStations(false).then((response) => {
      newSiteList.value = response;
    }, (response) => {
    });

    getStations(true).then((response) => {
      allSiteList.value = response;
      const siteMap = {};
      for (const s of response) {
        siteMap[s.id] = s;
      }
      allSiteMap.value = siteMap;
    }, (response) => {
    });

    loadRouteModels();
    loadSwitchModels();
  });
});

const handleNewNode = () => {
  siteList.value = newSiteList.value;
  resetNodeInfo();
  if (nodeFormRef.value) {
    // nodeFormRef.value.clearValidate();
    nodeFormRef.value.resetFields();
  }
  newNodeDialogVisible.value = true;
};

const handleNewBiz = () => {
  siteList.value = [];
  resetNodeInfo();
  if (bizFormRef.value) {
    // bizFormRef.value.clearValidate();
    bizFormRef.value.resetFields();
  }
  newBizDialogVisible.value = true;
};

const handleCreateRequest = (type) => {
  if (type === 'new_biz') {
    bizFormRef.value.validate((valid) => {
      if (valid) {
        ElMessageBox.confirm(
          '确认要提交申请吗?',
          '提交确认',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          },
        ).then(() => {
          createBizs().then(() => {
            loadRequest();
            newBizDialogVisible.value = false;
          });
        }).catch(() => {});
      }
    });
  } else {
    nodeFormRef.value.validate((valid) => {
      if (valid) {
        ElMessageBox.confirm(
          '确认要提交申请吗?',
          '提交确认',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          },
        ).then(() => {
          createApplications().then(() => {
            loadRequest();
            newNodeDialogVisible.value = false;
          });
        }).catch(() => {});
      }
    });
  }
};

const handleAddBiz1 = () => {
  nodeFormData.bizList1.push({ name: '', ports: '', description: '', new_biz: true });
};

const handleAddBiz2 = () => {
  nodeFormData.bizList2.push({ name: '', ports: '', description: '', new_biz: true });
};

const handleDeleteRequest = (request) => {
  deleteRequest(request.id).then(() => {
    loadRequest();
  });
};

const handleDeleteBiz1 = (biz) => {
  const i = nodeFormData.bizList1.indexOf(biz);
  nodeFormData.bizList1.splice(i, 1);
};

const handleDeleteBiz2 = (biz) => {
  const i = nodeFormData.bizList1.indexOf(biz);
  nodeFormData.bizList2.splice(i, 1);
};

const handleDelete = () => {
};

const handleEdit = () => {
};

const handlePreview = (t) => {
  const request = toRequest(t);
  request.site_name = allSiteMap.value[request.dk_site_id] ? allSiteMap.value[request.dk_site_id].name : request.dk_site_id;

  const accNets = [];
  if (nodeFormData.sdAccess) {
    accNets.push('sd_access');
  }

  if (nodeFormData.ddAccess1) {
    accNets.push('dd_access1');
  }

  if (nodeFormData.ddAccess2) {
    accNets.push('dd_access2');
  }
  request.access_net = accNets[0];

  requestView.value.show(request, accNets);
};

const handleShowIP = (request) => {
  request.site_name = allSiteMap.value[request.dk_site_id] ? allSiteMap.value[request.dk_site_id].name : request.dk_site_id;
  getAllocatedAddress(request.id).then((response) => {
    allocatedIP.value.show(request, response);
  });
};

const handleShowView = (request) => {
  request.site_name = allSiteMap.value[request.dk_site_id] ? allSiteMap.value[request.dk_site_id].name : request.dk_site_id;
  requestView.value.show(request);
};

const handleNodeChange = () => {
  if (nodeFormData.dk_site_id) {
    for (const site of siteList.value) {
      if (site.id === nodeFormData.dk_site_id) {
        nodeFormData.top_voltage = convertVoltage(site.top_voltage_type);
        if (site.owner && site.owner.length === 6) {
          nodeFormData.owner = site.owner.substring(0, 4);

          const companyName = companies[nodeFormData.owner];
          nodeFormData.request_company = companyName;
          console.log(ddAccessPoints1[nodeFormData.owner]);
        }

        break;
      }
    }

    getStationInfo(nodeFormData.dk_site_id).then((response) => {
      nodeFormData.sdAccess = response.sd_access;
      nodeFormData.ddAccess1 = response.dd_access1;
      nodeFormData.ddAccess2 = response.dd_access2;
      nodeFormData.sd_route_model = response.sd_router_model;
      nodeFormData.sd_switch_model = response.sd_switch_model;
      nodeFormData.dd_route_model1 = response.dd_router_model1;
      nodeFormData.dd_switch_model1 = response.dd_switch_model1;
      nodeFormData.dd_route_model2 = response.dd_router_model2;
      nodeFormData.dd_switch_model2 = response.dd_switch_model2;

      const bizList1 = [];
      const bizList2 = [];
      if (response.pmu_list) {
        if (response.pmu_list.length > 0) {
          bizList1.push({ name: 'PMU', ports: '', description: '', running_state: response.pmu_list[0].running_state });
        }
      }

      // 远动
      if (response.rtu_list) {
        if (response.rtu_list.length > 0) {
          bizList1.push({ name: '远动1', ports: '', description: '', running_state: response.rtu_list[0].running_state });
        }
      }

      // 电能量
      if (response.ertu_list) {
        if (response.ertu_list.length > 0) {
          bizList2.push({ name: '电能量', ports: '', description: '', running_state: response.ertu_list[0].running_state });
        }
      }

      // 纵向加密装置
      if (response.vert_encryptor_list) {
        let inZone1 = false;
        let inZone2 = false;
        for (const device of response.vert_encryptor_list) {
          if (device.name.indexOf('I区')) {
            inZone1 = true;
          }
          if (device.name.indexOf('II区')) {
            inZone2 = true;
          }
        }
        if (inZone1) {
          bizList1.push({ name: '纵向加密认证装置', ports: '', description: '', running_state: response.vert_encryptor_list[0].running_state });
        }
        if (inZone2) {
          bizList2.push({ name: '纵向加密认证装置', ports: '', description: '', running_state: response.vert_encryptor_list[0].running_state });
        }
      }

      // 入侵检测设备
      if (response.idd_list) {
        let inZone1 = false;
        let inZone2 = false;
        for (const device of response.idd_list) {
          if (device.name.indexOf('I区')) {
            inZone1 = true;
          } else if (device.name.indexOf('II区')) {
            inZone2 = true;
          }
        }
        if (inZone1) {
          bizList1.push({ name: '入侵检测', ports: '', description: '', running_state: response.idd_list[0].running_state });
        }
        if (inZone2) {
          bizList2.push({ name: '入侵检测', ports: '', description: '', running_state: response.idd_list[0].running_state });
        }
      }

      // 网络安全检测
      if (response.csmonitor_list) {
        let inZone1 = false;
        let inZone2 = false;
        for (const device of response.csmonitor_list) {
          if (device.name.indexOf('I区')) {
            inZone1 = true;
          } else if (device.name.indexOf('II区')) {
            inZone2 = true;
          }
        }
        if (inZone1) {
          bizList1.push({ name: '网络安全监测装置', ports: '', description: '', running_state: response.csmonitor_list[0].running_state });
        }
        if (inZone2) {
          bizList2.push({ name: '网络安全监测装置', ports: '', description: '', running_state: response.csmonitor_list[0].running_state });
        }
      }

      nodeFormData.bizList1 = bizList1;
      nodeFormData.bizList2 = bizList2;
    });
  }
};

const handleLoadSite = (query) => {
  console.log('Loading with `' + query + '`');
  if (query) {
    setTimeout(() => {
      siteList.value = allSiteList.value.filter((item) => {
        return item.name.toLowerCase().includes(query.toLowerCase());
      });
    }, 200);
  } else {
    siteList.value = [];
  }
};

const saveApplication = () => {
  nodeFormRef.value.validate((valid) => {
    if (valid) { alert(111); }
  });
};

const generateImage = () => {
  genImage(viewWrap.value, '申请单');
};

const loadRouteModels = () => {
  getRouterTypes().then((response) => {
    const models = [];
    for (let i = 0; i < response.length; i++) {
      const r = response[i];
      if (r.name && r.name.indexOf('作废') < 0) {
        models.push(r.name);
      }
    }
    routeModels.value = models;
  }, (response) => {
  });
};

const loadSwitchModels = () => {
  getSwitchTypes().then((response) => {
    const models = [];
    for (let i = 0; i < response.length; i++) {
      const r = response[i];
      if (r.name && r.name.indexOf('作废') < 0) {
        models.push(r.name);
      }
    }
    switchModels.value = models;
  }, (response) => {
  });
};

const convertVoltage = (v: string) => {
  const volMap = { 1003: '500', 1005: '220', 1006: '110', 1008: '35', 1010: '10' };
  return volMap[v] || v;
};

const bizInZone1 = (b: any) => {
  const bizs = ['pmu', 'rtu'];

  return bizs.indexOf(b.type) >= 0 || b.name.indexOf('AVC') >= 0 || b.name.indexOf('I区') >= 0 || b.name.indexOf('一区') >= 0;
};

const resetNodeInfo = () => {
  nodeFormData.request_company = '';
  nodeFormData.dk_site_id = '';
  nodeFormData.requester = '';
  nodeFormData.top_voltage = '';
  nodeFormData.bizList1 = [];
  nodeFormData.bizList2 = [];
  nodeFormData.sdAccess = true;
  nodeFormData.ddAccess1 = false;
  nodeFormData.ddAccess2 = false;
  nodeFormData.sd_route_model = '';
  nodeFormData.sd_switch_model = '';
  nodeFormData.dd_route_model1 = '';
  nodeFormData.dd_switch_model1 = '';
  nodeFormData.dd_route_model2 = '';
  nodeFormData.dd_switch_model2 = '';
  nodeFormData.debug_time = '';
  nodeFormData.dd_switch_model2 = '';
};

const onlyOneSelect = computed({
  get: () => {
    return (nodeFormData.sdAccess && !nodeFormData.ddAccess1 && !nodeFormData.ddAccess2) || (!nodeFormData.sdAccess && nodeFormData.ddAccess1 && !nodeFormData.ddAccess2) || (!nodeFormData.sdAccess && !nodeFormData.ddAccess1 && nodeFormData.ddAccess2);
  },
});

const createApplications = async() => {
  const request = toRequest();
  const siteName = allSiteMap.value[nodeFormData.dk_site_id] ? allSiteMap.value[nodeFormData.dk_site_id].name : nodeFormData.dk_site_id;

  if (nodeFormData.sdAccess) {
    request.access_net = 'sd_access';
    request.title = nodeFormData.top_voltage + 'kV' + siteName + '调度数据网（省调接入网）新节点接入申请';
    await createRequest(request);
  }

  if (nodeFormData.ddAccess1) {
    request.access_net = 'dd_access1';
    request.title = nodeFormData.top_voltage + 'kV' + siteName + '调度数据网（地调第一接入网）新节点接入申请';
    await createRequest(request);
  }

  if (nodeFormData.ddAccess2) {
    request.access_net = 'dd_access2';
    request.title = nodeFormData.top_voltage + 'kV' + siteName + '调度数据网（地调第二接入网）新节点接入申请';
    await createRequest(request);
  }
};

const createBizs = async() => {
  const siteName = allSiteMap.value[nodeFormData.dk_site_id] ? allSiteMap.value[nodeFormData.dk_site_id].name : nodeFormData.dk_site_id;
  const request = {
    title: null,
    request_company: nodeFormData.request_company,
    requester: nodeFormData.requester,
    dk_site_id: nodeFormData.dk_site_id,
    top_voltage: parseInt(nodeFormData.top_voltage),
    debug_manu: nodeFormData.debug_manu || null,
    debug_time: nodeFormData.debug_time || null,
    type: 'new_biz',
    access_net: '',
    state: 'approving',
    attributes: {},
    bizs: [],
  };

  const bizList = [];
  for (const biz of nodeFormData.bizList1) {
    if (biz.new_biz) {
      bizList.push({ name: biz.name, ports: biz.ports, description: biz.description, location: 'zone1' });
    }
  }
  for (const biz of nodeFormData.bizList2) {
    if (biz.new_biz) {
      bizList.push({ name: biz.name, ports: biz.ports, description: biz.description, location: 'zone2' });
    }
  }
  request.bizs = bizList;

  if (nodeFormData.sdAccess) {
    request.access_net = 'sd_access';
    request.title = nodeFormData.top_voltage + 'kV' + siteName + '调度数据网（省调接入网）新业务接入申请';
    await createRequest(request);
  }

  if (nodeFormData.ddAccess1) {
    request.access_net = 'dd_access1';
    request.title = nodeFormData.top_voltage + 'kV' + siteName + '调度数据网（地调第一接入网）新业务接入申请';
    await createRequest(request);
  }

  if (nodeFormData.ddAccess2) {
    request.access_net = 'dd_access2';
    request.title = nodeFormData.top_voltage + 'kV' + siteName + '调度数据网（地调第二接入网）新业务接入申请';
    await createRequest(request);
  }
};

const loadRequest = () => {
  getRequests({ states: ['approved', 'approving', 'allocated', 'rejected'] }).then((response) => {
    if (response) {
      for (const req of response) {
        req.bizs.sort(function(b1, b2) {
          return b1.id - b2.id;
        });
      }
    }

    gridData.value = response || [];
  });
};

const toRequest = (t: any) => {
  const request = {
    title: null,
    request_company: nodeFormData.request_company,
    requester: nodeFormData.requester,
    dk_site_id: nodeFormData.dk_site_id,
    top_voltage: parseInt(nodeFormData.top_voltage),
    debug_manu: nodeFormData.debug_manu || null,
    debug_time: nodeFormData.debug_time || null,
    type: t || 'new_node',
    access_net: '',
    state: 'approving',
    attributes: {
      sd_route_model: nodeFormData.sd_route_model,
      sd_switch_model: nodeFormData.sd_switch_model,
      dd_route_model1: nodeFormData.dd_route_model1,
      dd_switch_model1: nodeFormData.dd_switch_model1,
      dd_route_model2: nodeFormData.dd_route_model2,
      dd_switch_model2: nodeFormData.dd_switch_model2,
      sd_uplink1: nodeFormData.sd_uplink1,
      sd_uplink2: nodeFormData.sd_uplink2,
      dd_first_uplink1: nodeFormData.dd_first_uplink1,
      dd_first_uplink2: nodeFormData.dd_first_uplink2,
      dd_second_uplink1: nodeFormData.dd_second_uplink1,
      dd_second_uplink2: nodeFormData.dd_second_uplink2,
      vert_encryptor_model1: nodeFormData.vert_encryptor_model1,
      vert_encryptor_model2: nodeFormData.vert_encryptor_model2,
    },
    bizs: [],
  };

  const bizList = [];
  for (const biz of nodeFormData.bizList1) {
    bizList.push({ name: biz.name, ports: biz.ports, description: biz.description, location: 'zone1' });
  }
  for (const biz of nodeFormData.bizList2) {
    bizList.push({ name: biz.name, ports: biz.ports, description: biz.description, location: 'zone2' });
  }
  request.bizs = bizList;

  return request;
};
</script>
