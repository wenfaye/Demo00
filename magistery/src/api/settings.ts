import { ds } from '@/utils/request';
import { AxiosResponse } from 'axios';

export const getSetting = (name: string): Promise<any> =>
  ds({
    url: '/v2/settings/' + name,
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const saveSetting = (name: string, value:string): Promise<any> =>
  ds({
    url: '/v2/settings/' + name,
    method: 'post',
    data: value,
  }).then((response: AxiosResponse<any>) => response.data);
