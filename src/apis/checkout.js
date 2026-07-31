import httpInstance from "@/utils/http"

// 取得訂單詳情
export const getCheckInfoAPI = () => {
  return httpInstance({
    url: '/member/order/pre'
  })
}