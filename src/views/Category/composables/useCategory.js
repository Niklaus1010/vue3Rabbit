// 封裝分類數據相關代碼
import { getCategoryAPI } from '@/apis/category'
import { onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'


export function useCategory () {
  // 取得麵包屑導航數據(分類 )
  const categoryData = ref({}) // 接口要求對象
  const route = useRoute()
  // 這裡的(id)是接收下面 onBeforeRouteUpdate 傳過來的，如果不傳新值就以 route.params.id 為默認值
  const getCategory = async (id = route.params.id) => {
    const res = await getCategoryAPI(id)
    categoryData.value = res.result
  }

  // 初次載入
  onMounted(() => getCategory())

  // 法一
  // 目標: 路由參數變化的時候 可以把分類數據接口重新發送
  // to: 目標路由對象，可以拿到最新地址
  onBeforeRouteUpdate((to) => {
    // console.log('路由變化了')
    // 存在問題: 使用最新的路由參數請求最新的分類數據
    // console.log(to) // 此處可拿到最新地址
    getCategory(to.params.id) // 透過傳參的方式將它傳回上面的 getCategory 方法
  })

  // 法二
  // 監聽路由參數變化
  // watch(() => route.params.id, () => {
  //   getCategory()
  // })

  return {
    categoryData
  }
}