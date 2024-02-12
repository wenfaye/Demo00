import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export interface DictData {
  value: string,
  label: string,
}
export interface QueryParams {
  offset: number,
  limit: number,
  by_keyword: string|undefined,
  by_type: string|undefined,
  sort_by: string,
  by_filter: string|undefined,

  [key: string]: any
}

// 列出轮询结果
export const searchDiscoveries = (param: any): Promise<any> =>
  request({
    url: '/scan/v2/results',
    method: 'get',
    params: param,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 查询轮询结果个数
export const searchDiscoveriesCount = (): Promise<any> =>
  request({
    url: '/scan/v2/results/count',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 查询轮询规则列表
export const getScanParamsList = (param: any): Promise<any> =>
  request({
    url: '/scan/v2/params',
    method: 'get',
    params: param,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 查询轮询规则数目
export const getScanParamsListCount = (): Promise<any> =>
  request({
    url: '/scan/v2/params/count',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 获取采集节点列表
export const samplingNodes = (): Promise<any> =>
  request({
    url: '/ds/v2/sampling_nodes',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

// 获取通知列表
export const notificationsNodes = (): Promise<any> =>
  request({
    url: '/v1/notification_groups',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

// 新增轮询规则
export const addScanParams = (paramsObj:any): Promise<any> =>
  request({
    url: '/scan/v2/params',
    method: 'post',
    data: paramsObj,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 按 ID更新一个轮询规则
export const updateScanParamById = (id: string, paramsObj:any): Promise<any> =>
  request({
    url: '/scan/v2/params/' + id,
    method: 'put',
    data: paramsObj,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 按 ID运行一个轮询规则
export const runScanParamById = (paramsObj:any): Promise<any> =>
  request({
    url: '/tasks',
    method: 'post',
    data: paramsObj,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 按 ID 删除一个轮询规则
export const deleteScanParamById = (id: string): Promise<any> =>
  request({
    url: '/scan/v2/params/' + id,
    method: 'delete',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 查询指定的轮询规则
export const getScanParamById = (id:string): Promise<any> =>
  request({
    url: '/scan/v2/params/' + id,
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 查询轮询的全局设置
export const getGlobalScanParam = (): Promise<any> =>
  request({
    url: '/scan/v2/params/config',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 更新轮询的全局设置
export const updateGlobalScanParam = (paramsObj: any): Promise<any> =>
  request({
    url: '/scan/v2/params/config',
    method: 'put',
    data: paramsObj,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 列出新发现的 IP 列表
export const newDiscoveries = (param: any): Promise<any> =>
  request({
    url: '/scan/v2/results/new_discoveries',
    method: 'get',
    params: param,
  }).then((response: AxiosResponse<any>): Promise<any> => {
    return response.data;
  });

// 查询新发现的 IP 数目
export const newDiscoveriesCount = (): Promise<any> =>
  request({
    url: '/scan/v2/results/new_discoveries/count',
    method: 'get',
  }).then((response: AxiosResponse<any>): Promise<any> => {
    return response.data;
  });

// 获取忽略列表
export const getIgnoreList = (param: any): Promise<any> =>
  request({
    url: '/scan/v2/ignore_list',
    method: 'get',
    params: param,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 获取忽略列表
export const getIgnoreListCount = (): Promise<any> =>
  request({
    url: '/scan/v2/ignore_list/count',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 加入忽略列表
export const addIgnoreList = (address:any): Promise<any> =>
  request({
    url: '/scan/v2/ignore_list/' + address,
    method: 'put',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

// 从忽略列表删除
export const delIgnoreList = (address:any): Promise<any> =>
  request({
    url: '/scan/v2/ignore_list/' + address,
    method: 'delete',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });
