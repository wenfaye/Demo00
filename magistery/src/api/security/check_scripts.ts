import request from '@/utils/request';
import { useI18n } from 'vue-i18n'
import { AxiosResponse } from 'axios';

export interface ScriptText {
    id: number
    name: string
    description: string
    manufactor: number
    access_type: string
    version: string
    status: number
    updated_at: Date
}

export interface QueryParams {
    page: number,
    limit: number,
    name: string|undefined,
    status: number|undefined,
    sort_by: string,
    group_by: string,
}

export const fetchNames = (): Promise<any> =>
  request({
    url: '/security/scripts/names',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const fetchList = (query: QueryParams): Promise<any> =>
  request({
    url: '/security/scripts/',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => response.data);

export const fetchByID = (id: number): Promise<any> =>
  request({
    url: '/security/scripts/' + parseInt(id as any).toFixed(0),
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const createScript = (data: any): Promise<any> =>
  request({
    url: '/security/scripts/',
    method: 'post',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const updateScript = (id: number, data: string): Promise<any> =>
  request({
    url: '/security/scripts/' + parseInt(id as any).toFixed(0),
    method: 'put',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const deleteScript = (id: number): Promise<any> =>
  request({
    url: '/security/scripts/' + id.toFixed(0),
    method: 'delete',
  }).then((response: AxiosResponse<any>) => response.data);

export const deleteItemName = (id: number): Promise<any> =>
  request({
    url: '/security/items/' + id.toFixed(0),
    method: 'delete',
  }).then((response: AxiosResponse<any>) => response.data);

export const setStatus = (id: number, status: number): Promise<any> =>
  request({
    url: '/security/items/' + id.toFixed(0) + '/status',
    method: 'put',
    data: { status: status },
  }).then((response: AxiosResponse<any>) => response.data);

export const statusText = (status?: number): any => {
  const locale = useI18n();

  if (status === 1 || status === null || status === undefined) {
    return locale.t('status.enabled');
  } else {
    return locale.t('status.disabled');
  }
};
