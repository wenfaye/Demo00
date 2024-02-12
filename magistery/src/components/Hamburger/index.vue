<template>
  <a class="navbar-minimalize minimalize-style-2 btn btn-primary " @click="toggleClick"><i style="width: 12px; height: 14px;font-size: 14px;" class="fa fa-bars"/> </a>

  <!-- <div :class="[{'is-active': isActive}, 'hamburger-container', 'navbar-minimalize', 'minimalize-style-2']" @click="toggleClick">
    <svg-icon name="hamburger" width="20" height="20" />
  </div> -->
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator';
import { Vue } from 'vue-class-component';

export default class Hamburger extends Vue {
  @Prop({ default: false }) private isActive!: boolean;
  @Prop({ default: null }) private toggleClick!: () => void;
}
</script>
