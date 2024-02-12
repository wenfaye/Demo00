import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export interface QueryParams {
    page: number,
    limit: number,
    name: string|undefined,
    sort_by: string,
    group_by: string,
}

export const fetchList = (itemID: number, query: QueryParams): Promise<any> =>
  request({
    url: '/security/items/' + parseInt(itemID as any).toFixed(0) + '/tasks',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => response.data);

export const createTask = (itemID: number, moID: number, data: any): Promise<any> =>
  request({
    url: '/security/items/' + parseInt(itemID as any).toFixed(0) + '/tasks/' + parseInt(moID as any).toFixed(0),
    method: 'put',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const deleteTask = (itemID: number, moID: number): Promise<any> =>
  request({
    url: '/security/items/' + parseInt(itemID as any).toFixed(0) + '/tasks/' + parseInt(moID as any).toFixed(0),
    method: 'delete',
  }).then((response: AxiosResponse<any>) => response.data);