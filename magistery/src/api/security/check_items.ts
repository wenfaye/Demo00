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
    url: '/security/items/',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => response.data);
