import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export const fetchPermissions = (): Promise<any> =>
  request({
    url: '/v3/3td/anhui/permissions',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const updatePermissions = (data: any): Promise<any> =>
  request({
    url: '/v3/3td/anhui/permissions',
    method: 'post',
    data,
  }).then((response: AxiosResponse<any>) => response.data);
