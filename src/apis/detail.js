import httpInstance from "@/utils/http"

export const getDetail = (id) => {
  return httpInstance({
    url: '/goods',
    params: {
      id
    }
  })
}

/**
 * 獲取熱榜商品
 * @param {Number} id - 商品id
 * @param {Number} type - 1代表24小時熱銷榜 2代表周熱銷榜
 * @param {Number} limit - 獲取個數
 */
export const getHotGoodsAPI = ({ id, type, limit = 3 }) => {
  return httpInstance({
    url:'/goods/hot',
    params:{
      id, 
      type, 
      limit
    }
  })
}