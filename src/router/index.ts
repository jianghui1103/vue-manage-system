import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'playable',
    component: () => import('@/pages/playable/playable.vue'), // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/roi',
    name: 'Roi',
    component: () => import('@/pages/roi/roi.vue'), // 注意这里要带上 文件后缀.vue
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
