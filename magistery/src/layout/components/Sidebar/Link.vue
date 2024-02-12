<template>
  <a v-if="isExternalLink(to)" :href="to" :target="isNewWindow ? '_blank' : '_self'" :rel="isNewWindow?'opener':'noopener'">
    <slot/>
  </a>
  <router-link v-else :to="to" @click="linkClick()">
    <slot/>
  </router-link>
</template>

<script lang="ts" setup>
import { Prop } from 'vue-property-decorator';
import { defineProps, defineEmits } from 'vue';
import { isExternal } from '@/utils/validate';
import settings from '@/settings';

defineProps({
  to: {
    default: true,
    required: true,
  },
  isNewWindow: {
    default: true,
    required: true,
  },
});

const emit = defineEmits(['link-click']);

const linkClick = () => {
  emit('link-click');
};

const isExternalLink = (routePath: string) => {
  if (isExternal(routePath)) {
    return true;
  }
  if (routePath === '#' || routePath === '') {
    return false;
  }
  if (routePath.startsWith(settings.urlPrefix)) {
    return true;
  }
  return true;
};
</script>
