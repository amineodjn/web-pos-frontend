<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div
      class="relative z-2 bg-white dark:bg-gray-900 lg:min-h-screen lg:flex lg:items-center flex-col menu-container w-full rounded-t-xl"
    >
      <div
        class="scroll category-items-container overflow-x-auto overflow-x-scroll"
      >
        <CategoryItems @category-selected="handleCategorySelected" />
      </div>
      <div class="flex flex-wrap justify-center gap-4 p-4">
        <MenuCard
          v-for="(item, index) in filteredMenuItems"
          :key="index"
          :imageUrl="item.imageUrl"
          :name="item.name"
          :description="item.description"
          :details="item.details"
          :price="item.price"
          :currency="item.currency"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MenuCard from './menu/MenuCard.vue'
import CategoryItems from './CategoryItems.vue'
import { handleFetchPromise } from '../utils/HandleRequests'
import { MENU_DATA_URL } from '../constants/urls'
import type { MenuData } from '../types/MenuData'

const selectedCategory = ref<string>('Desserts')
const menuData = ref<MenuData | null>(null)
const categoryItems = computed(() => menuData.value?.categoryItems)

const filteredMenuItems = computed(() => {
  return categoryItems.value?.[selectedCategory.value] || []
})

function handleCategorySelected(category: string) {
  selectedCategory.value = category
}

;(async () => {
  try {
    menuData.value = await handleFetchPromise(MENU_DATA_URL)
  } catch (error) {
    console.error('Failed to fetch menu data', error)
  }
})()
</script>

<style scoped>
.menu-container {
  margin-top: -45px;
}

.scroll {
  overflow-x: scroll;
}
</style>
