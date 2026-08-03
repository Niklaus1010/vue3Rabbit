// 封裝所有跟用戶相關的接口
import httpInstance from "@/utils/http"

export const loginAPI = ({account, password}) => {
  return httpInstance({
    url: '/login',
    method: 'POST',
    data: {
      account,
      password
    }
  })
}

// 猜你喜歡
export const getLikeListAPI = ({ limit = 4 }) => {
  return httpInstance({
    url:'/goods/relevant',
    params: {
      limit 
    }
  })
}