import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import CardDivideView from '../views/CardDivideView.vue'
import CardView from '../views/CardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',   //該頁面網址
      name: 'home',  // 呼叫該頁面的名稱
      component: HomeView
    },
    {
      path: '/register',
      name: 'registerView',
      component: RegisterView
    },
    {
      path: '/cardDivide',
      name: 'cardDivideView',
      component: CardDivideView
    },
    {
      path: '/card',
      name: 'cardView',
      component: CardView
    },
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
