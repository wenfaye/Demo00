import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export const xldwWebURL = (window as any).apiPrefix + '/../xldw_api';
export const xldwApiURL = '/../xldw_api';
export const xldwUploadURL = xldwWebURL + '/v1/3td/xldw/upload';

export const readTree = (): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/departments/tree',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const remove = (id: number): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/departments/' + parseInt(id as any).toFixed(0),
    method: 'delete',
  }).then((response: AxiosResponse<any>) => response.data);

export const create = (data: any): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/departments',
    method: 'post',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const update = (id: number, data: any): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/departments/' + parseInt(id as any).toFixed(0),
    method: 'put',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const listUsers = (): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/users',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const removeUser = (id: number): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/users/' + parseInt(id as any).toFixed(0),
    method: 'delete',
  }).then((response: AxiosResponse<any>) => response.data);

export const createUser = (data: any): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/users',
    method: 'post',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const updateUser = (id: number, data: any): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/users/' + parseInt(id as any).toFixed(0),
    method: 'put',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const importUsers = (filename: string, departmentAutoCreate: boolean): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/users/import',
    method: 'post',
    params: {
      department_auto_create: departmentAutoCreate,
      localfile: true,
    },
    data: {
      filename: filename,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export interface RecordQueryParams {
  queryType: string,
  page: number,
  size: number,
  department_id: number|undefined,
  created_at: Array<any>|undefined,
  requester_id: number|undefined,
  processor_id: number|undefined,
  state: number|undefined,
  search: string|undefined,
  phone: string|undefined,
  room: string|undefined,
  quest_class: Array<number>|undefined,
  sort: string,
}

export const listRecords = (query: RecordQueryParams): Promise<any> => {
  switch (query.queryType) {
    case 'requester':
      // query.requester_id = undefined;
      query.phone = undefined;
      query.room = undefined;
      query.department_id = undefined;
      query.search = undefined;
      query.quest_class = undefined;
      break;
    case 'phone':
      query.requester_id = undefined;
      // query.phone = undefined;
      query.room = undefined;
      query.department_id = undefined;
      query.search = undefined;
      query.quest_class = undefined;
      break;
    case 'room':
      query.requester_id = undefined;
      query.phone = undefined;
      query.department_id = undefined;
      query.search = undefined;
      query.quest_class = undefined;
      break;
    case 'department':
      query.requester_id = undefined;
      query.phone = undefined;
      query.room = undefined;
      query.search = undefined;
      query.quest_class = undefined;
      break;
    case 'search':
      query.requester_id = undefined;
      query.phone = undefined;
      query.room = undefined;
      query.department_id = undefined;
      query.quest_class = undefined;
      break;
    case 'quest_class':
      query.requester_id = undefined;
      query.phone = undefined;
      query.room = undefined;
      query.department_id = undefined;
      query.search = undefined;
      break;
  }

  return request({
    url: xldwApiURL + '/v1/3td/xldw/records',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => response.data);
};

export const countRecords = (query: RecordQueryParams): Promise<any> => {
  switch (query.queryType) {
    case 'requester':
      query.phone = undefined;
      query.room = undefined;
      query.department_id = undefined;
      query.search = undefined;
      query.quest_class = undefined;
      break;
    case 'phone':
      query.requester_id = undefined;
      query.room = undefined;
      query.department_id = undefined;
      query.search = undefined;
      query.quest_class = undefined;
      break;
    case 'room':
      query.requester_id = undefined;
      query.phone = undefined;
      query.department_id = undefined;
      query.search = undefined;
      query.quest_class = undefined;
      break;
    case 'department':
      query.requester_id = undefined;
      query.phone = undefined;
      query.room = undefined;
      query.search = undefined;
      query.quest_class = undefined;
      break;
    case 'search':
      query.requester_id = undefined;
      query.phone = undefined;
      query.room = undefined;
      query.department_id = undefined;
      query.quest_class = undefined;
      break;
    case 'quest_class':
      query.requester_id = undefined;
      query.phone = undefined;
      query.room = undefined;
      query.department_id = undefined;
      query.search = undefined;
      break;
  }

  return request({
    url: xldwApiURL + '/v1/3td/xldw/records/count',
    method: 'get',
    params: query,
  }).then((response: AxiosResponse<any>) => response.data);
};

export const getXldwExportURL = (query: RecordQueryParams, onlyCurrentPage: boolean): string => {
  let urlstr = xldwWebURL + '/v1/3td/xldw/records/download/xlsx';
  if (onlyCurrentPage) {
    if (query.page && query.page > 0) {
      if (urlstr.indexOf('?') > 0) {
        urlstr = urlstr + '&page=' + query.page;
      } else {
        urlstr = urlstr + '?page=' + query.page;
      }
    }
    if (query.size && query.size > 0) {
      if (urlstr.indexOf('?') > 0) {
        urlstr = urlstr + '&size=' + query.size;
      } else {
        urlstr = urlstr + '?size=' + query.size;
      }
    }
  }
  if (query.sort && query.sort != '') {
    if (urlstr.indexOf('?') > 0) {
      urlstr = urlstr + '&sort=' + query.sort;
    } else {
      urlstr = urlstr + '?sort=' + query.sort;
    }
  }
  if (query.state) {
    if (urlstr.indexOf('?') > 0) {
      urlstr = urlstr + '&state=' + query.state;
    } else {
      urlstr = urlstr + '?state=' + query.state;
    }
  }
  if (query.created_at && query.created_at.length > 0) {
    for (const value of query.created_at) {
      if (urlstr.indexOf('?') > 0) {
        urlstr = urlstr + '&created_at[]=' + value.toISOString();
      } else {
        urlstr = urlstr + '?created_at[]=' + value.toISOString();
      }
    }
  }

  // department_id: number|undefined,
  // created_at: Array<any>|undefined,
  // requester_id: number|undefined,
  // processor_id: number|undefined,
  // state: number|undefined,
  // search: string|undefined,
  // phone: string|undefined,
  // room: string|undefined,
  // quest_class: Array<number>|undefined,
  // sort: string,
  switch (query.queryType) {
    case 'requester':
      query.phone = undefined;
      query.room = undefined;
      query.department_id = undefined;
      query.search = undefined;
      query.quest_class = undefined;

      if (query.requester_id) {
        if (urlstr.indexOf('?') > 0) {
          urlstr = urlstr + '&requester_id=' + query.requester_id;
        } else {
          urlstr = urlstr + '?requester_id=' + query.requester_id;
        }
      }

      break;
    case 'phone':
      query.requester_id = undefined;
      query.room = undefined;
      query.department_id = undefined;
      query.search = undefined;
      query.quest_class = undefined;

      if (query.phone) {
        if (urlstr.indexOf('?') > 0) {
          urlstr = urlstr + '&phone=' + query.phone;
        } else {
          urlstr = urlstr + '?phone=' + query.phone;
        }
      }
      break;
    case 'room':
      query.requester_id = undefined;
      query.phone = undefined;
      query.department_id = undefined;
      query.search = undefined;
      query.quest_class = undefined;

      if (query.phone) {
        if (urlstr.indexOf('?') > 0) {
          urlstr = urlstr + '&room=' + query.phone;
        } else {
          urlstr = urlstr + '?room=' + query.phone;
        }
      }
      break;
    case 'department':
      query.requester_id = undefined;
      query.phone = undefined;
      query.room = undefined;
      query.search = undefined;
      query.quest_class = undefined;

      if (query.department_id) {
        if (urlstr.indexOf('?') > 0) {
          urlstr = urlstr + '&department_id=' + query.department_id;
        } else {
          urlstr = urlstr + '?department_id=' + query.department_id;
        }
      }
      break;
    case 'search':
      query.requester_id = undefined;
      query.phone = undefined;
      query.room = undefined;
      query.department_id = undefined;
      query.quest_class = undefined;

      if (query.search || query.search == '') {
        if (urlstr.indexOf('?') > 0) {
          urlstr = urlstr + '&search=' + query.search;
        } else {
          urlstr = urlstr + '?search=' + query.search;
        }
      }
      break;
    case 'quest_class':
      query.requester_id = undefined;
      query.phone = undefined;
      query.room = undefined;
      query.department_id = undefined;
      query.search = undefined;

      if (query.quest_class && query.quest_class.length > 0) {
        for (const value of query.quest_class) {
          if (urlstr.indexOf('?') > 0) {
            urlstr = urlstr + '&quest_class[]=' + value;
          } else {
            urlstr = urlstr + '?quest_class[]=' + value;
          }
        }
      }
      break;
  }

  return urlstr;
};

export const removeRecord = (id: number): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/records/' + parseInt(id as any).toFixed(0),
    method: 'delete',
  }).then((response: AxiosResponse<any>) => response.data);

export const createRecord = (data: any): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/records',
    method: 'post',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const updateRecord = (id: number, data: any): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/records/' + parseInt(id as any).toFixed(0),
    method: 'put',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const dispatchRecord = (id: number, data: any): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/records/' + parseInt(id as any).toFixed(0) + '/dispatch',
    method: 'put',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const completeRecord = (id: number, data: any): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/records/' + parseInt(id as any).toFixed(0) + '/complete',
    method: 'put',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const revisitRecord = (id: number, data: any): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/records/' + parseInt(id as any).toFixed(0) + '/revisit',
    method: 'put',
    data,
  }).then((response: AxiosResponse<any>) => response.data);

export const findDepartment = (departments: Array<any>, id: any): any => {
  for (const value of departments) {
    if (value.id == id) {
      return value;
    }
    if (value.children) {
      const obj = findDepartment(value.children, id);
      if (obj) {
        return obj;
      }
    }
  }
  return null;
};

export const importRecords = (filename: string, userAutoCreate: boolean, departmentAutoCreate: boolean): Promise<any> =>
  request({
    url: xldwApiURL + '/v1/3td/xldw/records/import',
    method: 'post',
    params: {
      department_auto_create: departmentAutoCreate,
      user_auto_create: userAutoCreate,
      localfile: true,
    },
    data: {
      filename: filename,
    },
  }).then((response: AxiosResponse<any>) => response.data);