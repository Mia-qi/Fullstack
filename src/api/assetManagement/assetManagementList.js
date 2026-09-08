export function getassetManagementGetPage() {
  return Promise.resolve({ data: { records: [], total: 0 } })
}

export function assetManagementBatchDeleteValue() {
  return Promise.resolve({ code: 200 })
}

export function assetManagementExport() {
  return Promise.resolve({ data: {} })
}