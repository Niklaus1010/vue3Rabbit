import httpInstance from '@/utils/http'

export const getCategoryAPI = (id) => {
  return httpInstance({
    url: '/category',
    params: {
      id
    }
  })
}

/**
 * @description: 獲取 二級分類數據列表
 * @param {*} id 分類id
 * @returns {*}
 * 文檔無此接口，在影片中 Day4-02
 */ 
export const getCategoryFilterAPI = (id) => {
  return httpInstance({
    url: '/category/sub/filter',
    params: {
      id
    }
  })
}

/**
 * @description: 獲取導航數據
 * @data { 
    categoryId: 1005000 ,
    page: 1,
    pageSize: 20,
    sortField: 'publishTime' | 'orderNum' | 'evaluateNum'
  } 
 * @return {*}
 */
export const getSubCategoryAPI = (data) => {
  return httpInstance({
    url:'/category/goods/temporary',
    method:'POST', // 用 post 是因為有很多參數要傳
    data
  })
}
