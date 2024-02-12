import { req } from '@/utils/request';
import { AxiosResponse } from 'axios';

export const getRooms = (): Promise<any> =>
  req({
    url: '/mc/ComputerRooms/List',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const getCabinets = (id: any): Promise<any> =>
  req({
    url: '/mc/ComputerCabinets/ListByRoomId?roomId=' + id,
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const getCabinet = (id: any): Promise<any> =>
  req({
    url: '/mc/ComputerCabinets/GetCabinet?id=' + id,
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const createOdf = (odf: any): Promise<any> =>
  req({
    url: '/rest/mos/computer_cabinet_accessories',
    method: 'post',
    data: odf,
  }).then((response: AxiosResponse<any>) => response.data);

export const updateOdf = (id: any, odf: any): Promise<any> =>
  req({
    url: '/rest/mos/computer_cabinet_accessories/' + id,
    method: 'put',
    data: odf,
  }).then((response: AxiosResponse<any>) => response.data);

export const getOdf = (id: any): Promise<any> =>
  req({
    url: '/rest/mos/computer_cabinet_accessories/' + id,
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

