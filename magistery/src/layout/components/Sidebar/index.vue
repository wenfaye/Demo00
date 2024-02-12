<template>
  <nav :class="[{'has-logo':showLogo}, 'navbar-default', 'navbar-static-side']" role="navigation">
    <!-- <div class="sidebar-collapse"> -->
    <!-- div :class="{'has-logo':showLogo}" -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%;width:calc(100% + 1px);">
      <el-menu
        id="side-menu"
        unique-opened
        class="nav metismenu"
        :show-timeout="200"
        :default-active="$route.path"
        :active-path="$route.path"
        :collapse="isCollapse"
        mode="vertical"
      >
        <sidebar-item v-if="backEntryVisible" id="backEntry" key="backEntry" :item="{meta:backEntry,hidden:false,path:'#'}" :collapse="collapse" @item-click="backToAppSelect"/>
        <template v-for="route in routes">
          <template v-if="!backEntry.visible && route.name === 'app.products'">
            <sidebar-item v-for="child in route.children" :key="child.path" :item="child" :base-path="child.path" :collapse="collapse" />
          </template>
          <sidebar-item v-if="backEntry.visible && route.name !== 'app.products'" :key="route.path" :item="route" :base-path="route.path" :collapse="collapse" />
        </template>
      </el-menu>
    </el-scrollbar>
    <!-- </div> -->
  </nav>
</template>

<script lang="ts" setup>
import { defineProps, computed, reactive } from 'vue';
import { AppModule } from '@/store/modules/app';
import { PermissionModule } from '@/store/modules/permission';
import SidebarItem from './SidebarItem.vue';
// import request from '@/utils/request';
import { AxiosResponse } from 'axios';
import { MenuItem, normalizeMenuItems } from './types';
import Logo from './logo.vue';
import { RouteRecordRaw } from 'vue-router';

defineProps({
  collapse: {
    type: Boolean,
    default: false,
  },
});

const backEntry: MenuItem = reactive({
  uid: 'backEntry',
  title: '返回',
  permission: undefined,
  url: undefined,
  icon: 'fa-mail-reply',
  classes: 'landing_link',
  children: [],
  divided: undefined,
  visible: true,
});

const backToAppSelect = () => {
  backEntry.visible = false;
};

const backEntryVisible = computed(() => {
  if (!backEntry.visible) {
    return false;
  }

  return PermissionModule.Components.length > 0;
});

const logoURL = computed(() => {
  const urlPrefix = (window as any).urlPrefix;
  if (urlPrefix.endsWith('/')) {
    return urlPrefix + 'internal/custom_resources/images/logo.png';
  } else {
    return urlPrefix + '/internal/custom_resources/images/logo.png';
  }
});

const sidebar = computed(() => {
  return AppModule.sidebar;
});

const routes = computed(() => {
  const menuList = PermissionModule.Routes;
  return menuList.filter((item) => {
    return !item.meta || !item.meta.hidden;
  });
});

const components = computed(() => {
  return PermissionModule.Components;
});

const isCollapse = computed(() => {
  return !sidebar.value.opened;
});

const showLogo = computed(() => {
  return true;
});

</script>
