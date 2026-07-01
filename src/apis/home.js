import httpInstance from "@/utils/http"

// 獲取 banner 
// params = {} ，是為了避免寫 params，然後呼叫時沒傳參數，導致解構錯誤
export const getBannerAPI = (params = {}) => {
  // 默認為1 商品為2
  const { distributionSite = '1' } = params
  return httpInstance({
    url: '/home/banner',
    params: {
      distributionSite
    }
  })
}

/**
 * @description: 獲取 新鮮好物
 * @param {*}
 * @returns {*}
 */ 
export const findNewAPI = () => {
  return httpInstance({
    url: '/home/new'
  })
}

/**
 * @description: 獲取 人氣推薦
 * @param {*}
 * @returns {*}
 */ 
export const findHotAPI = () => {
  return httpInstance({
    url: '/home/hot'
  })
}

/**
 * @description: 獲取 所有商品模組
 * @param {*}
 * @returns {*}
 */ 
export const getGoodsAPI = () => {
  return httpInstance({
    url: '/home/goods'
  })
}