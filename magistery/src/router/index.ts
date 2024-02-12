import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TableView from '../views/TableView.vue';
import classSpecRouter from '@/router/modules/class_specs';
import listPageLayoutRouter from '@/router/modules/list_page_layouts';
import formPageLayoutRouter from '@/router/modules/property_page_layouts';
import managedMoldsRouter from '@/router/modules/managed_molds';
import Layout from '@/layout/Layout.vue';
import NoLayout from '@/layout/NoLayout.vue';

export const constantRoutes: RouteRecordRaw[] = [
  // managedMoldsRouter,
  // classSpecRouter,
  // formPageLayoutRouter,
  // listPageLayoutRouter,
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { hidden: true },
  },
  {
    path: '/table',
    name: 'table',
    component: TableView,
    meta: { hidden: true },
  },
  // {
  //   path: '/odfs',
  //   component: Layout,
  //   meta: { hidden: true, noCache: true },
  //   children: [
  //     // {
  //     //   path: '',
  //     //   name: '光纤管理',
  //     //   component: () => import('@/views/Odfs/List.vue'),
  //     // },
  //     {
  //       path: '/odfs/new',
  //       name: '编辑',
  //       component: () => import('@/views/Odfs/Property.vue'),
  //     },
  //     {
  //       path: '/odfs/:id',
  //       name: '新建',
  //       component: () => import('@/views/Odfs/Property.vue'),
  //     },
  //   ],
  // },
  {
    path: '/list',
    component: Layout,
    meta: { hidden: true, noCache: true },
    children: [
      {
        path: '',
        name: '列表',
        component: () => import('@/views/List.vue'),
      },
    ],
  },
  {
    path: '/formio',
    component: Layout,
    meta: { hidden: true, noCache: true },
    children: [
      {
        path: '',
        name: 'Formio',
        component: () => import('@/views/Formio.vue'),
        meta: { title: 'Formio测试', noCache: true },
      },
    ],
  },
  // {
  //   path: '/demo',
  //   name: 'demo',
  //   component: Layout,
  //   meta: { title: '页面演示', noCache: true },
  //   children: [
  //     {
  //       path: '/demo/fiber_cables',
  //       name: 'fiber_cables',
  //       component: () => import('@/views/Demo/FiberCables.vue'),
  //       meta: { title: '机房光缆管理', noCache: true },
  //     },
  //   ],
  // },
  // {
  //   path: '/list',
  //   name: 'list',
  //   component: Layout,
  //   meta: { title: '设备管理(El)', noCache: true },
  //   children: [
  //     {
  //       path: '/list/index',
  //       name: 'list_index',
  //       component: () => import('@/views/ListView.vue'),
  //       meta: { title: '设备列表(El)', noCache: true },
  //     },
  //   ],
  // },
  // {
  //   path: '/list_ag',
  //   name: 'list_ag',
  //   component: Layout,
  //   meta: { title: '设备管理(AG)', noCache: true },
  //   children: [
  //     {
  //       path: '/list_ag/index',
  //       name: 'list_ag_index',
  //       component: () => import('@/views/ListViewWithAgGrid.vue'),
  //       meta: { title: '设备列表(AG)', noCache: true },
  //     },
  //   ],
  // },
  {
    path: '/new_devices',
    name: 'new_devices',
    component: Layout,
    meta: { title: '新发现设备', hidden: true, noCache: true },
    children: [
      {
        path: '/new_devices/poll',
        name: 'new_devices_poll',
        component: () => import('@/views/NewDevices/PollDevices.vue'),
        meta: { title: '轮询设置', noCache: true },
      },
      {
        path: '/new_devices/list',
        name: 'new_devices_list',
        component: () => import('@/views/NewDevices/ListDevices.vue'),
        meta: { title: '轮询结果', noCache: true },
      },
      {
        path: '/new_devices/new',
        name: 'new_devices_new',
        component: () => import('@/views/NewDevices/NewDevices.vue'),
        meta: { title: '新增设备', noCache: true },
      },
      {
        path: '/new_devices/ignore',
        name: 'new_devices_ignore',
        component: () => import('@/views/NewDevices/IgnoreDevices.vue'),
        meta: { title: '忽略设备', noCache: true },
      },
    ],
  },
  {
    path: '/power_sites',
    name: 'power_sites',
    component: Layout,
    meta: { title: '变电站管理', noCache: true, hidden: true },
    children: [
      {
        path: 'overview',
        name: 'power_sites_overview',
        component: () => import('@/views/PowerSites/Overview.vue'),
        meta: { title: '总览', noCache: true },
      },
      {
        path: 'index',
        name: 'power_sites_index',
        component: () => import('@/views/PowerSites/List.vue'),
        meta: { title: '列表', noCache: true },
      },
      {
        path: 'new',
        name: 'power_sites_new',
        component: () => import('@/views/PowerSites/New.vue'),
        meta: { title: '新建', noCache: true },
      },
      {
        path: ':id',
        name: 'power_sites_edit',
        component: () => import('@/views/PowerSites/Edit.vue'),
        meta: { title: '编辑', noCache: true },
      },
      {
        path: 'access_permissions',
        name: 'power_sites_access_permissions',
        component: () => import('@/views/PowerSites/AccessPermissions.vue'),
        meta: { title: '厂站访问权限设置', noCache: true },
      },
    ],
  },
  {
    path: '/access_applications',
    name: 'access_applications',
    component: Layout,
    meta: { title: '数据接入网审核', noCache: true, hidden: true, index: 'access_applications' },
    children: [
      {
        path: '/access_applications/my_requests',
        name: 'my_requests',
        component: () => import('@/views/AccessApplications/MyRequests.vue'),
        meta: { title: '我的申请', noCache: true, index: 'access_applications.my_requests' },
      },
      {
        path: '/access_applications/approving',
        name: 'approving',
        component: () => import('@/views/AccessApplications/Approving.vue'),
        meta: { title: '待审核', noCache: true, index: 'access_applications.approving' },
      },
      {
        path: '/access_applications/approved',
        name: 'approved',
        component: () => import('@/views/AccessApplications/Approved.vue'),
        meta: { title: '已审核', noCache: true, index: 'access_applications.approved' },
      },
      {
        path: '/access_applications/allocated',
        name: 'allocated',
        component: () => import('@/views/AccessApplications/Allocated.vue'),
        meta: { title: '已分配地址', noCache: true, index: 'access_applications.allocated' },
      },
      {
        path: 'access_applications_divider',
        name: 'access_applications_divider',
        component: Layout,
        meta: { title: 'divider', noCache: true },
      },
      {
        path: '/access_applications/address_benchmark',
        name: 'address_pool',
        component: () => import('@/views/AccessApplications/AddressBenchmark.vue'),
        meta: { title: '地址规划', noCache: true, index: 'access_applications.address_benchmark' },
      },
      // {
      //   path: '/access_applications/address_pool',
      //   name: 'address_pool',
      //   component: () => import('@/views/AccessApplications/AddressPool.vue'),
      //   meta: { title: '地址总表', noCache: true, index: 'access_applications.address_pool' },
      // },
      // {
      //   path: '/access_applications/allocation',
      //   name: 'allocation',
      //   component: () => import('@/views/AccessApplications/IPAllocate.vue'),
      //   meta: { title: 'IP分配', noCache: true, index: 'access_applications.allocation' },
      // },
    ],
  },
  {
    path: '/computer_rooms',
    name: 'computer_rooms',
    component: Layout,
    meta: { title: '机房管理', noCache: true, hidden: true },
    children: [
      {
        path: '',
        name: 'computer_room_list',
        component: () => import('@/views/ComputerRooms/List.vue'),
        meta: { title: '机房管理', noCache: true },
      },
    ],
  },
  {
    path: '/computer_room_stat',
    name: 'computer_room_stat',
    component: Layout,
    meta: { title: '机房资源统计', noCache: true, hidden: true },
    children: [
      {
        path: '',
        name: 'computer_room_stat_view',
        component: () => import('@/views/ComputerRoomStat/View.vue'),
        meta: { title: '机房资源统计', noCache: true },
      },
    ],
  },
  {
    path: '/power_sockets',
    name: 'power_sockets',
    component: Layout,
    meta: { title: '机柜电源管理', noCache: true, hidden: true },
    children: [
      {
        path: '',
        name: 'power_socket_list',
        component: () => import('@/views/PowerSockets/List.vue'),
        meta: { title: '机柜电源管理', noCache: true },
      },
    ],
  },
  // {
  //   path: '/optic_cables',
  //   name: 'optic_cables',
  //   component: Layout,
  //   meta: { title: '光缆管理', noCache: true, hidden: true },
  //   children: [
  //     {
  //       path: '',
  //       name: 'optic_cable_list',
  //       component: () => import('@/views/OpticCables/List.vue'),
  //       meta: { title: '光缆管理', noCache: true },
  //     },
  //   ],
  // },
  {
    path: '/optical_cables',
    name: 'optical_cables',
    component: Layout,
    meta: { title: '光缆管理', noCache: true, hidden: true },
    children: [
      {
        path: '',
        name: 'optical_cable_list',
        component: () => import('@/views/OpticalCables/List.vue'),
        meta: { title: '光缆管理', noCache: true },
      },
      {
        path: 'add',
        name: 'add_optical_cable',
        component: () => import('@/views/OpticalCables/Property.vue'),
        meta: { title: '光缆属性', noCache: true },
      },
      {
        path: ':id',
        name: 'edit_optical_cable',
        component: () => import('@/views/OpticalCables/Property.vue'),
        meta: { title: '光缆属性', noCache: true },
      },
    ],
  },
  {
    path: '/demo',
    name: 'demos',
    component: Layout,
    meta: { title: '原型', noCache: true, hidden: true },
    children: [
      // {
      //   path: 'address_pool',
      //   name: 'address_pool',
      //   component: () => import('@/views/Demo/AddressPool.vue'),
      //   meta: { title: '地址池', noCache: true },
      // },
      {
        path: 'site_list',
        name: 'edit_optical_cable',
        component: () => import('@/views/Demo/SiteList.vue'),
        meta: { title: '厂站列表', noCache: true },
      },
      {
        path: 'assign_address',
        name: 'assign_address',
        component: () => import('@/views/Demo/AssignAddress.vue'),
        meta: { title: '分配地址', noCache: true },
      },
    ],
  },
  {
    path: '/pkg_design',
    name: 'pkg_designer',
    component: Layout,
    meta: { title: '设备面板视图设计', noCache: true, hidden: true },
    children: [
      {
        path: '',
        name: 'pkg_designer_view',
        component: () => import('@/views/Pkg/Designer.vue'),
        meta: { title: '设备面板视图设计', noCache: true },
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    meta: { hidden: true },
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
    meta: { hidden: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes: constantRoutes,
});

export default router;
