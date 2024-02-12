<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.app-main {
  background-color: #ffffff;
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 45px;
}
</style>
