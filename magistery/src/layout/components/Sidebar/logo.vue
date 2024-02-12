<template>
  <div class="sidebar-logo-container nav-header" :class="{'collapsed':collapse, 'expand':!collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logoURL" :src="logoURL" class="sidebar-logo brand">
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logoURL" :src="logoURL" class="sidebar-logo brand">
        <h1 v-show="false" class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, computed } from 'vue';

defineProps({
  collapse: {
    type: Boolean,
    default: true,
  },
});

const title = computed(() => {
  const urlPrefix = (window as any).urlPrefix;
  if (urlPrefix.endsWith('/')) {
    return urlPrefix + 'internal/custom_resources/images/logo.png';
  } else {
    return urlPrefix + '/internal/custom_resources/images/logo.png';
  }
});

const logoURL = computed(() => {
  const urlPrefix = (window as any).urlPrefix;
  if (urlPrefix.endsWith('/')) {
    return urlPrefix + 'internal/custom_resources/images/logo.png';
  } else {
    return urlPrefix + '/internal/custom_resources/images/logo.png';
  }
});
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  padding: 3px 25px 20px 25px;
  position: relative;
  width: 100%;
  /*background: #2b2f3a;*/
  /*text-align: center;*/
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display:inline-block;
    vertical-align:middle;

    & .sidebar-logo {
      left: 40px;
      top: 10px;
      width: 60px;
      height: 60px;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.expand {
    /*padding-top: 13px;*/
    height: 83px;

    .sidebar-logo {
      width: 60px;
      height: 60px;
    }
  }

  &.collapsed {
    padding-top: 13px;
    height: 65px;

    .sidebar-logo {
      width: 40px;
      height: 40px;
    }
  }
}
</style>

<style lang="scss">
  body.fixed-sidebar .mini-navbar .nav-header {
    background-color: transparent;
  }

  #wrapper .collapsed .brand {
     left: 15px;
     top: 0;
     width: 40px;
     height: 40px;
  }
</style>
