import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
// eslint-disable-next-line no-unused-vars
import { RouteRecordRaw } from 'vue-router';
import { constantRoutes } from '@/router';
import store from '@/store';
import { getRouters } from '@/api/menu';
import Layout from '@/layout/Layout.vue';
import settings from '@/settings';

export const loadView = (view: string) => { // 路由懒加载
  return () => import(`@/views/${view}`);
};

// 遍历后台传来的路由字符串，转换为组件对象
export const filterAsyncRoutes = (routes: any[], parent?: RouteRecordRaw): RouteRecordRaw[] => {
  return routes.map((route: any): RouteRecordRaw => {
    // UID        string `json:"uid,omitempty" xorm:"uid notnull"`
    // Title      string `json:"title,omitempty" xorm:"title notnull"`
    // Permission string `json:"permission,omitempty" xorm:"permission"`
    // License    string `json:"license,omitempty" xorm:"license"`
    // URL        string `json:"url,omitempty" xorm:"url"`
    // Icon       string `json:"icon,omitempty" xorm:"icon"`
    // Classes    string `json:"classes,omitempty" xorm:"classes"`

    const result: RouteRecordRaw = {
      path: route.url,
      name: route.uid,
      redirect: '',
      // alias: route.alias,
      meta: { title: route.title, icon: route.icon },
    };

    // nm.jzzs /hengwei/v_debug/#/demo/hongqiao?app=default
    if (!result.path) {
      result.path = '/' + (result.name as string);
    } else if (result.path.startsWith(settings.appPrefix)) {
      result.path = result.path.substring(settings.appPrefix.length);
    } else if (!result.path.startsWith('/')) {
      result.path = '/';
    }
    if (route.children && route.children.length) {
      result.children = filterAsyncRoutes(route.children, result);
    } else {
      if (parent) {
        Reflect.set(parent, 'component', Layout);
      }
    }
    return result;
  });
};

const appComponents = (menuList: RouteRecordRaw[]): RouteRecordRaw[] | undefined => {
  if (!menuList) {
    return [];
  }
  if (menuList.length <= 1) {
    return [];
  }
  for (const menu of menuList) {
    if (menu.meta && !menu.meta.hidden) {
      if (menu.name !== 'app.products') {
        continue;
      }
      if (menu.children && menu.children.length <= 1) {
        return [];
      }
      return menu.children;
    }
  }
  return [];
};

export interface IPermissionState {
  routes: RouteRecordRaw[]
  dynamicRoutes: RouteRecordRaw[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteRecordRaw[] = [];
  public dynamicRoutes: RouteRecordRaw[] = [];

  get HasRoutes(): boolean {
    return this.dynamicRoutes && this.dynamicRoutes.length > 0;
  }

  get Routes(): RouteRecordRaw[] {
    if (this.routes) {
      return this.routes;
    }
    return [];
  }

  get Components(): RouteRecordRaw[] | undefined {
    if (this.routes) {
      return appComponents(this.routes);
    }
    return [];
  }

  @Action({ commit: 'SET_ROUTES', rawError: true })
  public async GenerateRoutes() {
    // 向后端请求路由数据
    const res = await getRouters((window as any).defaultAppID);
    if (!res) {
      throw new Error('返回无效菜单');
    }
    const accessedRoutes = filterAsyncRoutes(res);
    accessedRoutes.push({
      path: '/:pathMatch(.*)',
      redirect: '/404',
      meta: { hidden: true },
    });
    return accessedRoutes;
  }

  @Action({ commit: 'SET_ROUTES', rawError: true })
  public async ClearRoutes() {
    const results: RouteRecordRaw[] = [];
    return results;
  }

  @Mutation
  private SET_ROUTES(routes: RouteRecordRaw[]) {
    this.routes = constantRoutes.concat(routes);
    this.dynamicRoutes = routes;
  }
}

export const PermissionModule = getModule(Permission);
