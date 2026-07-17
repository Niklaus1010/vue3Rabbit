// 封裝購物車模組
import { defineStore } from "pinia"
import { ref } from "vue"

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
      item.count++
    } else {
      // 沒找到: 在購物車新增商品
      cartList.value.push(goods)
    }
  }
  return {
    cartList,
    addCart
  }
}, {
  persist: true
})
