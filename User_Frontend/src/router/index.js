import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import CardView from '../views/CardView.vue'
import CardInfoView from '../views/CardInfoView.vue'
import BookingDateView from '@/views/BookingDateView.vue'
import BookingFormView from '../views/BookingFormView.vue'
import BookingPaymentView from '../views/BookingPaymentView.vue'
import BookingFinishView from '../views/BookingFinishView.vue'
import DecodeQRCodeView from "@/views/DecodeQRCodeView.vue"; // 修正命名，首字母大寫

import UserOrderView from '../views/UserOrderView.vue'
import UserInfoView from '../views/UserInfoView.vue'
import UserOrderInfoView from '../views/UserOrderInfoView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // 該頁面網址
      name: 'home', // 呼叫該頁面的名稱
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
      props: true,
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
      path: '/bookingDate/:id',
      name: 'BookingDateView',
      component: BookingDateView,
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
          },
          {
            text: '預約流程',
            path: '/bookingDate'
          }
        ]
      }
    },
    {
      path: '/bookingForm/:id',
      name: 'BookingFormView',
      component: BookingFormView,
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
          },
          {
            text: '預約流程',
            path: '/bookingForm'
          }
        ]
      }
    },
    {
      path: '/bookingPayment/:id',
      name: 'BookingPaymentView',
      component: BookingPaymentView,
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
          },
          {
            text: '預約流程',
            path: '/bookingPayment'
          }
        ]
      }
    },
    {
      path: '/bookingFinish/:id',
      name: 'BookingFinishView',
      component: BookingFinishView,
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
          },
          {
            text: '預約流程',
            path: '/bookingFinish'
          }
        ]
      }
    },
    {
      path: '/decodeQRCode', // 單獨配置 decodeQRCodeView 的路由
      name: 'DecodeQRCodeView',
      component: DecodeQRCodeView,
      meta: {
        breadcrumb: [
          {
            text: '場地租借',
            path: '/'
          },
          {
            text: '解碼 QR Code',
            path: '/decodeQRCode'
          }
        ]
      }
    },
    {
      path: '/userOrder',
      name: 'userOrderView',
      component: UserOrderView,
    },
    {
      path: '/userInfo',
      name: 'userInfoView',
      component: UserInfoView,
    },
    {
      path: '/userOrderInfo/:id',
      name: 'userOrderInfoView',
      component: UserOrderInfoView,
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
