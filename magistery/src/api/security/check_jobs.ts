import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export interface QueryParams {
    page: number,
    limit: number,
    name: string|undefined,
    sort_by: string,
}

export const fetchList = (query: QueryParams): Promise<any> =>
  request({
    url: '/security/jobs/',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => response.data);

export const deleteJob = (id: number): Promise<any> =>
  request({
    url: '/security/jobs/' + id.toFixed(0),
    method: 'delete',
  }).then((response: AxiosResponse<any>) => response.data);