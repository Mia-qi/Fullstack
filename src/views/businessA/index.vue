<template>
  <div class="mobile-asset-page">
    <!-- 顶部导航 -->
    <van-nav-bar :title="pageTitle" left-arrow @click-left="goBack" />

    <div class="page-content">
      <!-- Tab页签：对应PC三个tab：基本信息｜其他费用明细｜附件 -->
      <van-tabs v-model="activeTab">
        <van-tab title="基本信息">
          <van-collapse v-model="activeCollapseKeys">
            <!-- 基础信息折叠面板 -->
            <van-collapse-item title="基础信息" name="base">
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
                  <!-- 选择器示例 -->
                  <van-select
                    v-if="item.value === 'thirdUnit'"
                    v-model="formData[item.value]"
                    :options="thirdUnitList"
                    placeholder="请选择"
                    @change="thirdUnitChange"
                  />
                  <!-- 输入框 -->
                  <van-field
                    v-else-if="item.type === 'string'"
                    v-model="formData[item.value]"
                    :placeholder="item.placeholder || '请输入' + item.label"
                  />
                  <!-- 数字输入 -->
                  <van-field
                    v-else-if="item.type === 'number'"
                    v-model.number="formData[item.value]"
                    type="digit"
                    :placeholder="item.placeholder || '请输入'"
                  />
                  <!-- 日期 -->
                  <van-field
                    v-else-if="item.type === 'date'"
                    readonly
                    :value="formData[item.value]"
                    placeholder="请选择日期"
                    @click="showDatePopup(item.value)"
                  />
                </div>
              </div>
            </van-collapse-item>

            <!-- 资产详情折叠面板 -->
            <van-collapse-item title="资产详情" name="asset">
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
                  <van-field
                    v-model="formData[item.value]"
                    :placeholder="item.placeholder || '请输入'"
                    :type="item.type === 'number' ? 'digit' : 'text'"
                  />
                </div>
              </div>
            </van-collapse-item>

            <!-- 备注 -->
            <van-collapse-item title="备注" name="remark">
              <van-field
                v-model="formData.remark"
                type="textarea"
                rows="3"
                placeholder="请输入备注信息"
                :readonly="clickType === 'look'"
              />
            </van-collapse-item>
          </van-collapse>
        </van-tab>

        <!-- Tab2：其他费用明细（子表） -->
        <van-tab title="其他费用明细">
          <div class="table-tool-bar">
            <van-button v-if="clickType !== 'look'" size="small" type="primary" icon="plus" @click="addTableRow"
              >新增行</van-button
            >
          </div>

          <!-- 移动端列表代替表格 -->
          <div class="sub-table-wrap">
            <div class="table-card" v-for="(row, idx) in tableData" :key="row.itemKey">
              <div class="card-row">
                <span class="k">费用名称</span>
                <van-field v-model="row.expenseName" placeholder="费用名称" :readonly="clickType === 'look'" />
              </div>
              <div class="card-row">
                <span class="k">数量</span>
                <van-field
                  v-model.number="row.quantity"
                  type="digit"
                  placeholder="数量"
                  :readonly="clickType === 'look'"
                />
              </div>
              <div class="card-row">
                <span class="k">含税单价(元)</span>
                <van-field
                  v-model.number="row.unitPriceIncludeTax"
                  type="digit"
                  placeholder="含税单价"
                  :readonly="clickType === 'look'"
                />
              </div>
              <div class="card-row">
                <span class="k">不含税单价(元)</span>
                <van-field
                  v-model.number="row.unitPriceExcludeTax"
                  type="digit"
                  placeholder="不含税单价"
                  :readonly="clickType === 'look'"
                />
              </div>
              <div class="card-row">
                <span class="k">税率(%)</span>
                <van-field
                  v-model.number="row.taxRate"
                  type="digit"
                  placeholder="税率"
                  :readonly="clickType === 'look'"
                />
              </div>
              <div class="card-row">
                <span class="k">不含税金额</span>
                <span>{{ row.amountExcludeTax || 0 }}</span>
              </div>
              <van-button
                v-if="clickType !== 'look'"
                type="danger"
                size="mini"
                icon="delete"
                @click="deleteTableRow(idx)"
                >删除</van-button
              >
            </div>
          </div>
        </van-tab>

        <!-- Tab3：附件 -->
        <van-tab title="附件">
          <van-uploader v-model="fileData" :disabled="clickType === 'look'" multiple accept="*" />
        </van-tab>
      </van-tabs>
    </div>

    <!-- 底部操作按钮 -->
    <div class="footer-btn-bar" v-if="clickType !== 'look'">
      <van-button block type="primary" @click="handleSave">保存</van-button>
    </div>

    <!-- 日期选择弹窗 -->
    <van-popup v-model="dateShow" position="bottom">
      <van-datetime-picker
        v-model="currentSelectDate"
        type="date"
        @confirm="onDateConfirm"
        @cancel="dateShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'MobileAssetRegister',
  data() {
    return {
      pageTitle: '资产登记',
      clickType: 'add', // add / edit / look
      activeTab: 0,
      activeCollapseKeys: ['base', 'asset', 'remark'],
      dateShow: false,
      currentSelectDate: '',
      currentDateField: '',

      formData: {
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
      },
      // 对应PC端formItemList配置，直接复用配置思想
      formItemList: [
        {
          label: '单据名称',
          value: 'documentName',
          type: 'string',
          rules: [{ required: true, message: '请输入单据名称' }]
        },
        { label: '所属三级单位', value: 'thirdUnit', type: 'select' },
        { label: '管理编号', value: 'managementCode', type: 'string' },
        { label: '型号', value: 'model', type: 'string' }
      ],
      assetDetailItemList: [
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
      ],
      thirdUnitList: [],
      // 子表 其他费用明细
      tableData: [],
      fileData: []
    }
  },
  mounted() {
    // 模拟路由获取页面模式
    const query = this.$route.query
    if (query.type) {
      this.clickType = query.type
    }
    if (this.clickType === 'look') {
      this.pageTitle = '资产登记-查看'
    } else if (this.clickType === 'edit') {
      this.pageTitle = '资产登记-编辑'
    }
    // 如果有id，调用getDetail 拉取详情，同PC逻辑
    if (query.id) {
      this.getDetail(query.id)
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    showDatePopup(field) {
      this.currentDateField = field
      this.currentSelectDate = this.formData[field] || new Date()
      this.dateShow = true
    },
    onDateConfirm(val) {
      this.formData[this.currentDateField] = this.$moment(val).format('YYYY‑MM‑DD')
      this.dateShow = false
    },
    thirdUnitChange() {
      // 业务逻辑同PC
    },
    // 获取详情，和PC业务逻辑保持一致
    async getDetail(id) {
      // const res = await getAssetListById(id)
      // Object.keys(res.data).forEach(key=> this.$set(this.formData, key, res.data[key]))
      // this.tableData = res.data.otherFreeDtoList
      // this.fileData = res.data.attachment
    },
    // 子表操作
    addTableRow() {
      this.tableData.push({
        itemKey: Math.random().toString(36),
        expenseName: '',
        quantity: null,
        unitPriceIncludeTax: null,
        unitPriceExcludeTax: null,
        taxRate: null,
        amountExcludeTax: 0
      })
    },
    deleteTableRow(index) {
      this.tableData.splice(index, 1)
    },
    // 保存，和PC handleSave逻辑对齐
    handleSave() {
      // 1.表单校验
      // 2.组装参数 formData + tableData + fileData
      // 3.调用新增/编辑接口
      this.$toast.success('保存成功')
      this.goBack()
    }
  }
}
</script>

<style lang="less" scoped>
.mobile-asset-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;
}
.page-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
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
  padding: 12px 16px;
  background: #fff;
}
.sub-table-wrap {
  padding: 0 12px;
}
.table-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
  .card-row {
    display: flex;
    align-items: center;
    margin: 6px 0;
    .k {
      width: 110px;
      font-size: 13px;
      color: #666;
    }
  }
}
.footer-btn-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #fff;
}
</style>
