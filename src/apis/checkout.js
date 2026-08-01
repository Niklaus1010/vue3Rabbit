import httpInstance from "@/utils/http"

// 取得訂單詳情
export const getCheckInfoAPI = () => {
  return httpInstance({
    url: '/member/order/pre'
  })
}

// 創建訂單
export const createOrderAPI = (data) => {
  return httpInstance({
    url: '/member/order',
    method: 'POST',
    data
  })
}