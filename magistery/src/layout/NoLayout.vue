<template>
  <div id="wrapper">
      <app-main/>
  </div>
</template>

<script lang="ts">
import { AppMain } from './components';
import ResizeMixin from './mixin/ResizeHandler';
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
    AppMain,
  },
})
export default class NoLayout extends Vue {}
</script>

<style lang="scss" scoped>
  .app-main {
    top: 0;
    bottom: 0;
  }
</style>
