<script setup>
import { getCategoryFilterAPI, getSubCategoryAPI } from '@/apis/category'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import GoodsItem from '../Home/components/GoodsItem.vue'

// 獲取麵包屑導航數據
const categoryData = ref({})
const route = useRoute()
const getCategoryData = async () => {
  const res = await getCategoryFilterAPI(route.params.id)
  categoryData.value = res.result
}

onMounted(() => getCategoryData())

// 獲取基礎列表數據渲染
const goodList = ref([])
// 基礎參數
const reqData = ref({
  categoryId: route.params.id,
  page: 1,
  pageSize: 20,
  sortField: 'publishTime'
})
const getGoodList = async () => {
  const res = await getSubCategoryAPI(reqData.value)
  // console.log(res)
  goodList.value = res.result.items
}

onMounted(() => getGoodList())

// tab 欄切換
const tabChange = () => {
  // console.log('tab切換了', reqData.value.sortField)
  // 重置頁面為1
  reqData.value.page = 1
  getGoodList()
  
}

// 載入更多
const disabled = ref(false)
const load = async () => {
  // 載入下一頁的數據
  reqData.value.page++
  const res = await getSubCategoryAPI(reqData.value)
  goodList.value = [...goodList.value, ...res.result.items] // 不確定用push行不行
  // 載入完畢 停止監聽，.items是 arr，永遠不會為0，重新往上再往下會發起多次請求
  // 所以改用.items.length
  if (res.result.items.length === 0) {
    disabled.value = true
  }
}
</script>

<template>
  <div class="container ">
    <!-- 麵包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <!-- 兩個都加 v-if，避免載入請求未回來時，只有出現兩個箭頭的情況 -->
        <el-breadcrumb-item v-if="categoryData.parentName" :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item v-if="categoryData.name" :to="{ path: `/category/${categoryData.parentId}` }">{{ categoryData.parentName }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ categoryData.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sub-container">
      <el-tabs v-model="reqData.sortField" @tab-change="tabChange">
        <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
        <el-tab-pane label="最高人氣" name="orderNum"></el-tab-pane>
        <el-tab-pane label="評論最多" name="evaluateNum"></el-tab-pane>
      </el-tabs>
      <div class="body" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
        <!-- 商品列表-->
        <GoodsItem v-for="goods in goodList" :goods="goods" :key="goods.id"></GoodsItem>
      </div>
    </div>
  </div>

</template>



<style lang="scss" scoped>
.bread-container {
  padding: 25px 0;
  color: #666;
}

.sub-container {
  padding: 20px 10px;
  background-color: #fff;

  .body {
    display: flex;
    flex-wrap: wrap;
    // 給最小高度讓載入時的畫面不會往上縮
    min-height: 600px;
    padding: 0 10px;
  }

  .goods-item {
    display: block;
    width: 220px;
    margin-right: 20px;
    padding: 20px 30px;
    text-align: center;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }


}
</style>