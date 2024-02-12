import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export interface QueryParams {
  states: string[],
  title?: string,
  requester?: string,
  debugManu?: string,
  offset?: number,
  limit?: number,
}

export const getRequests = (params: QueryParams): Promise<any> =>
  request({
    url: '/v3/3td/anhui/access_requests',
    method: 'get',
    params: params,
  }).then((response: AxiosResponse<any>) => response.data, (reason: any) => { /* alert(JSON.stringify(reason.response.data));*/ });

export const getRequestCount = (params: QueryParams): Promise<any> =>
  request({
    url: '/v3/3td/anhui/access_requests/count',
    method: 'get',
    params: params,
  }).then((response: AxiosResponse<any>) => response.data, (reason: any) => { /* alert(JSON.stringify(reason.response.data));*/ });

export const createRequest = (data: any): Promise<any> =>
  request({
    url: '/v3/3td/anhui/access_requests',
    method: 'post',
    data,
  }).then((response: AxiosResponse<any>) => response.data, (reason: any) => { /* alert(JSON.stringify(reason.response.data));*/ });

export const updateRequest = (id: any, req: any): Promise<any> =>
  request({
    url: '/v3/3td/anhui/access_requests/' + id + '?override=true',
    method: 'put',
    data: req,
  }).then((response: AxiosResponse<any>) => response.data, (reason: any) => { /* alert(JSON.stringify(reason.response.data));*/ });

export const deleteRequest = (id: any): Promise<any> =>
  request({
    url: '/v3/3td/anhui/access_requests/' + id,
    method: 'delete',
  }).then((response: AxiosResponse<any>) => response.data, (reason: any) => { /* alert(JSON.stringify(reason.response.data));*/ });

export const allocateAddress = (data: any): Promise<any> =>
  request({
    url: '/v3/3td/anhui/request_allocated_Address',
    method: 'post',
    data,
  }).then((response: AxiosResponse<any>) => response.data, (reason: any) => { /* alert(JSON.stringify(reason.response.data));*/ });

export const getAllocatedAddress = (requestID: any): Promise<any> =>
  request({
    url: '/3td/anhui/request_allocated_Address/by_request/' + requestID,
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data, (reason: any) => { /* alert(JSON.stringify(reason.response.data));*/ });
