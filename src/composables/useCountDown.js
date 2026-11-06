// 封裝定時器邏輯函數
import { computed, onUnmounted, ref } from 'vue'


export const useCountDown = () => {
  // 1. 響應式數據
  let timer = null
  const time = ref(null)
  // 格式化時間 為 xx 分 xx 秒
  const formatTime = computed(() => {
    if (time.value === null) return '-- 分 -- 秒'
    const total = Math.max(time.value, 0) // 避免倒數到負數
    const minute = String(Math.floor(total / 60)).padStart(2, '0')
    const second = String(total % 60).padStart(2, '0')
    return `${minute} 分 ${second} 秒`
  })

  // 2. 開啟定時器函數
  const start = (currentTime) => {
    // 開始定時器邏輯
    // 重複呼叫時，先清掉舊的定時器，避免同時跑好幾個
    timer && clearInterval(timer)
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