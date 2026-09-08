<template>
  <!-- 资产管理-资产管理列表 -->
  <div class="asset-management-page">
    <div v-if="!isShowEditDetail">
      <!-- 表格查询区域 -->
      <el-card class="table-search-form" shadow="never">
        <el-form :model="queryForm" ref="ruleForm" :inline="true" label-width="100px">
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="选择机构" prop="organId">
                <el-input v-model="queryForm.organId" placeholder="请选择机构" @change="handleOrganChange" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单据编号" prop="documentCode">
                <el-input v-model="queryForm.documentCode" placeholder="请输入单据编号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="text-align: right">
              <el-button @click="resetTable">重置</el-button>
              <el-button type="primary" @click="searchTable">搜索</el-button>
              <el-link
                type="primary"
                :underline="false"
                @click="isShowMoreSearch = !isShowMoreSearch"
                class="more-search-btn"
              >
                高级搜索
                <el-icon v-if="!isShowMoreSearch"><ArrowDown /></el-icon>
                <el-icon v-else><ArrowUp /></el-icon>
              </el-link>
            </el-col>
          </el-row>

          <!-- 高级搜索区域 -->
          <div v-show="isShowMoreSearch && formItemList.length > 0" class="more-search-area">
            <el-row :gutter="16">
              <el-col :span="6" v-for="item in formItemList" :key="item.value">
                <el-form-item :label="item.label" :prop="item.value">
                  <el-input
                    v-if="item.type === 'string'"
                    v-model="queryForm[item.value]"
                    :placeholder="'请输入' + item.label"
                    clearable
                  />
                  <el-select
                    v-else-if="item.type === 'dict-select'"
                    v-model="queryForm[item.value]"
                    :placeholder="'请选择' + item.label"
                    clearable
                  >
                    <el-option
                      v-for="opt in getDictOptions(item.dict)"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value"
                    />
                  </el-select>
                  <el-date-picker
                    v-else-if="item.type === 'dateRangeForDate'"
                    v-model="queryForm[item.value]"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-card>

      <!-- 表格区域 -->
      <el-card class="table-block" shadow="never">
        <template #header>
          <div class="table-header">
            <div class="table-title">{{ pageTitle }}</div>
            <div class="table-actions">
              <el-button icon="Download" @click="handleExport">导出</el-button>
              <el-button icon="Delete" type="danger" plain @click="handleDelete">删除</el-button>
              <el-dropdown @command="handleAddMenuClick">
                <el-button type="primary" icon="Plus">
                  新增<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="item in addMenuList" :key="item.value" :command="item.value">
                      {{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>

        <!-- Element Plus 表格 -->
        <el-table
          ref="tableRef"
          :data="tableDataList"
          border
          stripe
          :height="tableHeight"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
          v-loading="tableLoading"
        >
          <el-table-column type="selection" width="50" align="center" fixed />
          <el-table-column type="index" label="序号" width="70" align="center" fixed />

          <el-table-column prop="documentCode" label="单据编号" width="280" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tooltip :content="row.documentCode" placement="top">
                <span>{{ row.documentCode }}</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="documentName" label="单据名称" width="220" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tooltip :content="row.documentName" placement="top">
                <el-link type="primary" @click="handleNameClick(row)">{{ row.documentName }}</el-link>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="businessName" label="业务类型" width="150" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tooltip :content="row.businessName" placement="top">
                <span>{{ row.businessName }}</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="approvalStatus" label="状态" width="120" show-overflow-tooltip>
            <template #default="{ row }">
              <span v-if="row.approvalStatus == null || row.approvalStatus == '0'">待提交</span>
              <span v-else v-for="item in approveStatusList" :key="item.value">
                <span v-if="row.approvalStatus === item.value">{{ item.label }}</span>
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="createByName" label="编制人" width="120" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tooltip :content="row.createByName" placement="top">
                <span>{{ row.createByName }}</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="编制日期" width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tooltip :content="row.createTime" placement="top">
                <span>{{ row.createTime ? conversionTime(row.createTime) : '' }}</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="organ" label="编制机构" width="250" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tooltip :content="row.organ" placement="top">
                <span>{{ row.organ }}</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150" fixed="right" align="center">
            <template #default="{ row }">
              <el-button
                v-if="row.approvalStatus == null || row.approvalStatus == '0' || row.approvalStatus == '1'"
                link
                type="primary"
                @click.stop="toDetail('edit', row)"
                >编辑</el-button
              >
              <el-button v-if="row.approvalStatus === '1'" link type="danger" @click.stop="handleDelete(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            :current-page="pagination.current"
            :page-size="pagination.size"
            :page-sizes="[10, 20, 30, 50, 100, 200]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @update:current-page="pagination.current = $event"
            @update:page-size="pagination.size = $event"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, ArrowUp, Plus } from '@element-plus/icons-vue'
import { debounce } from '@/utils/common'
import {
  getassetManagementGetPage,
  assetManagementBatchDeleteValue,
  assetManagementExport
} from '@/api/assetManagement/assetManagementList.js'
import { conversionTime } from '@/utils/conversionTime'

export default {
  name: 'AssetManagementHomePage',
  setup() {
    const router = useRouter()
    const tableRef = ref(null)
    const ruleForm = ref(null)
    const tableLoading = ref(false)
    const isShowMoreSearch = ref(false)
    const isShowEditDetail = ref(false)
    const pageTitle = ref('资产管理')

    const queryForm = reactive({
      organId: window.localStorage.getItem('organId') || '',
      projectName: undefined,
      organFULLId: undefined,
      orgForm: undefined,
      id: null,
      businessType: null,
      organ: null,
      documentCode: null,
      documentName: null,
      approvalStatus: '',
      handlerName: null,
      startCreateTime: null,
      endCreateTime: null,
      createTime: null
    })

    const pagination = reactive({
      current: 1,
      size: 10,
      total: 0
    })

    const addMenuList = [
      { label: '资产登记', value: 'registration', path: '/assetManagement/assetRegistration' },
      { label: '资产改造', value: 'reform', path: '/assetManagement/assetReform' },
      { label: '资产转让', value: 'transfer', path: '/assetManagement/assetTransfer' },
      { label: '资产报废', value: 'scrap', path: '/assetManagement/assetScrap' },
      { label: '资产报损', value: 'writeoff', path: '/assetManagement/assetWriteoff' },
      { label: '资产处置', value: 'disposal', path: '/assetManagement/assetDisposal' }
    ]

    const formItemList = [
      { label: '单据名称', value: 'documentName', disabled: false, type: 'string' },
      { label: '业务类型', value: 'businessType', disabled: false, type: 'dict-select', dict: 'business_type' },
      { label: '状态', value: 'approvalStatus', type: 'dict-select', dict: 'approve_status' },
      { label: '编制日期', value: 'createTime', type: 'dateRangeForDate' }
    ]

    const tableDataList = ref([])
    const selectedRows = ref([])
    const selectedRowKeys = ref([])
    const tableHeight = ref(document.body.offsetHeight - 400)
    const detailData = ref({})
    const clickType = ref('add')
    const approveStatusList = ref([
      { label: '待提交', value: '0' },
      { label: '审批中', value: '1' },
      { label: '已通过', value: '2' },
      { label: '已驳回', value: '3' }
    ])
    const businessTypeList = ref([])

    function getDictOptions(dictType) {
      if (dictType === 'approve_status') return approveStatusList.value
      if (dictType === 'business_type') return businessTypeList.value
      return []
    }

    async function loadTableData() {
      tableLoading.value = true
      try {
        const params = { ...queryForm, current: pagination.current, size: pagination.size }
        if (params.createTime && Array.isArray(params.createTime) && params.createTime.length > 0) {
          params.startCreateTime = `${params.createTime[0]} 00:00:00`
          params.endCreateTime = `${params.createTime[1]} 23:59:59`
          delete params.createTime
        }
        const res = await getassetManagementGetPage(params)
        if (res.data) {
          tableDataList.value = res.data.records || []
          pagination.total = res.data.total || 0
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        ElMessage.error('加载数据失败')
      } finally {
        tableLoading.value = false
      }
    }

    function handleOrganChange(val) {
      queryForm.organId = val || window.localStorage.getItem('organId')
      loadTableData()
    }

    function searchTable() {
      selectedRowKeys.value = []
      selectedRows.value = []
      pagination.current = 1
      loadTableData()
    }

    function resetTable() {
      Object.assign(queryForm, {
        organId: window.localStorage.getItem('organId') || '',
        projectName: undefined,
        current: 1,
        size: 10,
        documentCode: null,
        documentName: null,
        businessType: null,
        organ: null,
        approvalStatus: '',
        handlerName: null,
        createTime: null
      })
      pagination.current = 1
      loadTableData()
    }

    function handleSizeChange(val) {
      pagination.size = val
      pagination.current = 1
      loadTableData()
    }

    function handleCurrentChange(val) {
      pagination.current = val
      loadTableData()
    }

    function handleSelectionChange(rows) {
      selectedRows.value = rows
      selectedRowKeys.value = rows.map((row) => row.id)
    }

    function handleRowClick() {}

    async function handleExport() {
      try {
        const params = { ...queryForm, current: pagination.current, size: pagination.size }
        const res = await assetManagementExport(params)
        const blob = new Blob([res.res], { type: 'application/vnd.ms-excel' })
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = res.fileName || 'export.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
        ElMessage.success('导出成功')
      } catch (error) {
        ElMessage.error('导出失败')
      }
    }

    function handleDelete(record) {
      let deleteData = []
      if (record?.id && record?.businessType) {
        if (record.approvalStatus !== '0' && record.approvalStatus !== '1') {
          ElMessage.error('不能删除审批完成的资产')
          return
        }
        deleteData = [{ id: record.id, businessType: record.businessType }]
      } else {
        if (selectedRows.value.length === 0) {
          ElMessage.info('请选择数据')
          return
        }
        const hasApprovedRecord = selectedRows.value.some(
          (item) => item.approvalStatus !== '0' && item.approvalStatus !== '1'
        )
        if (hasApprovedRecord) {
          ElMessage.error('不能删除审批完成的资产')
          return
        }
        deleteData = selectedRows.value
          .filter((item) => item.id && item.businessType)
          .map((item) => ({ id: item.id, businessType: item.businessType }))
      }

      ElMessageBox.confirm('是否删除选中项目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await assetManagementBatchDeleteValue(deleteData)
            selectedRows.value = []
            selectedRowKeys.value = []
            ElMessage.success('删除成功')
            loadTableData()
          } catch (error) {
            ElMessage.error(error.message || '删除失败')
          }
        })
        .catch(() => {
          ElMessage.info('已取消删除')
        })
    }

    function handleAddMenuClick(command) {
      const target = addMenuList.find((item) => item.value === command)
      if (target && target.path) router.push(target.path)
    }

    function toDetail(type, record) {
      clickType.value = type
      detailData.value = record
      handleBusinessTypeRedirect(record)
    }

    function handleBusinessTypeRedirect(record) {
      clickType.value = 'edit'
      detailData.value = record
      const businessType = record.businessType
      const routeMap = {
        ZCDJ: '/assetManagement/assetRegistration',
        ZCCZ: '/assetManagement/assetDisposal',
        ZCGZ: '/assetManagement/assetReform',
        ZCZR: '/assetManagement/assetTransfer',
        ZCBS: '/assetManagement/assetWriteoff',
        ZCBF: '/assetManagement/assetScrap'
      }
      const path = routeMap[businessType]
      if (path) {
        router.push({
          path,
          query: { businessType, from: 'list', id: record.id, type: 'edit' }
        })
      }
    }

    function handleNameClick(record) {
      clickType.value = 'look'
      detailData.value = record
      const businessType = record.businessType
      const routeMap = {
        ZCDJ: '/assetManagement/assetRegistration',
        ZCCZ: '/assetManagement/assetDisposal',
        ZCGZ: '/assetManagement/assetReform',
        ZCZR: '/assetManagement/assetTransfer',
        ZCBS: '/assetManagement/assetWriteoff',
        ZCBF: '/assetManagement/assetScrap'
      }
      const path = routeMap[businessType]
      if (path) {
        router.push({
          path,
          query: { businessType, from: 'list', id: record.id, type: 'look' }
        })
      }
    }

    function handleResize() {
      tableHeight.value = isShowMoreSearch.value ? document.body.offsetHeight - 500 : document.body.offsetHeight - 400
    }

    onMounted(() => {
      loadTableData()
      window.addEventListener('resize', debounce(handleResize, 300))
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
    })

    return {
      tableRef,
      ruleForm,
      tableLoading,
      isShowMoreSearch,
      isShowEditDetail,
      pageTitle,
      queryForm,
      pagination,
      addMenuList,
      formItemList,
      tableDataList,
      selectedRows,
      selectedRowKeys,
      tableHeight,
      detailData,
      clickType,
      approveStatusList,
      businessTypeList,
      getDictOptions,
      loadTableData,
      handleOrganChange,
      searchTable,
      resetTable,
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      handleRowClick,
      handleExport,
      handleDelete,
      handleAddMenuClick,
      toDetail,
      handleBusinessTypeRedirect,
      handleNameClick,
      conversionTime
    }
  }
}
</script>

<style lang="less" scoped>
.asset-management-page {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.table-search-form {
  margin-bottom: 16px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.table-block {
  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #ebeef5;
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .table-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .table-actions {
    display: flex;
    gap: 8px;
  }
}

.more-search-btn {
  margin-left: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.more-search-area {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  background-color: #fafafa;
  padding: 16px;
  border-radius: 4px;
}

.pagination-wrapper {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
}
</style>
