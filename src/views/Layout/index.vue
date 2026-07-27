<script setup>
import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import LayoutFixed from './components/LayoutFixed.vue'

// 觸發獲取導航列表的 action
import { useCategoryStore } from '@/stores/categoryStore.js'
import { onMounted } from 'vue'

// 不確定是不是這樣理解，先在父組件調 pinia 方法，之後子組件只要拿數據，所以最後請求從原本的2次變1次
const categoryStore = useCategoryStore()

onMounted(() => categoryStore.getCategory())
</script>

<template>
    <LayoutFixed></LayoutFixed>
    <LayoutNav></LayoutNav>
    <LayoutHeader></LayoutHeader>
    <!-- 添加key，破壞複用機制，強制銷毀重建，雖可行但畫面會頻閃很醜-->
    <!-- <RouterView :key="$route.fullPath"></RouterView> -->
    <RouterView></RouterView>
    <LayoutFooter></LayoutFooter>
</template>