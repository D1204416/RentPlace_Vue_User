//import './assets/main.css'
import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import SideBar from './components/SideBar.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import Login from './components/Login.vue'
import Foot from './components/Foot.vue' 

   
const app = createApp(App)
const pinia = createPinia()


app.use(pinia)  // 順序很重要: 先使用 pinia, 再使用 router
app.use(router)
app.component('SideBar',SideBar)
app.component('Breadcrumb',Breadcrumb)
app.component('Login', Login)
app.component('Foot',Foot)




app.mount('#app')
