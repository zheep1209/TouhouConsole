import {} from '@/assets/style/base.css'
import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
const app = createApp(App)
import {VueJsonp} from 'vue-jsonp'
app.use(VueAxios, axios,VueJsonp)
app.mount('#app')