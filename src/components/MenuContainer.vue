<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div
      class="relative z-2 bg-white dark:bg-dark-bg lg:min-h-screen lg:flex lg:items-center flex-col menu-container w-full rounded-t-xl"
    >
      <div class="relative flex items-center justify-center">
        <CategoryItems @category-selected="handleCategorySelected" />
      </div>
      <div v-if="isLoading" class="flex justify-center items-center min-h-[300px]">
        <SpinnerUI />
      </div>
      <div
        v-else
        class="flex flex-wrap justify-center gap-4 p-4"
      >
        <MenuCard
          v-for="(item, index) in filteredMenuItems"
          :key="index"
          :imageUrl="item.imageUrl"
          :name="item.name"
          :description="item.description"
          :details="item.details"
          :price="item.price"
          :currency="item.currency"
          class="transform opacity-0 translate-y-4 animate-fadeIn"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MenuCard from './ui/MenuCard.vue'
import CategoryItems from './CategoryItems.vue'
import SpinnerUI from './ui/SpinnerUI.vue'
import { handleFetchPromise } from '../utils/HandleRequests'
import { MENU_DATA_URL } from '../constants/urls'
import type { MenuData } from '../types/MenuData'

const selectedCategory = ref<string>('Desserts')
const menuData = ref<MenuData | null>(null)
const isLoading = ref(true)
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
  } finally {
    isLoading.value = false
  }
})()
</script>

<style scoped>
.menu-container {
  margin-top: -50px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
  animation-delay: calc(var(--tw-translate-y) * 50ms);
}
</style>
