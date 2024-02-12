<template>
  <div class="navbar">
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
      <el-form ref="pwdForm" :model="pwdForm" :rules="pwdRules" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword"  autocomplete="off"  type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdForm.newPassword"  autocomplete="off"  type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="comPassword">
          <el-input v-model="pwdForm.comPassword"  autocomplete="off"  type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button @click="resetForm('pwdForm')">取 消</el-button>
        <el-button type="primary" @click="submitPwdForm('pwdForm')">确 定</el-button>
      </span>
    </el-dialog>
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
      @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template> -->

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <i class="el-icon-user-solid" />
          <span style="font-size: 14px; margin-left: 5px;">管理员</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="editPassword">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="handleLogout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import {fetchChangePwd} from '@/api/user'
import CryptoJS from 'crypto-js'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.pwdForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    }

    return {
      dialogVisible: false,
      pwdForm: {
        oldPassword: '',
        newPassword: '',
        comPassword: ''
      },
      pwdRules: {
        newPassword: [
            { required: true, message: '新密码不能为空', trigger: 'blur' }
          ],
        oldPassword: [
            { required: true, message: '原密码不能为空', trigger: 'blur' }
          ],
        comPassword: [
            { validator: validatePass, trigger: 'blur' }
          ]
      }
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    editPassword() {
      this.dialogVisible = true
    },
    async handleLogout(){
      try {
        await this.showLogoutMessageBox();
        await this.logout();
      } catch (error) {
        console.dir(error);
      }

    },
    showLogoutMessageBox(){
      return this.$confirm('确定退出吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
    },

    async logout() {
      await this.$store.dispatch('user/logout')
      location.href = `${window.location.protocol}//${window.location.host}/client/index.html#/login`
      // location.href = `http://127.0.0.1:8085/client/index.html#/login?redirect=${this.$route.fullPath}`

      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
     submitPwdForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const ep = (t)=> {
        const message = CryptoJS.enc.Utf8.parse(t);
        const secretPassphrase = CryptoJS.enc.Utf8.parse('0123456789asdfgh');
        const iv = CryptoJS.enc.Utf8.parse('0123456789asdfgh');
        const etd = CryptoJS.AES.encrypt(message, secretPassphrase, {
            mode: CryptoJS.mode.CBC,
            paddding: CryptoJS.pad.Pkcs7,
            iv
        }).toString();
        console.log(etd);
        return etd;
    }
    const changePwdData = {
      newPassword:ep(this.pwdForm.newPassword),
      oldPassword:ep(this.pwdForm.oldPassword),
    }
            const res = await fetchChangePwd(changePwdData);
            console.dir(res);
            location.href = `${window.location.protocol}//${window.location.host}/client/index.html#/login`
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false
      }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
