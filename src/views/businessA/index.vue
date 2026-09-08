<template>
  <div class="pc-asset-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>{{ pageTitle }}</h2>
      <el-button @click="goBack">返回</el-button>
    </div>

    <div class="page-content">
      <!-- Tab页签：对应三个tab：基本信息｜其他费用明细｜附件 -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="0">
          <el-collapse v-model="activeCollapseKeys">
            <!-- 基础信息折叠面板 -->
            <el-collapse-item title="基础信息" name="base">
              <!-- 动态渲染表单 -->
              <div class="form-item-wrap" v-for="item in formItemList" :key="item.value">
                <div class="label-row">
                  <span class="red-star" v-if="item.rules">*</span>
                  <span class="label-text">{{ item.label }}</span>
                </div>

                <!-- 只读模式：查看、禁用 -->
                <div v-if="item.disabled || clickType === 'look'" class="readonly-text">
                  {{ formData[item.value] || '—' }}
                </div>

                <!-- 编辑模式 -->
                <div v-else>
                  <!-- 选择器 -->
                  <el-select
                    v-if="item.value === 'thirdUnit'"
                    v-model="formData[item.value]"
                    placeholder="请选择"
                    @change="thirdUnitChange"
                  >
                    <el-option v-for="opt in thirdUnitList" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                  <!-- 输入框 -->
                  <el-input
                    v-else-if="item.type === 'string'"
                    v-model="formData[item.value]"
                    :placeholder="item.placeholder || '请输入' + item.label"
                  />
                  <!-- 数字输入 -->
                  <el-input-number
                    v-else-if="item.type === 'number'"
                    v-model="formData[item.value]"
                    :placeholder="item.placeholder || '请输入'"
                    controls-position="right"
                  />
                  <!-- 日期 -->
                  <el-date-picker
                    v-else-if="item.type === 'date'"
                    v-model="formData[item.value]"
                    type="date"
                    placeholder="请选择日期"
                    value-format="YYYY-MM-DD"
                  />
                </div>
              </div>
            </el-collapse-item>

            <!-- 资产详情折叠面板 -->
            <el-collapse-item title="资产详情" name="asset">
              <div class="form-item-wrap" v-for="item in assetDetailItemList" :key="item.value">
                <div class="label-row">
                  <span class="red-star" v-if="item.rules">*</span>
                  <span class="label-text">{{ item.label }}</span>
                </div>
                <div v-if="item.disabled || clickType === 'look'" class="readonly-text">
                  {{ formData[item.value] || '—' }}
                  <span v-if="item.unit"> {{ item.unit }}</span>
                </div>
                <div v-else>
                  <el-input-number
                    v-if="item.type === 'number'"
                    v-model="formData[item.value]"
                    :placeholder="item.placeholder || '请输入'"
                    controls-position="right"
                  />
                  <el-date-picker
                    v-else-if="item.type === 'date'"
                    v-model="formData[item.value]"
                    type="date"
                    placeholder="请选择日期"
                    value-format="YYYY-MM-DD"
                  />
                  <el-input v-else v-model="formData[item.value]" :placeholder="item.placeholder || '请输入'" />
                </div>
              </div>
            </el-collapse-item>

            <!-- 备注 -->
            <el-collapse-item title="备注" name="remark">
              <el-input
                v-model="formData.remark"
                type="textarea"
                :rows="3"
                placeholder="请输入备注信息"
                :readonly="clickType === 'look'"
              />
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <!-- Tab2：其他费用明细（子表） -->
        <el-tab-pane label="其他费用明细" name="1">
          <div class="table-tool-bar">
            <el-button v-if="clickType !== 'look'" type="primary" icon="Plus" @click="addTableRow">新增行</el-button>
          </div>

          <!-- PC端表格 -->
          <el-table :data="tableData" border stripe style="width: 100%">
            <el-table-column prop="expenseName" label="费用名称">
              <template #default="{ row }">
                <el-input v-model="row.expenseName" placeholder="费用名称" :readonly="clickType === 'look'" />
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="120">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.quantity"
                  placeholder="数量"
                  :readonly="clickType === 'look'"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column prop="unitPriceIncludeTax" label="含税单价(元)" width="140">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.unitPriceIncludeTax"
                  placeholder="含税单价"
                  :readonly="clickType === 'look'"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column prop="unitPriceExcludeTax" label="不含税单价(元)" width="150">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.unitPriceExcludeTax"
                  placeholder="不含税单价"
                  :readonly="clickType === 'look'"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column prop="taxRate" label="税率(%)" width="120">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.taxRate"
                  placeholder="税率"
                  :readonly="clickType === 'look'"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column prop="amountExcludeTax" label="不含税金额" width="130">
              <template #default="{ row }">
                {{ row.amountExcludeTax || 0 }}
              </template>
            </el-table-column>
            <el-table-column v-if="clickType !== 'look'" label="操作" width="100" fixed="right">
              <template #default="{ $index }">
                <el-button type="danger" link icon="Delete" @click="deleteTableRow($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- Tab3：附件 -->
        <el-tab-pane label="附件" name="2">
          <el-upload
            v-model:file-list="fileData"
            action="#"
            :disabled="clickType === 'look'"
            multiple
            :auto-upload="false"
          >
            <el-button type="primary">选择文件</el-button>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 底部操作按钮 -->
    <div class="footer-btn-bar" v-if="clickType !== 'look'">
      <el-button type="primary" @click="handleSave" style="width: 100%">保存</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const pageTitle = ref('资产登记')
const clickType = ref('add')
const activeTab = ref('0')
const activeCollapseKeys = ref(['base', 'asset', 'remark'])

const formData = reactive({
  documentName: '',
  thirdUnit: '',
  managementCode: '',
  model: '',
  assetRegistrationDate: '',
  startUsingDate: '',
  purchaseOriginalValue: '',
  originalValue: '',
  residualValue: '',
  residualValueRate: '',
  remark: ''
})

const formItemList = [
  {
    label: '单据名称',
    value: 'documentName',
    type: 'string',
    rules: [{ required: true, message: '请输入单据名称' }]
  },
  { label: '所属三级单位', value: 'thirdUnit', type: 'select' },
  { label: '管理编号', value: 'managementCode', type: 'string' },
  { label: '型号', value: 'model', type: 'string' }
]

const assetDetailItemList = [
  {
    label: '资产登记日期',
    value: 'assetRegistrationDate',
    type: 'date',
    rules: [{ required: true, message: '请选择资产登记日期' }]
  },
  { label: '启用日期', value: 'startUsingDate', type: 'date' },
  { label: '购置原值', value: 'purchaseOriginalValue', type: 'number', unit: '元' },
  { label: '组资原值', value: 'originalValue', type: 'number', unit: '元' },
  { label: '残值', value: 'residualValue', type: 'number', unit: '元' },
  { label: '残值率', value: 'residualValueRate', type: 'number', unit: '%' }
]

const thirdUnitList = ref([])
const tableData = ref([])
const fileData = ref([])

onMounted(() => {
  const query = route.query
  if (query.type) {
    clickType.value = query.type
  }
  if (clickType.value === 'look') {
    pageTitle.value = '资产登记-查看'
  } else if (clickType.value === 'edit') {
    pageTitle.value = '资产登记-编辑'
  }
  if (query.id) {
    getDetail(query.id)
  }
})

function goBack() {
  router.back()
}

function thirdUnitChange() {}

async function getDetail(id) {}

function addTableRow() {
  tableData.value.push({
    itemKey: Math.random().toString(36),
    expenseName: '',
    quantity: null,
    unitPriceIncludeTax: null,
    unitPriceExcludeTax: null,
    taxRate: null,
    amountExcludeTax: 0
  })
}

function deleteTableRow(index) {
  tableData.value.splice(index, 1)
}

function handleSave() {
  ElMessage.success('保存成功')
  goBack()
}
</script>

<style lang="less" scoped>
.pc-asset-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #eee;
  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
}
.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 80px;
  background: #fff;
  margin: 16px;
  border-radius: 8px;
}
.form-item-wrap {
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
  .label-row {
    margin-bottom: 6px;
    .red-star {
      color: red;
      margin-right: 4px;
    }
    .label-text {
      font-size: 14px;
    }
  }
  .readonly-text {
    font-size: 14px;
    color: #666;
  }
}
.table-tool-bar {
  padding: 12px 0;
  background: #fff;
  margin-bottom: 12px;
}
.footer-btn-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 24px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
}
</style>
