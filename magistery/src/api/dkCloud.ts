import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export const getStations = (includeAll: boolean = true): Promise<any> =>
  request({
    url: '/../mc/anhui/GetStations?includeAll=' + includeAll,
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const getStationInfo = (stationId: boolean = true): Promise<any> =>
  request({
    url: '/../mc/anhui/GetStationInfo?stationId=' + stationId,
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const getRouterTypes = (includeAll: boolean = true): Promise<any> =>
  request({
    url: '/../mc/anhui/GetRouterTypes',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const getSwitchTypes = (includeAll: boolean = true): Promise<any> =>
  request({
    url: '/../mc/anhui/GetSwitchTypes',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);
