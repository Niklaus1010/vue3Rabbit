<script setup>
import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'
</script>

<template>
    <div>
        <LayoutNav></LayoutNav>
        <LayoutHeader></LayoutHeader>
        <RouterView></RouterView>
        <LayoutFooter></LayoutFooter>
    </div>
</template>