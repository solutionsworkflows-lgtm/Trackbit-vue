import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/styles/main.css'
import App from './App.vue'
import './index.css'
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import vuetify from './plugins/vuetify'
const pinia = createPinia()
const app = createApp(App)
import { vMaska } from 'maska'
import money from 'v-money3';

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(money);

const options: PluginOptions = {
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
}

app.directive('maska', vMaska)

app.use(Toast, options);
app.mount('#app')