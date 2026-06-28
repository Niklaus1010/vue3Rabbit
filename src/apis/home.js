import httpInstance from "@/utils/http"



// 獲取 banner 
export function getBannerAPI () {
  return httpInstance({
    url: '/home/banner'
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