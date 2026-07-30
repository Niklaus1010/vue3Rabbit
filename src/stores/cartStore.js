// 封裝購物車模組
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useUserStore } from "./userStore"
import { insertCartAPI, findNewCartListAPI, delCartAPI } from "@/apis/cart"

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const isLogin = computed(() => userStore.userInfo.token)
  // 1. 定義 state
  const cartList = ref([])
  
  // 獲取最新購物車列表 action
  const updateNewList = async() => {
    const res = await findNewCartListAPI()
    cartList.value = res.result
  }

  // 2. 定義 action 
  // 加入購物車
  const addCart = async (goods) => {
    const { skuId, count } = goods
    if (isLogin.value) {
      // 登入之後的加入購物車邏輯
      await insertCartAPI({ skuId, count })
      updateNewList()
    } else {
      // 加入購物車操作
      // 已添加過 - count + 1
      // 沒有添加過 - 直接 push
      // 思路: 通過配對傳遞過來的商品對象中的 skuId 能不能在 cartList 中找到，找到就是加入過
      const item = cartList.value.find((item) => goods.skuId === item.skuId)
      if (item) {
        // 找到: 在已加入購物車的商品添加數量
        item.count += goods.count // 有 bug 第一個添加數量是正常的 後續再添加只會新增一件
      } else {
        // 沒找到: 在購物車新增商品
        cartList.value.push(goods)
      }
    }
  }

  // 刪除購物車
  const delCart = async (skuId) => {
    if (isLogin.value) {
      // 調用接口實現接口購物車中的刪除功能， ids 是由 skuId 所組成的一個數組
      await delCartAPI([skuId])
      // 刪完之後列表刷新
      updateNewList()
    } else {
      /**
       * 思路:
       * 1. 找到要刪除項的下標值 - splice
       * 2. 使用數據的過濾方法 - filter
       */
      const index = cartList.value.findIndex((item) => skuId === item.skuId) 
      cartList.value.splice(index, 1)
    }
  }

  // 清除購物車
  const clearCart = () => {
    cartList.value = []
  }

  // 單選功能
  const singleCheck = (skuId, selected) => {
    // 通過 skuId 找到要修改的那一項，然後把它的 selected 修改為傳過來的 selected
    const item = cartList.value.find((item) => item.skuId === skuId)
    item.selected = selected
  }

  // 全選功能
  const allCheck = (selected) => {
    // 把 cartList 中的每一項 selected 都設置為當前的全選框狀態
    cartList.value.forEach(item => item.selected = selected)
  }

  // 計算屬性
  // 1. 總數 所有項的 count 之和
  const allCount = computed(() => cartList.value.reduce((prev, current) => prev + current.count, 0))
  // 2. 總價 所有項的 count * price 之和
  const allPrice = computed(() => cartList.value.reduce((prev, current) => prev + current.count * current.price, 0))
  // 3. 空車，可用於模板顯示，加上去逛逛按鈕
  const isEmptyCart = computed(() => cartList.value.length === 0) 
  // 4. 已選擇數量 filter 返回結果為數組
  const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((prev, current) => prev + current.count, 0))
  // 5. 已選擇商品價錢總計
  const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((prev, current) => prev + current.count * current.price, 0))
  
  // 是否全選
  // cartList.value.length > 0 考慮到可能會將所有商品刪除(空車)，但全選仍在的問題
  const isAll = computed(() => cartList.value.length > 0 && cartList.value.every((item) => item.selected))



  return {
    cartList,
    allCount,
    allPrice,
    isEmptyCart,
    isAll,
    selectedCount,
    selectedPrice,
    addCart,
    delCart,
    clearCart,
    singleCheck,
    allCheck
  }
}, {
  persist: true
})
