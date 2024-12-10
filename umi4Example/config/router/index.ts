// export default [
//     { exact: true, path: '/', component: 'index' },
// ];
import { Component } from 'react'
import CSSworld from './CSSworld/index.route'
import UmiExample from './UmiExample/index.route'
import Layout from '@/.umi/plugin-layout/Layout'
import { layout } from '@/app'

const routes = [
	// {
	// 	path: '/',
	// 	redirect: '/home',
	// },
	// {
	//     path: '/home',
	// 	title: 'menu.home',
	// 	component: '@/pages',   
	// },
	{
		path: '/alayout',
		component: '@/layouts/a-layout',
		layout: false,
		routes: [
			{
				path: 'child1',
				component: '@/pages/a/buss1',
				exact: true,
			}
		]
	},
	...CSSworld,
	...UmiExample
]

export default routes