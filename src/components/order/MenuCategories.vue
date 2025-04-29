<template>
  <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
    <div class="mb-4">
      <CategoryNavigation
        v-model="selectedCategory"
        :categories="menuStore.categories"
      />
      <!-- Menu Categories -->
      <div
        class="space-y-8 md:max-h-[270px] md:min-h-[270px] xl:max-h-[500px] xl:min-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        <template v-if="selectedCategory === 'All'">
          <OrderCategorySection
            v-for="category in menuStore.categories"
            :key="category.categoryId"
            :category="category.categoryName"
            :items="category.categoryItems || []"
            :onIntersect="() => {}"
          />
        </template>
        <template v-else>
          <OrderCategorySection
            :category="selectedCategory"
            :items="selectedCategoryItems"
            :onIntersect="() => {}"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMenuStore } from '../../stores/menuStore'
import OrderCategorySection from './OrderCategorySection.vue'
import CategoryNavigation from './CategoryNavigation.vue'
import type { Category } from '../../types/MenuData'

const menuStore = useMenuStore()
const selectedCategory = ref('All')

const selectedCategoryItems = computed(() => {
  if (selectedCategory.value === 'All') return []
  const category = menuStore.categories.find(
    c => c.categoryName === selectedCategory.value
  )
  return category?.categoryItems || []
})
</script>

<style>
/* Custom scrollbar styles */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  border-radius: 4px;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
}

.dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}
</style>
