/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


declare module 'element-plus/lib/locale/lang/en' {
  const elementEnLocale: any;
  export default elementEnLocale;
}

declare module 'element-plus/lib/locale/lang/es' {
  const elementEsLocale: any;
  export default elementEsLocale;
}

declare module 'element-plus/lib/locale/lang/zh-CN' {
  const elementZhLocale: any;
  export default elementZhLocale;
}

declare module '@vue-js-cron/element-plus';

declare module 'no-vue3-cron';
