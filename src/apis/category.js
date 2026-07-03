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

