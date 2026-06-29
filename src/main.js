import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 引入初始化樣式文件
import '@/styles/common.scss'

import { useIntersectionObserver } from '@vueuse/core'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// 定義全局指令
app.directive('img-lazy', {
  mounted (el, binding) {
    // el: 指令綁定的元素，這裡綁定的是 img
    // binding: binding.value 指令等於號後面綁定的表達式的值 圖片 url
    console.log(el, binding) 
    // 監聽視口元素 target -> el
    useIntersectionObserver(
      el, 
      ([{ isIntersecting }]) => {
        console.log(isIntersecting)
        if (isIntersecting) {
          // 進入視口區域 可能需要做個判斷是否有圖片，否則會一直重複請求
          el.src = binding.value
        }
      }
    )
  }
})