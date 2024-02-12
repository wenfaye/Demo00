<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span v-if="item.redirect === 'noredirect' || index == breadcrumbs.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import { RouteRecord, useRoute, useRouter } from 'vue-router';
import pathToRegexp from 'path-to-regexp';

export default defineComponent({
  setup() {
    let breadcrumbs: RouteRecord[] = [];

    const route = useRoute();
    const router = useRouter();
    watch(
      () => router.currentRoute.value,
      () => getBreadcrumb(),
    );

    onMounted(() => {
      getBreadcrumb();
    });

    const getBreadcrumb = () => {
      const matched = route.matched.filter((item) => item.name);
      breadcrumbs = matched.filter((item) => {
        return item.meta && item.meta.title && item.meta.breadcrumb !== false;
      });
    };

    const pathCompile = (path: string) => {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = route;
      const toPath = pathToRegexp.compile(path);
      return toPath(params);
    };

    const handleLink = (item: any) => {
      const { redirect, path } = item;
      if (redirect) {
        router.push(redirect);
      } else {
        router.push(pathCompile(path));
      }
    };

    return {
      breadcrumbs,
    };
  },
});
</script>

<style lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;

    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
