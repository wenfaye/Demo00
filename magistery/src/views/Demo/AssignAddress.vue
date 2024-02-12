<template>
  <layout ref="newForm" form-title="分配地址" :fit="false">
    <el-form ref="formRef" :model="formData" label-width="150px">
      <table class="table table-bordered" cellspacing="0" cellpadding="0" style="width: 100%;">
        <tbody>
          <tr>
             <td colspan="2" style="font-weight: bold;">路由器</td>
             <td colspan="2" style="font-weight: bold;">IP地址</td>
          </tr>
          <tr>
             <td>Route ID</td>
             <td>Looback0</td>
             <td>
               <el-input style="width: 235px;"></el-input>
             </td>
             <td>Mask: 255.255.255.255</td>
          </tr>
          <tr>
            <td>I区接入网关</td>
            <td>
              <el-input value="E0/0/0" style="width: 235px;"></el-input>
            </td>
            <td>
              <el-input style="width: 235px;"></el-input>
            </td>
            <td>Mask: 255.255.255.0</td>
          </tr>
          <tr>
            <td>II区接入网关</td>
            <td>
              <el-input value="E0/0/1" style="width: 235px;"></el-input>
            </td>
            <td>
              <el-input style="width: 235px;"></el-input>
            </td>
            <td>Mask: 255.255.255.0</td>
          </tr>
          <tr>
            <td rowspan="2">互联网1</td>
            <td>
              <span>本端:</span><el-input style="display: inline-block;width:200px;margin-left: 5px;"></el-input>
            </td>
            <td>
              <el-input style="width: 235px;"></el-input>
            </td>
            <td>Mask: 255.255.255.252</td>
          </tr>
          <tr>
            <td>
              <span>对端:</span><el-input style="display: inline-block;width:200px;margin-left: 5px;"></el-input>
            </td>
            <td>
              <el-input style="width: 235px;"></el-input>
            </td>
            <td>Mask: 255.255.255.252</td>
          </tr>
          <tr>
            <td rowspan="2">互联网2</td>
            <td>
              <span>本端:</span><el-input style="display: inline-block;width:200px;margin-left: 5px;"></el-input>
            </td>
            <td>
              <el-input style="width: 235px;"></el-input>
            </td>
            <td>Mask: 255.255.255.252</td>
          </tr>
          <tr>
            <td>
              <span>对端:</span><el-input style="display: inline-block;width:200px;margin-left: 5px;"></el-input>
            </td>
            <td>
              <el-input style="width: 235px;"></el-input>
            </td>
            <td>Mask: 255.255.255.252</td>
          </tr>
          <tr>
            <td colspan="2" style="font-weight: bold;">接入交换机</td>
            <td colspan="2" style="font-weight: bold;">管理IP</td>
          </tr>
          <tr>
            <td colspan="2">I区接入交换机</td>
            <td>
              <el-input style="width: 235px;"></el-input>
            </td>
            <td>Mask: 255.255.255.0</td>
          </tr>
          <tr>
            <td colspan="2">II区接入交换机</td>
            <td>
              <el-input style="width: 235px;"></el-input>
            </td>
            <td>Mask: 255.255.255.0</td>
          </tr>
          <tr>
            <td colspan="2" style="font-weight: bold;">业务类别</td>
            <td style="font-weight: bold;">业务主机IP</td>
            <td style="font-weight: bold;">交换机端口</td>
          </tr>
          <tr>
            <td>I区</td>
            <td>远动A</td>
            <td>
              <el-input style="width: 235px;"></el-input>
            </td>
            <td>
              <el-input style="width: 235px;"></el-input>
            </td>
          </tr>
          <tr>
            <td>II区</td>
            <td>远动B</td>
            <td>
              <el-input style="width: 235px;"></el-input>
            </td>
            <td>
              <el-input style="width: 235px;"></el-input>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="hr-line-dashed"></div>
      <div class="hr-line-dashed"></div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="">
            <el-button key="btnOk" type="primary" @click="$router.push('/demo/site_list')">确定</el-button>
            <el-button key="btnCancel" type="default" @click="$router.push('/demo/site_list')">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </layout>
</template>

<script setup>
import Layout from '@/components/Layout/Form.vue';
import { onMounted, ref, reactive } from 'vue';

const formData = reactive({});
</script>
