import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/salsserver/api/audit/audit/page',
    method: 'post',
    data
  })
}
export function fetchInfo(id) {
  return request({
    url: `/salsserver/api/audit/audit/info/${id}`,
    method: 'get'
  })
}
export function fetchReject(id) {
  return request({
    url: `/salsserver/api/audit/audit/reject/${id}`,
    method: 'get'
  })
}
export function fetchPass(id,data) {
  return request({
    url: `/salsserver/api/audit/audit/pass/${id}`,
    method: 'post',
    data
  })
}
export function fetchOff(id) {
  return request({
    url: `/salsserver/api/audit/audit/off/${id}`,
    method: 'get'
  })
}