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
          path: '', // 默認二級路由 有點怪
          component: () => import('@/views/Home/index.vue')
        },
        {
          path: 'category/:id',
          component: () => import('@/views/Category/index.vue')
        },
        {
          path: 'category/sub/:id',
          component: () => import('@/views/SubCategory/index.vue')
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/Detail/index.vue')
        },
        {
          path: 'cartlist',
          component: () => import('@/views/CartList/index.vue')
        },
        {
          path: 'checkout',
          component: () => import('@/views/Checkout/index.vue')
        },
        {
          path: 'pay',
          component: () => import('@/views/Pay/index.vue')
        },
        {
          path: 'paycallback', // 後端有指定
          component: () => import('@/views/Pay/PayBack.vue')
        },
        {
          path: 'member',
          component: () => import('@/views/Member/index.vue'),
          redirect: 'member/user',
          children: [
            {
              path: 'user',
              component: () => import('@/views/Member/components/UserInfo.vue')
            },
            {
              path: 'order',
              component: () => import('@/views/Member/components/UserOrder.vue')
            }
          ]
        }
      ]
    }
  ],
  // 路由滾動行為訂製
  scrollBehavior () {
    return {
      top: 0    
    }
  }
})

export default router

