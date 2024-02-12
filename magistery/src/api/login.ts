import request from '@/utils/request';
import { AxiosResponse } from 'axios';
import { ElMessageBox } from 'element-plus';

// export const login = (username: string, password: string) =>
//   request({
//     url: '/sessions',
//     method: 'post',
//     data: {
//       username,
//       password,
//     },
//     params: { wrap: true },
//   }).then((response: AxiosResponse<any>) => response.data);

export const getUserInfo = () =>
  request({
    url: '/sessions/current',
    method: 'get',
    params: { wrap: true },
  }).then((response: AxiosResponse<any>) => response.data);

// export const getCurrentToken = () =>
//   request({
//     url: '/sessions/current_token',
//     method: 'get',
//     params: { wrap: true },
//   }).then((response: AxiosResponse<any>) => response.data).catch(() => {
//     MessageBox.confirm(
//       '你已被登出，可以取消继续留在该页面，或者重新登录',
//       '确定登出',
//       {
//         confirmButtonText: '重新登录',
//         cancelButtonText: '取消',
//         type: 'warning',
//       },
//     ).then(() => {
//       UserModule.LogOut().then(() => {
//         location.reload(); // To prevent bugs from vue-router
//       });
//     });
//   });

// export const logout = (token: string) =>
//   request({
//     url: '/sessions',
//     method: 'delete',
//     params: { token: token, wrap: true },
//   }).then((response: AxiosResponse<any>) => response.data);
