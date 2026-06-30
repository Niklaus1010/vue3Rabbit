import { useIntersectionObserver } from '@vueuse/core'

// 定義懶加載
export const lazyPlugin = {
  install (app) {
    app.directive('img-lazy', {
    mounted (el, binding) {
      // el: 指令綁定的元素，這裡綁定的是 img
      // binding: binding.value 指令等於號後面綁定的表達式的值 圖片 url
      console.log(el, binding) 
      // 監聽視口元素 target -> el
      const { stop } = useIntersectionObserver(
        el, 
        ([{ isIntersecting }]) => {
          console.log(isIntersecting)
          if (isIntersecting) {
            // 進入視口區域 可能需要做個判斷是否有圖片，否則會一直重複請求
            el.src = binding.value
            stop() // 調內置方法，在第一次圖片載入完畢後停止監聽
          }
        }
      )
    }
  })
  }
}