<template>
  <nav class="navbar navbar-static-top" role="navigation">
    <div class="navbar-header">
      <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
      <breadcrumb />
    </div>
    <ul class="nav navbar-top-links navbar-right">
      <li>
        <el-dropdown class="avatar-container" trigger="click" style="display: inherit;vertical-align: inherit;">
          <a class="right-menu-item count-info"  style="padding-left: 2px;color: inherit;">
            <i class="fa fa-user"/>&nbsp;&nbsp;&nbsp;{{userName}}
          </a>
          <!-- <div class="avatar-wrapper"> -->
          <!-- img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" -->
          <!-- <i class="el-icon-caret-bottom"/> -->
          <!-- </div> -->
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown">
              <a :href="jumpToUserSettings" class="inlineBlock">
                <el-dropdown-item>
                  {{ $t('navbar.userSettings') }}
                </el-dropdown-item>
                </a>
              <a :href="homeURL" class="inlineBlock">
                <el-dropdown-item>
                  {{ $t('navbar.home') }}
                </el-dropdown-item>
              </a>
              <a :href="logoutURL" class="inlineBlock">
                <el-dropdown-item divided>
                  {{ $t('navbar.logOut') }}
                </el-dropdown-item>
              </a>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
      <li>
        <a target="_blank" title="主题设置" :href="jumpToThemeSet"><i class="fa fa-star-half-full"/></a>
      </li>
    </ul>
    <ul class="nav navbar-top-links navbar-right">
      <li v-if="todolistCount.value > 0">
        <a class="right-menu-item count-info" title="待办事项" :href="jumpToTodolistPage">
          <i class="fa fa-stack-exchange"/>{{ todolistCount }}
        </a>
      </li>
      <!--<li v-if="notificationCount.value > 0">-->
        <!--<a style="font-weight: bold;color: #fb5c5f;" title="通知消息" @click="handleNotificationCommand">-->
          <!--<i class="fa fa-bell"/>{{ notificationCount }}-->
        <!--</a>-->
      <!--</li>-->
      <li v-if="alertStats.value && alertStats.value.length > 0" style="color: #fb5c5f;">
        <el-dropdown @command="handleAlertCommand" style="display: inherit;vertical-align: inherit;">
          <span class="el-dropdown-link right-menu-item count-info" style="color: inherit;">
            <i class="fa fa-warning" :class="alertLevel"/>&nbsp;&nbsp;{{ allCount }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :key="0" :command="0">
                <span class="label info-label" style="font-weight: bold;display: inline-block; width: 250px;">
                  <el-tag :style="{ backgroundColor: 'gray', color: 'white'}">所有告警</el-tag>
                </span>
                <span class="pull-right text-muted small">{{ alertCount}}</span>
              </el-dropdown-item>
              <el-dropdown-item v-for="alert in alerts" :key="alert.level" :command="alert.level">
                <span class="label info-label fatal" style="font-weight: bold;display: inline-block; width: 250px;">
                  <el-tag :style="{ backgroundColor: alert.backgroundColor, color: alert.color}">{{ alert.title}}</el-tag>
                </span>
                <span class="pull-right text-muted small">{{ alert.count}}</span>
              </el-dropdown-item>
              <el-dropdown-item :key="-1" :command="-1">
                <a :href="resolveResumedAlertsUrl()" class="label info-label" style="font-weight: bold;display: inline-block; width: 250px; text-align: center; font-size: 18px; text-decoration: underline;">
                  今日已恢复告警
                </a>
              </el-dropdown-item>
              <el-dropdown-item :key="-2" :command="-2" @click="handleNotificationCommand">
                <span class="label info-label fatal" style="font-weight: bold;display: inline-block; width: 250px;">
                  <el-tag style="background-color: #d1dade; color: #1d1d1d;">通知消息</el-tag>
                </span>
                <span class="pull-right text-muted small" style="font-weight: bold;color: #1d1d1d;">{{ notificationCount}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
      <li style="margin-left: 5px;">
        <a class="right-menu-item count-info" title="网络设备" :href="jumpToNetworkDevicePage" target="_blank">
          <i class="fa fa-hdd-o"/>{{ networkDeviceCount }}
        </a>
      </li>
      <li>
        <a class="right-menu-item count-info" title="网络线路" :href="jumpToNetworkLinkPage" target="_blank">
          <i class="fa fa-link"/>{{ networkLinkCount }}
        </a>
      </li>
      <!-- <li v-if="device!=='mobile'">
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </li> -->
    </ul>
    <alert-cookies ref="alertCookies"></alert-cookies>
    <notifications ref="notifications"></notifications>
  </nav>
</template>

<script lang="ts" setup>
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import Hamburger from '@/components/Hamburger/index.vue';
import AlertCookies from '@/layout/components/ShowAlertCookieList.vue';
import Notifications from '@/layout/components/ShowNotifications.vue';

import { computed, onMounted, onUnmounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { AppModule } from '@/store/modules/app';
import { UserModule } from '@/store/modules/user';
import { parseTime } from '@/utils/index';

import { readNotificationCount, getAlertStats, getTaskCount, getManagedObjectCount, getTodolistCount, refreshForV36 } from '@/api/stats';

// eslint-disable-next-line no-unused-vars
class alertStat {
  level: number = 0;
  count: number = 0;
}

const route = useRoute();
const networkDeviceCount: number = ref(0);
const networkLinkCount: number = ref(0);
const todolistCount: number = ref(0);
const taskCount: number = ref(0);
const alertStats: alertStat[] = reactive([]);
const notificationStats: number = ref(0);
const alertLevels: string[] = reactive([
  '',
  'alert_info', // 1
  'alert_low', // 2
  'alert_middle', // 3
  'alert_high', // 4
  'alert_fatal', // 5
]);
const alertCookies = ref(null);
const notifications = ref(null);

const cb = () => {
  refresh();
  timer = setTimeout(cb, 10000);
};
let timer = setTimeout(cb, 10000);

// 页面销毁后 停止计时器
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
});

const sidebar = computed(() => {
  return AppModule.sidebar;
});

const avatar = computed(() => {
  if (UserModule.avatar) {
    return UserModule.avatar;
  }
  return 'img/unknown_avatar.png';
});

const device = computed(() => {
  return 'pc';
});

const alerts = computed(() => {
  const result = [
    { level: 1, title: '提示级', count: 0, color: '#F6F6F6', backgroundColor: '#86c166' },
    { level: 2, title: '低级', count: 0, color: '#9d9d9d', backgroundColor: '#00FFFF' },
    { level: 3, title: '中级', count: 0, color: '#9d9d9d', backgroundColor: '#FFFF00' },
    { level: 4, title: '高级', count: 0, color: '#F6F6F6', backgroundColor: '#FFA000' },
    { level: 5, title: '紧急级', count: 0, color: '#F6F6F6', backgroundColor: '#FF0000' },
  ];
  for (const idx in result) {
    for (const sidx in alertStats.value) {
      if (alertStats.value[sidx].level === result[idx].level) {
        result[idx].count = alertStats.value[sidx].count;
        break;
      }
    }
  }
  return result;
});

const notificationCount = computed(() => {
  if (!notificationStats) {
    return 0;
  }
  return notificationStats;
});

const alertLevel = () => {
  let level = 0;
  for (const idx in alertStats.value) {
    if (alertStats.value[idx].level > level) {
      level = alertStats.value[idx].level;
    }
  }
  return alertLevels[level];
};

const alertCount = computed(() => {
  let count = 0;
  for (const idx in alertStats.value) {
    count += alertStats.value[idx].count;
  }
  return count;
});

const allCount = computed(() => {
  let count = 0;
  for (const idx in alertStats.value) {
    count += alertStats.value[idx].count;
  }

  if (notificationStats && notificationStats.value) {
    count = count + notificationStats.value;
  }

  return count;
});

const userName = computed(() => {
  return UserModule.name;
});

const jumpToNetworkDevicePage = computed(() => {
  return getAbsoluteURL('mc/mos/index?moType=basic_network_device&active=nm.resource.device');
});

const jumpToNetworkLinkPage = computed(() => {
  return getAbsoluteURL('mc/mos/index?moType=network_link&active=nm.resource.link');
});

const jumpToTodolistPage = computed(() => {
  return getAbsoluteURL('mc/todolist');
});

const jumpToUserSettings = computed(() => {
  return getAbsoluteURL('um/xusers/edit?id=' + parseInt(UserModule.id as any).toFixed(0));
});

const jumpToThemeSet = computed(() => {
  return getAbsoluteURL('web/system_settings/theme_set');
});

const refresh = () => {
  UserModule.GetUserInfo();

  // 这个函数是为 3.6 准备的，用于刷新 cookies, 确保它不会过期
  refreshForV36().then(() => {});

  readNotificationCount().then((count: any) => {
    notificationStats.value = parseInt(count);
  });
  getAlertStats().then((response: any) => {
    if (Array.isArray(response)) {
      alertStats.value = response;
    } else {
      var stats = [];
      for (const v in response) {
        stats.push({ level: parseInt(v), count: response[v] });
      }
      alertStats.value = stats;
    }
  });
  getTaskCount().then((response: any) => {
    if (typeof response === 'object') {
      taskCount.value = response.value;
    } else {
      taskCount.value = response;
    }
  });
  getTodolistCount().then((response: any) => {
    if (typeof response === 'object') {
      todolistCount.value = response.value;
    } else {
      todolistCount.value = response;
    }
  });
  getManagedObjectCount('network_device').then((response: any) => {
    networkDeviceCount.value = response.data;
  });
  getManagedObjectCount('network_link').then((response: any) => {
    networkLinkCount.value = response.data;
  });
};
refresh();

const handleAlertCommand = (level: number) => {
  if (alertCookies && alertCookies.value && level !== -1 && level !== -2) {
    alertCookies.value.show(level);
  }
};

const handleNotificationCommand = (level: number) => {
  if (notifications && notifications.value) {
    notifications.value.show();
  }
};

const toggleSideBar = () => {
  AppModule.ToggleSideBar(false);
};

const homeURL = computed(() => {
  return getAbsoluteURL('home');
});

const logoutURL = computed(() => {
  return getAbsoluteURL('sso/logout');
});

const logout = () => {
  UserModule.LogOut().then(() => {
    const urlPrefix = (window as any).urlPrefix;
    const appPrefix = (window as any).appPrefix;

    if (urlPrefix.endsWith('/')) {
      location.replace(urlPrefix + 'sessions/logout?service=' + appPrefix + route.fullPath);
    } else {
      location.replace(urlPrefix + '/sessions/logout?service=' + appPrefix + route.fullPath);
    }
    // // 为了重新实例化vue-router对象 避免bug
    // location.reload();
  });
};

const getAbsoluteURL = (urlstr: string): string => {
  const urlPrefix = (window as any).urlPrefix;
  if (urlPrefix.endsWith('/')) {
    return urlPrefix + urlstr;
  } else {
    return urlPrefix + '/' + urlstr;
  }
};

const resolveResumedAlertsUrl = () => {
  const prefix = (window as any).urlPrefix;
  const d = parseTime(new Date().getTime(), '{y}-{m}-{d} 00:00:00');
  return prefix + 'mc/AlertEvents/ViewResumedAlerts?active=nm.alert.log&init_resume_start=' + d;
};
</script>
