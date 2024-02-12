import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export interface SiteQueryParams {
  offset: number,
  limit: number,
}

export interface PowerSiteBiz {
  device_id: number,
  device_port_id: number,
  biz_id: string,
  biz_address: string,
  description: string,
}

export const createSite = (data: any): Promise<any> =>
  request({
    url: '/v3/3td/anhui/power_sites',
    method: 'post',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const getSite = (id: any): Promise<any> =>
  request({
    url: '/v3/3td/anhui/power_sites/' + id,
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const updateSite = (id: any, data: any): Promise<any> =>
  request({
    url: '/v3/3td/anhui/power_sites/' + id + '?override=true',
    method: 'put',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const deleteSite = (id: any): Promise<any> =>
  request({
    url: '/v3/3td/anhui/power_sites/' + id,
    method: 'delete',
  }).then((response: AxiosResponse<any>) => response.data);

export const fetchSites = (): Promise<any> =>
  request({
    url: '/v3/3td/anhui/power_sites',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const getDeviceInfo = (id: any): Promise<any> =>
  request({
    url: '/v3/3td/anhui/devices/' + id,
    method: 'get',
    timeout: 300000,
  }).then((response: AxiosResponse<any>) => response.data);

export const getRouteInfo = (id: any): Promise<any> =>
  request({
    url: '/v3/3td/anhui/routers/' + id,
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const setDevice = (id: any, role: string, deviceId: number, description: string): Promise<any> =>
  request({
    url: '/v3/3td/anhui/power_sites/' + id + '/devices',
    method: 'put',
    data: { role: role, device_id: deviceId, description: description },
  }).then((response: AxiosResponse<any>) => response.data);

export const setBiz = (id: any, biz: PowerSiteBiz): Promise<any> =>
  request({
    url: '/v3/3td/anhui/power_sites/' + id + '/bizs',
    method: 'put',
    data: biz,
  }).then((response: AxiosResponse<any>) => response.data);

export const readAlertStat = (): Promise<any> =>
  request({
    url: '/3td/anhui/power_sites/alert_stat',
  }).then((response: AxiosResponse<any>) => response.data);

export const checkView = (id: any): Promise<any> =>
  request({
    url: '/../rest/power_sites/' + id + '/check_view',
    method: 'post',
  }).then((response: AxiosResponse<any>) => response.data);

export const refreshView = (ids: any): Promise<any> =>
  request({
    url: '/../rest/power_sites/' + ids + '/refresh_view',
    method: 'post',
  }).then((response: AxiosResponse<any>) => response.data);

export const testParam = (t: String, d: any): Promise<any> =>
  request({
    url: '/../s/test/' + t,
    method: 'get',
    params: d,
  }).then((response: AxiosResponse<any>) => response.data);
