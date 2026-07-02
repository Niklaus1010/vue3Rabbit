// 封裝 banner 輪播圖相關的代碼
import { ref, onMounted } from "vue" 
import { getBannerAPI } from '@/apis/home'

export function useBanner () {
  // 聲明輪播圖列表
  // 後端有偷懶 傳1 和 傳2 的圖都相同可以優化
  const bannerList = ref([])

  // 獲取 banner 數據的方法
  const getBanner = async () => {
    const res = await getBannerAPI({ distributionSite: '2' })
    bannerList.value = res.result
  }
  onMounted(() => getBanner())

  // 原始組件有用到，現在封裝函數了要 return 出去
  return {
    bannerList
  }
}