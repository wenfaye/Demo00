import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export const getRouters = (app: string) =>
  request({
    url: '/menu',
    method: 'get',
    params: { wrap: true, app: app },
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

const convertMenuToRouteConfig = (data: any[]) => {
  const routes: any[] = [];
  for (const idx in data) {
    const item = data[idx];
    const children = convertMenuToRouteConfig(item.children);
    routes.push({
      path: item.url,
      name: item.uid,
      // component: Component
      // redirect?: RedirectOption
      // alias?: string | string[]
      component: item.component,
      children: children,
      meta: {
        title: item.title,
        permission: item.permission,
        license: item.license,
        icon: item.icon,
        classes: item.classes,
      },
    });
  }
  return routes;
};
