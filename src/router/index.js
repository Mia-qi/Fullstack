import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/home/index.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/assetManagement/assetRegistration',
    name: 'AssetRegistration',
    component: () => import('@/views/businessA/index.vue'),
    meta: { title: '资产登记' }
  },
  {
    path: '/assetManagement/assetReform',
    name: 'AssetReform',
    component: () => import('@/views/businessA/index.vue'),
    meta: { title: '资产改造' }
  },
  {
    path: '/assetManagement/assetTransfer',
    name: 'AssetTransfer',
    component: () => import('@/views/businessA/index.vue'),
    meta: { title: '资产转让' }
  },
  {
    path: '/assetManagement/assetScrap',
    name: 'AssetScrap',
    component: () => import('@/views/businessA/index.vue'),
    meta: { title: '资产报废' }
  },
  {
    path: '/assetManagement/assetWriteoff',
    name: 'AssetWriteoff',
    component: () => import('@/views/businessA/index.vue'),
    meta: { title: '资产报损' }
  },
  {
    path: '/assetManagement/assetDisposal',
    name: 'AssetDisposal',
    component: () => import('@/views/businessA/index.vue'),
    meta: { title: '资产处置' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router