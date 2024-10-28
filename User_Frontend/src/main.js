//import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import SideBar from './components/SideBar.vue'


const app = createApp(App)

app.use(router)
app.component('SideBar',SideBar)


app.mount('#app')
