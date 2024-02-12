import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export const fetchManufactors = (): Promise<any> =>
  request({
    url: '/security/manufactors',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const getAccessTypes = (): any =>
  request({
    url: '/security/access_types',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);