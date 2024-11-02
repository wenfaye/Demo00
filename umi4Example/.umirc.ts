import { defineConfig } from '@umijs/max';
import routes from './config/router'
import {theme} from "antd";

const {npm_lifecycle_event = ''} = process.env;
const otherEnvList = ['pp', 'pro', 'pp:gray', 'pro:gray'];

const baseUrl: string = otherEnvList.includes(npm_lifecycle_event) ? '/nibank/' : '/'

export default defineConfig({
  access: {},
  model: {},
  initialState: {},
  request: {},
  define: { FOO: 'bar' },
  plugins: [
		// './plugins/pwa'
	],
	// pwa: {
	// 	hash: true,
	// 	autoRefresh: true,
	// 	workboxOptions: {
	// 		navigateFallback: `${baseUrl}index.html`
	// 	}
	// },
	copy: ['public/robots.txt'],
	dva: false,
	antd: {
		import: false,
	},
  layout: {
    // title: '@umijs/max',
    locale: true,
    title:'Example',
  },
  favicons: [
    '/favicons.ico'
  ],
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
    // {
    //   name: '权限演示',
    //   path: '/access',
    //   component: './Access',
    // },
    // {
    //   name: ' CRUD 示例',
    //   path: '/table',
    //   component: './Table',
    // },
    ...routes
  ],
  npmClient: 'yarn',
});

