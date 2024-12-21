import { defineConfig } from '@umijs/max';
import routes from "./config/router";

const {npm_lifecycle_event = ''} = process.env;
console.log('npm_lifecycle_event',npm_lifecycle_event)

export default defineConfig({
  valtio: {},
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  define: { FOO: 'bar' },
  layout: {
    title: '@umijs/max',
  },
  locale: {
    // 默认使用 src/locales/zh-CN.ts 作为多语言文件
    default: 'zh-CN',
    baseSeparator: '-',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
    ...routes,
  ],
  npmClient: 'pnpm',
});

