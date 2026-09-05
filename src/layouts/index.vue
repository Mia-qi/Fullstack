<template>
  <div class="layout-container">
    <!-- 顶部导航 -->
    <header class="layout-header">
      <div class="header-title">后台管理系统</div>
    </header>

    <!-- 主内容区域 -->
    <main class="layout-content">
      <router-view />
    </main>

    <!-- 底部导航 -->
    <footer class="layout-footer">
      <div class="footer-item" :class="{ active: $route.path === '/home' }" @click="$router.push('/home')">
        <span class="icon">🏠</span>
        <span class="text">首页</span>
      </div>
      <div class="footer-item" :class="{ active: $route.path === '/asset' }" @click="$router.push('/asset')">
        <span class="icon">📦</span>
        <span class="text">资产</span>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'AppLayout'
}
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 顶部导航 */
.layout-header {
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-title {
  font-size: 18px;
  font-weight: 500;
}

/* 主内容区域 */
.layout-content {
  flex: 1;
  padding: 50px 0 60px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

/* 底部导航 */
.layout-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  display: flex;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
}

.footer-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 12px;
}

.footer-item.active {
  color: #1989fa;
}

.footer-item .icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.footer-item .text {
  font-size: 12px;
}
</style>
