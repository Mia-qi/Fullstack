<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script>
import Layout from '@/layouts/index.vue'
export default {
  name: 'App',
  components: { Layout }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* 添加移动端适配 */
  font-size: 16px; /* 默认字体大小 */
  -webkit-text-size-adjust: 100%; /* 防止iOS上字体大小自动调整 */
}
</style>
