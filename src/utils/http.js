// axios 基礎封裝
import axios from 'axios'
import * as OpenCC from 'opencc-js'

// 建立簡體 -> 繁體(台灣)轉換器
const converter = OpenCC.Converter({ from: 'cn', to: 'tw' })

// 遞迴轉換物件/陣列中的所有字串欄位
function deepConvert(data) {
  if (typeof data === 'string') {
    return converter(data)
  }
  if (Array.isArray(data)) {
    return data.map(deepConvert)
  }
  if (data !== null && typeof data === 'object') {
    const result = {}
    for (const key in data) {
      result[key] = deepConvert(data[key])
    }
    return result
  }
  return data
}

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
// 先解成 res.data，後面要拿數據時，就不需要 res.data 了，直接 res 即可
httpInstance.interceptors.response.use(res => {
  return deepConvert(res.data)
}, e => {
  return Promise.reject(e)
})

export default httpInstance