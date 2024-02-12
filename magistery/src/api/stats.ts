import request from '@/utils/request';
import { isArray } from '@/utils/validate';
import { AxiosResponse } from 'axios';

// 这个函数是为 3.6 准备的，用于刷新 cookies, 确保它不会过期
export const refreshForV36 = (): Promise<any> =>
  request({
    url: '/../web/alert_events/stat_new',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response);

const joinTag = (province:string, tag:string | null | undefined) => {
  if (!tag || tag == '') {
    return province;
  }
  if (tag.startsWith(province + '.')) {
    return tag;
  }
  return province + '.' + tag;
};

export const deviceTypes = { 0: '未知设备', 1: '交换机', 2: '路由器', 3: '交换路由', 51: '无线路由', 6: '防火墙', 5: '服务器', 7: 'UPS', 8: '温湿度探针', 9: '数据存储', 12: 'F5设备', 13: 'PE路由器', 14: 'P路由器', 15: 'CE路由器', 52: 'IP节点', 67: '堆叠设备' };

export const getAlertStats = (): Promise<any> =>
  request({
    url: '/v3/alerts/cookies/stats?group_by=level_after_fold&is_confirm=false',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const readAlertStats = (): Promise<any> => getAlertStats().then((response: any) => {
  const data = {
    total: 0,
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
  };
  for (let i = 0; i < response.value.length; i++) {
    const value = response.value[i];
    switch (value.level) {
      case 1:
        data.level1 = value.count;
        break;
      case 2:
        data.level2 = value.count;
        break;
      case 3:
        data.level3 = value.count;
        break;
      case 4:
        data.level4 = value.count;
        break;
      case 5:
        data.level5 = value.count;
        break;
      default:
        data.level5 = value.count;
        break;
    }
    data.total = value.count;
  }
  return data;
});

export const confirmNotification = (data: any) : Promise<any> =>
  request({
    url: '/../rest/notifications/confirm',
    method: 'put',
    data: data,
  }).then((response: AxiosResponse<any>) => {
    const data = response.data;
    if (data.value) {
      return data.value;
    }
    return data;
  });

export const readNotification = () : Promise<any> =>
  request({
    url: '/ts/notifications',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    const data = response.data;
    if (data.value) {
      return data.value;
    }
    return data;
  });

export const readNotificationCount = () : Promise<any> =>
  request({
    url: '/ts/notifications/count',
    method: 'get',
  }).then((response: AxiosResponse<any>) => {
    const data = response.data;
    if (data.value) {
      return data.value;
    }
    return data;
  });

export const getTaskCount = (): Promise<any> =>
  request({
    url: '/ts/background_tasks/count',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const getTodolistCount = (): Promise<any> =>
  request({
    url: '/todolist/count',
    method: 'get',
  }).then((response: AxiosResponse<any>) => response.data);

export const getManagedObjectCount = (byType: string|undefined): Promise<any> =>
  request({
    url: '../ds/v2/mo/count',
    method: 'get',
    params: {
      by_type: byType,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readBranches = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/branches',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readStatForDeviceManufacturers = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/agg/stats/manufacturer',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readStatForDeviceType = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/agg/stats/device_type',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readStatForAnhuiDeviceManufacturers = (tag: string, zone: string): Promise<any> => {
  let params: any = { tag: tag };
  if (zone) {
    params = { tag: tag, 's.anhui_zone': zone };
  }

  return request({
    url: '/query/v1/agg/stats/manufacturer_anhui',
    method: 'get',
    params,
  }).then((response: AxiosResponse<any>) => response.data);
};

export const readStatForAnhuiDeviceOIDs = (tag: string, zone: string, manufacturer: string): Promise<any> => {
  let params: any = { tag: tag, 'f.anhui_manufacturer_id': manufacturer };
  if (zone) {
    params = { tag: tag, 'f.anhui_manufacturer_id': manufacturer, 's.anhui_zone': zone };
  }

  return request({
    url: '/query/v1/agg/stats/f.oid',
    method: 'get',
    params: params,
  }).then((response: AxiosResponse<any>) => response.data);
};

export const readStatForDeviceUptimeByYears = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/agg/stats/settings.uptime_year',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readStatForDeviceUptimeByMonths = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/agg/stats/settings.uptime_month',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readStatForDeviceTotalUptimeByYears = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/agg/stats/total_settings.uptime_year',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readStatForDeviceTotalUptimeByMonths = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/agg/stats/total_settings.uptime_month',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readStatForDeviceTypes = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/agg/stats/device_type',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readDeviceCpuTopn = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/agg/topn/cpu',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readDeviceMemTopn = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/agg/topn/mem',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readDeviceLinkTopn = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/agg/topn/link_if_octets',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const getAggAlertStats = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/agg/alert_cookies/stats',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readAggAlertStats = (tag: string): Promise<any> => getAggAlertStats(tag).then((response: any) => {
  const data = {
    total: 0,
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
    values: [],
  };
  let values = response;
  if (response.value) {
    values = response.value;
  }
  for (const key in values) {
    const record = values[key];

    if (record.error) {
      continue;
    }
    if (!record.data) {
      continue;
    }
    let subdata = record.data;
    if (!Array.isArray(subdata)) {
      if (subdata.data) {
        subdata = subdata.data;
      }
      if (subdata.value) {
        subdata = subdata.value;
      }
    }

    for (const subkey in subdata) {
      const value = subdata[subkey];
      switch (value.level) {
        case 1:
          data.level1 += value.count;
          break;
        case 2:
          data.level2 += value.count;
          break;
        case 3:
          data.level3 += value.count;
          break;
        case 4:
          data.level4 += value.count;
          break;
        case 5:
          data.level5 += value.count;
          break;
        default:
          data.level5 += value.count;
          break;
      }
      data.total += value.count;
    }
  }

  data.values = values;
  return data;
});

export const readDeviceCpu = (province: string, tag: string, device: any): Promise<any> =>
  request({
    url: '/query/v1/agg/ds/v2/mo/' + parseInt(device).toFixed() + '/runtime/metric/cpu',
    method: 'get',
    params: {
      tag: joinTag(province, tag),
      begin_at: 'now()-10m',
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readDeviceMem = (province: string, tag: string, device: any): Promise<any> =>
  request({
    url: '/query/v1/agg/ds/v2/mo/' + parseInt(device).toFixed() + '/runtime/metric/mem',
    method: 'get',
    params: {
      tag: joinTag(province, tag),
      begin_at: 'now()-10m',
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readLinkOctets = (province: string, tag: string, device: any): Promise<any> =>
  request({
    url: '/query/v1/agg/ds/v2/mo/' + parseInt(device).toFixed() + '/runtime/metric/link_flux',
    method: 'get',
    params: {
      tag: joinTag(province, tag),
      begin_at: 'now()-10m',
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readAggSettings = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/agg/settings',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readAggTopo = (tag: string): Promise<any> =>
  request({
    url: '/query/v1/agg/topo/list',
    method: 'get',
    params: {
      tag: tag,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const aggForEach = (data: any, cb: (key: any, parent: any, subekey: any, value: any) => any) => {
  const charData = [];
  for (const key in data) {
    const value = data[key];
    if (value.error) {
      continue;
    }
    if (!value.data) {
      continue;
    }

    for (const subkey in value.data) {
      const stat = value.data[subkey];
      stat.datakey = key;
      stat.datalabel = value.label;

      cb(key, value, subkey, stat);
    }
  }
};

export const readOnlineStats = (zone: string, beginAt: string, endAt: String): Promise<any> =>
  request({
    url: '/query/v1/local/alerts/histories/online_stats/mo_field/s.' + zone,
    method: 'get',
    params: {
      begin_at: beginAt,
      end_at: endAt,
      stat_interval: 3,
    },
  }).then((response: AxiosResponse<any>) => response.data);

export const readMttrStats = (zone: string, beginAt: string, endAt: String): Promise<any> =>
  request({
    url: '/query/v1/local/alerts/histories/mttr_stats/mo_field/s.' + zone,
    method: 'get',
    params: {
      begin_at: beginAt,
      end_at: endAt,
      stat_interval: 3,
    },
  }).then((response: AxiosResponse<any>) => response.data);
