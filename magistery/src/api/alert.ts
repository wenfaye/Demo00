import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export interface QueryParams {
  offset?: number,
  limit?: number,

  level?: number,
  is_confirm?: boolean,
}

export const alertLevels = { 1: '提示级别', 2: '低级', 3: '中级', 4: '高级', 5: '紧急级' };
export const alertColors = { 1: '#86c166', 2: '#00FFFF', 3: '#FFFF00', 4: '#FFA000', 5: '#ff5900' };

export const confirmAlert = (alertId: string, data: any): Promise<any> =>
  request({
    url: '/v3/alerts/cookies/@' + alertId + '/confirm',
    method: 'PUT',
    data: data,
  }).then((response: AxiosResponse<any>) => response.data);

export const batchConfirmAlert = (data: any): Promise<any> =>
  request({
    url: 'v3/alerts/cookies/confirm',
    method: 'POST',
    data: data,
  }).then((response: AxiosResponse<any>) => response.data);

export const fetchList = (query: QueryParams): Promise<any> =>
  request({
    url: 'v3/alerts/cookies/',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => response.data);

export const fetchTree = (query: QueryParams): Promise<any> =>
  request({
    url: 'v3/alerts/cookies/tree',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => response.data);

export const fetchCount = (query: QueryParams): Promise<any> =>
  request({
    url: 'v3/alerts/cookies/count',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => response.data);

export const fetchStats = (query: QueryParams): Promise<any> =>
  request({
    url: 'v3/alerts/cookies/stats',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => response.data);

export const saveAlertExtendFields = (alertId: string, data: any): Promise<any> =>
  request({
    url: '/v3/alerts/cookies/extends/' + alertId,
    method: 'PUT',
    data: data,
  }).then((response: AxiosResponse<any>) => response.data);

export const saveAlertMark = (eventId: string, data: any): Promise<any> =>
  request({
    url: '/../ts/alerts/@' + eventId + '/mark',
    method: 'PUT',
    data: data,
  }).then((response: AxiosResponse<any>) => response.data);

export interface AggQueryParams extends QueryParams {
    tag: string,
    level?: number,
}
