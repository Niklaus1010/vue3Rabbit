import httpInstance from "@/utils/http"

/*
params: {
	orderState:0,
  page:1,
  pageSize:2
}
*/

// 獲取訂單
export const getUserOrder = (params) => {
  return httpInstance({
    url:'/member/order',
    method:'GET',
    params
  })
}

// 取消訂單
export const cancelOrderAPI = (id, cancelReason) => {
  return httpInstance({
    url: `/member/order/${id}/cancel`,
    method: 'PUT',
    data: { cancelReason }
  })
}