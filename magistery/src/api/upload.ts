import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export const saveUploadSettings = (tag: string, params: any): Promise<any> =>
  request({
    url: '/upload/global/v1/' + tag + '/settings/',
    method: 'post',
    data: params,
  }).then((response: AxiosResponse<any>) => response.data);

export const saveMoUploadSettings = (tag: string, id: any, params: any): Promise<any> =>
  request({
    url: '/upload/global/v1/' + tag + '/settings/' + id,
    method: 'post',
    data: params,
  }).then((response: AxiosResponse<any>) => response.data);

export const loadUploadSettings = (tag: string): Promise<any> =>
  request({
    url: '/upload/global/v1/' + tag + '/settings/',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const loadMoUploadSettings = (tag: string, id: any): Promise<any> =>
  request({
    url: '/upload/global/v1/' + tag + '/settings/' + id,
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);
