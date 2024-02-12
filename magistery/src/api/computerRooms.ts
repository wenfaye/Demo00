import { req, rest } from '@/utils/request';
import { AxiosResponse } from 'axios';

export const getCabinetWithAccessories = (id: any, type: string) =>
  rest({
    url: '/mos/computer_cabinets/' + id + '/with_accessories?type=' + type,
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const getRoomAccessories = (roomId: any, type: string) =>
  rest({
    url: '/mos/computer_rooms/' + roomId + '/accessories',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const readRooms = (name:String, excludeEmpty = true) =>
  rest({
    url: '/mos/computer_rooms?exclude_empty=' + excludeEmpty + '&name=' + name,
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const readCabinets = (roomId: any) =>
  rest({
    url: '/mos/computer_rooms/' + roomId + '/cabinets',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const readRackUnitStat = () =>
  rest({
    url: '/mos/computer_rooms/rack_unit_stat',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const readCabinetFacilities = (cabinetId: any) =>
  rest({
    url: '/mos/computer_cabinets/' + cabinetId + '/inner_facilities',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const readOpticalCables = (query: any) =>
  rest({
    url: '/mos/optical_cables',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const updateInnerFacility = (cabinetId: any, location: any, type: any, data: any) =>
  rest({
    url: '/mos/computer_cabinets/' + cabinetId + '/inner_facility?type=' + type + '&location=' + location,
    method: 'put',
    data: data,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const getOpticalCable = (id: any) =>
  rest({
    url: '/mos/optical_cables/' + id,
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const createOpticalCable = (data: any) =>
  rest({
    url: '/mos/optical_cables',
    method: 'post',
    data: data,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const updateOpticalCable = (id:any, data: any) =>
  rest({
    url: '/mos/optical_cables/' + id,
    method: 'put',
    data: data,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const removeOpticalCable = (id: any) =>
  rest({
    url: '/mos/optical_cables/' + id,
    method: 'delete',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const removeOpticalCableByIds = (ids: any) =>
  rest({
    url: '/mos/optical_cables/' + ids.join(',') + '/by_ids',
    method: 'delete',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const createRoom = (data: any) =>
  rest({
    url: '/mos/computer_rooms',
    method: 'post',
    data: data,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const updateRoom = (id: any, data: any) =>
  rest({
    url: '/mos/computer_rooms/' + id,
    method: 'put',
    data: data,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const removeRoom = (id: any) =>
  rest({
    url: '/mos/computer_rooms/' + id,
    method: 'delete',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const createCabinet = (data: any) =>
  rest({
    url: '/mos/computer_cabinets',
    method: 'post',
    data: data,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const updateCabinet = (id: any, data: any) =>
  rest({
    url: '/mos/computer_cabinets/' + id,
    method: 'put',
    data: data,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const removeCabinet = (id: any) =>
  rest({
    url: '/mos/computer_cabinets/' + id,
    method: 'delete',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const createPowerSocket = (cabinetId: any, data: any) =>
  rest({
    url: '/mos/computer_cabinets/' + cabinetId + '/accessories',
    method: 'post',
    data: data,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const updatePowerSocket = (cabinetId: any, id:any, data: any) =>
  rest({
    url: '/mos/computer_cabinets/' + cabinetId + '/accessories/' + id,
    method: 'put',
    data: data,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const deletePowerSocket = (cabinetId: any, id:any) =>
  rest({
    url: '/mos/computer_cabinets/' + cabinetId + '/accessories/' + id,
    method: 'delete',
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const readPowerSockets = (query: any) =>
  rest({
    url: '/mos/computer_cabinets/' + '-1' + '/power_sockets',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });

export const readPowerSocketStat = (query: any) =>
  rest({
    url: '/mos/computer_cabinets/' + '-1' + '/power_socket_stat',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => {
    return response.data;
  });
