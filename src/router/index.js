import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入你的页面，先建一个简单测试页面 views/home/index.vue
import Home from '@/views/home/index.vue'

// 注册路由插件
Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    component: Home
  },
  {
    path: '/',
    redirect: '/home'
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
