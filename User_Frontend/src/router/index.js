import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import CardView from '../views/CardView.vue'
import CardInfoView from '../views/CardInfoView.vue'
import qrCode from '@/views/qrCode.vue'
import Qrcodedecode from '@/views/Qrcodedecode.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',   //該頁面網址
      name: 'home',  // 呼叫該頁面的名稱
      component: HomeView,
      meta: {
        breadcrumb: [
          {
            text: '場地租借',
            path: '/'
          }
        ]
      }
    },
    {
      path: '/register',
      name: 'registerView',
      component: RegisterView,
      meta: {
        breadcrumb: [
          {
            text: '場地租借',
            path: '/'
          },
          {
            text: '註冊',
            path: '/register'
          }
        ]
      }
    },
    {
      path: '/card',
      name: 'cardView',
      component: CardView,
      meta: {
        breadcrumb: [
          {
            text: '場地租借',
            path: '/'
          },
          {
            text: '場地資訊',
            path: '/card'
          }
        ]
      }
    },
    {
      path: '/cardInfo/:id',
      name: 'cardInfoView',
      component: CardInfoView,
      props: true,  // 啟用 props 傳遞路由參數
      meta: {
        breadcrumb: [
          {
            text: '場地租借',
            path: '/'
          },
          {
            text: '場地資訊',
            path: '/card'
          },
          {
            text: '詳細資訊',
            path: '/cardInfo'
          }
        ]
      }
    },
    {
      path: '/qrCode',    // 設置該頁面的路徑
      name: 'qrCode',     // 設置該頁面的名稱
      component: qrCode,  // 指定該頁面的組件
    },
    {path: '/Qrcodedecode',
       name: 'Qrcodedecode',
        component: Qrcodedecode},
  ]
})

// 路由守衛，用於檢查用戶是否已經認證
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login')  // 如果需要認證且用戶未登入，跳轉到登入頁
  } else {
    next()  // 繼續導航
  }
})

export default router
