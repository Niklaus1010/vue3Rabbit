import { createRouter, createWebHistory } from 'vue-router'
// createRouter: 創建路由實例
// createWebHistory: 創建history模式的路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login', component: () => import('@/views/Login/index.vue')
    },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      children: [
        {
          path: '/home', // 默認二級路由
          component: () => import('@/views/Home/index.vue')
        },
        {
          path: '/category',
          component: () => import('@/views/Category/index.vue')
        }
      ]
    }
  ]
})

export default router
