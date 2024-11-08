//import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import SideBar from './components/SideBar.vue'
import Login from './components/Login.vue'



const app = createApp(App)
const pinia = createPinia()

app.use(pinia)  // 這行很重要！
app.use(router)
app.component('SideBar',SideBar)
app.component('Login', Login)



app.mount('#app')
