import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'


// var externalURLBase = 'http://127.0.0.1:8085'
// const externalURLBase = `${window.location.protocol}//${window.location.hostname}:8085`
const externalURLBase = `${window.location.protocol}//${window.location.host}`

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    path: externalURLBase +'/client/index.html#/home',
    meta: { title: '首页', icon: 'el-icon-s-home'}
  },
  {
    path: '/resource-manage',    
    component: Layout,
    name: 'ResourceManage',
    meta: { title: '资源管理', icon: 'el-icon-s-help'},
    children: [
              {
                path: '/permissionManagement',
                name: "PermissionManagement",
                component: () => import('@/views/example/PermissionManagement'),
                meta: {
                  title: "权限管理"
                }
              },
              {
                path: '/dangerousOperationLog',
                name: "DangerousOperationLog",
                component: () => import('@/views/example/DangerousOperationLog'),
                meta: {
                  title: "危险操作日志"
                }
              },
              {
                path: '/abnormalLoginAlarm',
                component: () => import('@/views/example/AbnormalLoginAlarm'),
                name: "AbnormalLoginAlarm",
                meta: {
                  title: "异常登录告警"
                }
              },
              {
                path: '/edit-prmissions/:id',
                component: () => import('@/views/example/EditPermissions'),
                name: "EditPermissions",
                meta: {
                  title: "编辑权限"
                },
                hidden: true,
                // props(route){
                //   const {id} = route.params;
                //   return{
                //     id
                //   }
                // }
              },
              {
                path: '/alarm-graph',
                component: () => import('@/views/example/AlarmGraph'),
                name: "AlarmGraph",
                meta: {
                  title: "曲线图"
                },
                hidden: true,
              },
              {
                path: externalURLBase + "/client/index.html#/resource-manage/access-point",
                name: "AccessPoint",
                meta: {
                  title: "安全接入点"
                }
              },
              {
                path: externalURLBase + "/client/index.html#/resource-manage/audit-instrument",
                name: "AuditInstrument",
                meta: {
                  title: "安全准入装置"
                }
              }, {
                path: externalURLBase + "/client/index.html#/resource-manage/receiving-terminal",
                name: "ReceivingTerminal",
                meta: {
                  title: "授信终端"
                }
              }, {
                path: externalURLBase + "/client/index.html#/resource-manage/integrated-instrument",
                name: "Integrated",
                meta: {
                  title: "一体化设备"
                }
              }, {
                path: externalURLBase + "/client/index.html#/resource-manage/access-point-temp",
                name: "AccessPointTemp",
                meta: {
                  title: "临时接入点"
                }
              }]
  },
  {
              path: "/personnel-manage",
              redirect: "/personnel-manage/visit",
              name: "PersonnelManage",
              meta: {
                title: "人员管理",
                icon: "peoples"
              },
              children: [{
                path: externalURLBase + "/client/index.html#/personnel-manage/visit",
                name: "Visit",
                meta: {
                  title: "调度操作员"
                }
              }, {
                path: externalURLBase + "/client/index.html#/personnel-manage/manage",
                name: "Manage",
                meta: {
                  title: "集控管理员"
                }
              }]
  },
  {
              path: "/audit-manage",
              component: Layout,
              children: [{
                path: '/audit-manage',
                component: () => import('@/views/example/AuditManage'),
                // path: externalURLBase + "/client/index.html#/audit-manage/index",
                name: "AuditManage",
                meta: {
                  title: "终端审核",
                  icon: "el-icon-s-check"
                }
              }]
  },
  {
              path: "/log-report",
              component: Layout,
              redirect: "/log-report/admin",
              name: "LogReport",
              meta: {
                title: "日志报表",
                icon: "el-icon-s-order"
              },
              alwaysShow: !0,
              children: [{
                path: externalURLBase + "/client/index.html#/log-report/admin",
                name: "Admin",
                meta: {
                  title: "集控操作日志"
                }
              }, {
                path: externalURLBase + "/client/index.html#/log-report/access-point",
                name: "LogReportAccessPoint",
                meta: {
                  title: "安全接入点访问日志"
                }
              }, {
                path: externalURLBase + "/client/index.html#/log-report/access-blocking",
                name: "AccessBlocking",
                meta: {
                  title: "访问拦截日志"
                }
              }, {
                path: externalURLBase + "/client/index.html#/log-report/data-report",
                name: "DataReport",
                meta: {
                  title: "数据报表"
                }
              }]
  },
  {
              path: "/other-tools",
              component: Layout,
              redirect: "/other-tools/Ping",
              name: "OtherTools",
              meta: {
                title: "测试工具",
                icon: "el-icon-s-platform"
              },
              alwaysShow: !0,
              children: [{
                path: externalURLBase + "/client/index.html#/other-tools/Ping",
                name: "Ping",
                meta: {
                  title: "Ping"
                }
              }, {
                path: externalURLBase + "/client/index.html#/other-tools/Telnet",
                name: "Telnet",
                meta: {
                  title: "Telnet"
                }
              }]
  },
  {
              path: "/system",
              component: Layout,
              redirect: "/system/route",
              name: "System",
              meta: {
                title: "系统设置",
                icon: "el-icon-s-tools"
              },
              alwaysShow: !0,
              children: [{
                path: externalURLBase + "/client/index.html#/system/route",
                name: "Route0",
                meta: {
                  title: "访问设置"
                }
              }, {
                path: externalURLBase + "/client/index.html#/system/route",
                name: "Route",
                meta: {
                  title: "路由设置"
                }
              }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    hidden: true,
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/icon',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'el-icon-s-help'
    },
    hidden: true,
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    hidden: true,
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    hidden: true,
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'Zip', icon: 'zip' },
    hidden: true,
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'Export Zip' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'Theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  }

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/log-report', hidden: true }
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router