import { createApp } from 'vue';
import App from './App.vue'
import "tailwindcss/tailwind.css"

// element ui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { read, utils } from "xlsx"; // 注意处理方法引入方式

import router from './router/index'
import store from './store/index'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}