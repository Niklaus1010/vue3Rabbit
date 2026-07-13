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