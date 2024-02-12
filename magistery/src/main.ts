import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueI18n from './language';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import 'normalize.css';
import 'element-plus/theme-chalk/index.css';
import '@/styles/app.scss';
import '@/styles/list-view.scss';
import '@/styles/form-view.scss';
import '@/styles/font-awesome/scss/font-awesome.scss';
import '@/styles/index.scss';

import '@/permission';

import locale from 'element-plus/lib/locale/lang/zh-cn';
import cronElementPlus from '@vue-js-cron/element-plus';
import '@vue-js-cron/element-plus/dist/element-plus.css';
import noVue3Cron from 'no-vue3-cron';
import 'no-vue3-cron/lib/noVue3Cron.css';

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus, { size: 'default', zIndex: 3000, locale: locale }).use(store as any).use(router as any).use(VueI18n as any).use(cronElementPlus).use(noVue3Cron).mount('#app');
