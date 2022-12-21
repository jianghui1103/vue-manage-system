import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layouts/index.vue';

// 批量导入modules文件夹下的所有ts文件
const modules = import.meta.globEager('./modules/**/*.ts');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/playable/index',
  },
  {
    path: '/playable',
    name: 'playable',
    component: Layout,
    redirect: '/playable/index',
    meta: {title: 'pl模版', icon: 'a'},
    children: [
      {
        path: 'index',
        name: 'plIndex',
        component: () => import('@/pages/playable/playable.vue'),
        meta: { title: '模版下载' },
      },
    ]
  },
  {
    path: '/roi',
    name: 'roi',
    component: Layout,
    redirect: '/roi/index',
    meta: {title: 'roi', icon: 'a'},
    children: [
      {
        path: 'index',
        name: 'roiIndex',
        component: () => import('@/pages/roi/roi.vue'),
        meta: { title: 'roi' },
      },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
