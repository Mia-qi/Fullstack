<template>
  <div class="table-filtering">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TableFiltering',
  props: {
    formItemList: Array,
    pageTitle: String,
    defaultFormItemList: Array,
    mineralProjectBidDto: Object
  },
  methods: {
    searchTable() {
      this.$emit('searchTable')
    },
    resetTable() {
      this.$emit('resetTable')
    },
    upOrDownMore() {
      this.$emit('upOrDownMore')
    }
  }
}
</script>

<style scoped>
.table-filtering {
  padding: 16px;
  background: #fff;
  margin-bottom: 16px;
}
</style>
