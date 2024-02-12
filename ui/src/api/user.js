import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/salsserver/api/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/vue-element-admin/user/info',
    url: '/salsserver/api/current_user',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    // url: '/vue-element-admin/user/logout',
    // method: 'post'
    url: '/salsserver/api/logout',
    method: 'get'
  })
}

export function fetchChangePwd(data) {
  return request({
    url: '/salsserver/api/changePwd',
    method: 'post',
    data
  })
}
