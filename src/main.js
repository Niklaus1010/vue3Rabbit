import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

// 引入初始化樣式文件
import '@/styles/common.scss'

// 圖標
import '@fortawesome/fontawesome-free/css/all.min.css'

// 引入懶加載指令插件並註冊
import { lazyPlugin } from '@/directives'
// 引入全局組件插件
import { componentPlugin } from '@/components'

const app = createApp(App)
const pinia = createPinia()

// 註冊持久化插件
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(lazyPlugin)
app.use(componentPlugin)

app.mount('#app')


