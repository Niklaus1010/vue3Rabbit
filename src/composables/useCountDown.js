// 封裝定時器邏輯函數
import { computed, onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'

export const useCountDown = () => {
  // 1. 響應式數據
  let timer = null
  const time = ref(0)
  // 格式化時間 為 xx 分 xx 秒
  const formatTime = computed(() => dayjs.unix(time.value).format('mm分ss秒'))
  // 2. 開啟定時器函數
  const start = (currentTime) => {
    // 開始定時器邏輯
    // 核心邏輯 每秒減1
    time.value = currentTime
    timer = setInterval(() => {
      time.value--
    }, 1000)
  }
  // 組件銷毀時清除定時器
  onUnmounted(() => {
    timer && clearInterval(timer)
  })
  return {
    formatTime,
    start
  }
}