// export default [
//     { exact: true, path: '/', component: 'index' },
// ];
import CSSworld from './CSSworld/index.route'

const routes = [
    {
		path: '/',
		redirect: '/home',
	},
    // {
    //     path: '/home',
	// 	title: 'menu.home',
	// 	component: '@/pages',   
    // },
	...CSSworld
]

export default routes