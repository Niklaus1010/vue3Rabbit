import { defineStore } from "pinia"
import { ref } from "vue"
import { loginAPI } from '@/apis/user'
import { useCartStore } from "./cartStore"

export const useUserStore = defineStore('user', () => {
  const cartStore = useCartStore()
  // 1. 定義管理用戶數據的 state
  const userInfo = ref({})
  // 2. 定義接口數據的 action 函數
  const getUserInfo = async ({ account, password }) => {
    const res = await loginAPI({ account, password })
    userInfo.value = res.result
  }

  // 退出時，清空用戶資料
  const clearUserInfo = () => {
    userInfo.value = {}
    // 執行清除購物車的 action 不確定用戶登出再登入要不要保留原始購物車
    cartStore.clearCart()
  }
  // 3. 以對象的格式把 state 和 action return
  return {
    userInfo,
    getUserInfo,
    clearUserInfo
  }
}, {
  persist: true // 持久化
})