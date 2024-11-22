//import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import SideBar from './components/SideBar.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import Search from './components/Search.vue'
import Login from './components/Login.vue'
import Foot from './components/Foot.vue' 

   



const app = createApp(App)
const pinia = createPinia()

app.use(pinia)  // 這行很重要！
app.use(router)
app.component('SideBar',SideBar)
app.component('Breadcrumb',Breadcrumb)
app.component('Search',Search)
app.component('Login', Login)
app.component('Foot',Foot)




app.mount('#app')
