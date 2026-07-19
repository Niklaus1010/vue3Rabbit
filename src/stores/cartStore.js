// 封裝購物車模組
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useCartStore = defineStore('cart', () => {
  // 1. 定義 state
  const cartList = ref([])
  // 2. 定義 action - addCart
  const addCart = (goods) => {
    // 加入購物車操作
    // 已添加過 - count + 1
    // 沒有添加過 - 直接 push
    // 思路: 通過配對傳遞過來的商品對象中的 skuId 能不能在 cartList 中找到，找到就是加入過
    const item = cartList.value.find(item => goods.skuId === item.skuId)
    if (item) {
      // 找到: 在已加入購物車的商品添加數量
      item.count++ // 有 bug 第一個添加數量是正常的 後續再添加只會新增一件
    } else {
      // 沒找到: 在購物車新增商品
      cartList.value.push(goods)
    }
  }

  // 刪除購物車
  const delCart = (skuId) => {
    /**
     * 思路:
     * 1. 找到要刪除項的下標值 - splice
     * 2. 使用數據的過濾方法 - filter
     */
    const index = cartList.value.findIndex((item) => skuId === item.id) 
    cartList.value.splice(index, 1)
  }

  // 計算屬性
  // 1. 總數 所有項的 count 之和
  const allCount = computed(() => cartList.value.reduce((prev, current) => prev + current.count, 0))
  // 2. 總價 所有項的 count * price 之和
  const allPrice = computed(() => cartList.value.reduce((prev, current) => prev + current.count * current.price, 0))
  // 3. 空車，可用於模板顯示，加上去逛逛按鈕
  const isEmptyCart = computed(() => cartList.value.length === 0) 
  return {
    cartList,
    addCart,
    delCart,
    allCount,
    allPrice,
    isEmptyCart
  }
}, {
  persist: true
})
