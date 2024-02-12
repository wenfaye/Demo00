import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export interface QueryParams {
    offset: number,
    limit: number,
    by_keyword: string|undefined,
    by_type: string|undefined,
    sort_by: string,
    by_filter: string|undefined,

    [key: string]: any
}

export const fetchList = (query: QueryParams): Promise<any> =>
  request({
    url: '/../ds/v2/mo/',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => response.data);

export const fetchPortList = (deviceId: any): Promise<any> =>
  request({
    url: '/ds/v2/mo?by_type=network_device_port&f.device_id=' + deviceId,
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const fetchCount = (query: QueryParams): Promise<any> =>
  request({
    url: '/ds/v2/mo/count',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => response.data);

export const createMo = (mo: any): Promise<any> =>
  request({
    url: '/ds/v2/mo/@create',
    method: 'post',
    data: mo,
  }).then((response: AxiosResponse<any>) => response.data);

export const samplingNodes = (query: QueryParams): Promise<any> =>
  request({
    url: '/ds/v2/sampling_nodes',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => response.data);
