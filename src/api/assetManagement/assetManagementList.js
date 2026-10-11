import request from '@/utils/request'

export function getassetManagementGetPage(params) {
  return request({
    url: '/asset/page',
    method: 'get',
    params
  })
}

export function assetManagementBatchDeleteValue(data) {
  return request({
    url: '/asset/batchDelete',
    method: 'post',
    data
  })
}

export function assetManagementExport(params) {
  return request({
    url: '/asset/export',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}