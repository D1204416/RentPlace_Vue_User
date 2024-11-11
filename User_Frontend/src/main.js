//import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import SideBar from './components/SideBar.vue'
import Login from './components/Login.vue'
import Foot from './components/Foot.vue'    


const app = createApp(App)

app.use(router)
app.component('SideBar',SideBar)
app.component('Login', Login)
app.component('Footer',Foot)


app.mount('#app')
