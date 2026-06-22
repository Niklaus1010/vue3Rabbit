// axios 基礎封裝
import axios from 'axios'

const httpInstance = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// 攔截器

// axios 請求攔截器
httpInstance.interceptors.request.use(config => {
  return config
}, e => Promise.reject(e))

// axios 響應攔截器
httpInstance.interceptors.response.use(res => res.data, e => {
  return Promise.reject(e)
})


export default httpInstance