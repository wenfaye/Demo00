<template>
  <el-menu-item
    v-if="!hasSubMenu() && !(item.meta && item.meta.title === 'divider')"
    :index="resolveIndex(onlyOneChild.path, item.meta)"
    :index-id="resolveIndex(onlyOneChild.path, item.meta)"
    :class="classNames">
    <app-link :to="onlyOneChild.path === '#' ? '' : resolvePath(onlyOneChild.path)" :is-new-window="isNewWindow" @link-click="itemClick()">
      <i v-if="onlyOneChild.meta && onlyOneChild.meta.icon" :class="['fa', onlyOneChild.meta.icon]"/>
      <i v-else-if="item.meta && item.meta.icon" :class="['fa', item.meta.icon]"/>
      <span v-if="onlyOneChild.meta && onlyOneChild.meta.title" class="nav-label">{{onlyOneChild.meta.title}}</span>
      <span v-else-if="item.meta && item.meta.title" class="nav-label">{{item.meta.title}}</span>
    </app-link>
  </el-menu-item>
  <el-sub-menu v-else-if="hasSubMenu()" :index="resolveIndex(item.path, item.meta)" :index-id="resolveIndex(item.path, item.meta)" :class="classNames" teleported>
    <template #title>
      <i v-if="item.meta && item.meta.icon" :class="['fa', item.meta.icon]"/>
      <span v-if="item.meta && item.meta.title" slot="title">{{item.meta.title}}</span>
    </template>
    <sidebar-item
      v-for="child in children"
      :level="level + 1"
      :is-nest="true"
      :item="child"
      :key="child.path"
      :base-path="resolvePath(child.path)"
      :collapse="collapse"
      class="nest-menu"/>
  </el-sub-menu>
  <li class="divider" v-else/>
  <!-- </div> -->
</template>

<script lang="ts" setup>
import path from 'path';
import { RouteRecordRaw } from 'vue-router';
import { defineProps, defineEmits, computed, ref } from 'vue';
import { isExternal } from '@/utils/validate';
import AppLink from './Link.vue';
import settings from '@/settings';

const props = defineProps({
  item: {
    type: RouteRecordRaw,
    required: true,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
  collapse: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: '',
  },
  level: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(['item-click']);

const onlyOneChild: RouteRecordRaw | null = ref(null);

const itemClick = () => {
  emit('item-click');
};

const menuLevel = computed(() => {
  switch (this.level) {
    case 2:
      return 'nav-second-level';
    case 3:
      return 'nav-third-level';
  }
  return '';
});

const hasSubMenu = () => {
  const showingChildren = children.value;

  if (!showingChildren || showingChildren.length === 0) {
    onlyOneChild.value = props.item;
    return false;
  }
  if (showingChildren && showingChildren.length === 1) {
    onlyOneChild.value = showingChildren[0];
    return false;
  }

  onlyOneChild.value = null;
  return true;
};

const classNames = computed(() => {
  const names = ['app-menu', menuLevel];
  if (props.item && props.item.meta && props.item.meta.classes && (props.item.meta.classes as any).length > 0) {
    names.push(props.item.meta.classes as string);
  }
  return names;
});

const isNewWindow = computed(() => {
  if (props.item && props.item.meta && props.item.meta.classes && typeof props.item.meta.classes !== 'undefined') {
    if ((props.item.meta.classes as string).indexOf('new-window') >= 0) {
      return true;
    }
  }
  return false;
});

const children = computed(() => {
  if (!props.item.children) {
    return null;
  }
  return props.item.children.filter((item) => {
    return !item.meta || !item.meta.hidden;
  });
});

const resolvePath = (routePath: string) => {
  if (isExternal(routePath)) {
    return routePath;
  }

  if (routePath.startsWith(settings.urlPrefix)) {
    return routePath;
  }
  if (routePath.startsWith('/')) {
    routePath = routePath.substring('/'.length);
  }
  return path.resolve(settings.appPrefix, routePath);
};

const resolveIndex = (routePath: string, meta: any) => {
  return routePath;
  // if (meta && meta.index) {
  //   return meta.index;
  // }
  //
  // if (isExternal(routePath)) {
  //   return routePath;
  // }
  //
  // if (routePath.startsWith(settings.urlPrefix)) {
  //   return routePath;
  // }
  // if (routePath.startsWith('/')) {
  //   routePath = routePath.substring('/'.length);
  // }
  // return path.resolve(settings.appPrefix, routePath);
};
</script>
