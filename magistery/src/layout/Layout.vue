<template>
  <div :class="classObj" id="wrapper">
    <div v-if="classObj.mobile && sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container" :collapse="classObj.hideSidebar"/>
    <div id="page-wrapper" class="main-container gray-bg">
      <navbar/>
      <app-main/>
      <foot/>
    </div>
  </div>
</template>

<script lang="ts">
import { Navbar, AppMain, Sidebar, Foot } from './components';
import ResizeMixin from './mixin/ResizeHandler';
import { Vue, Options } from 'vue-class-component';
import { DeviceType, AppModule } from '@/store/modules/app';

@Options({
  components: {
    Navbar,
    Foot,
    Sidebar,
    AppMain,
  },
})
export default class Layout extends Vue {
  get classObj() {
    return {
      hideSidebar: !AppModule.sidebar.opened,
      openSidebar: AppModule.sidebar.opened,
      'mini-navbar': !AppModule.sidebar.opened,
      withoutAnimation: AppModule.sidebar.withoutAnimation,
      mobile: AppModule.device === DeviceType.Mobile,
    };
  }

  private handleClickOutside() {
    AppModule.CloseSideBar(false);
  }
}
</script>
