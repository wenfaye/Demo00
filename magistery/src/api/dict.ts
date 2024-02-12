import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export interface DictData {
  value: string,
  label: string,
}

export const readVoltageLevels = () =>
  request({
    url: '/v3/dict_datas/by_type_uuid/anhui_voltage_levels',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data as DictData[];
  });

export const readAreas = () =>
  request({
    url: '/v3/dict_datas/tree/by_type_uuid/anhui_areas',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data as DictData[];
  });

export const readSiteTypes = () =>
  request({
    url: '/v3/dict_datas/by_type_uuid/anhui_site_types',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data as DictData[];
  });

export const readBizTypes1 = () =>
  request({
    url: '/v3/dict_datas/by_type_uuid/anhui_biz_types1',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data as DictData[];
  });

export const readBizTypes2 = () =>
  request({
    url: '/v3/dict_datas/by_type_uuid/anhui_biz_types2',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data as DictData[];
  });

export const readCityCompanies = () =>
  request({
    url: '/v3/dict_datas/by_type_uuid/anhui_city_companies',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data as DictData[];
  });

export const readByUuid = (uuid: string) =>
  request({
    url: '/v3/dict_datas/by_type_uuid/' + uuid,
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data as DictData[];
  });
