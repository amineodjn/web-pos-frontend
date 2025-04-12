<template>
  <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
    <div class="mb-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Menu Items
      </h2>
      <CategoryNavigation
        v-model="selectedCategory"
        :categories="menuStore.categories"
      />
      <!-- Menu Categories -->
      <div class="space-y-8 max-h-[370px] overflow-y-auto">
        <template v-if="selectedCategory === 'All'">
          <OrderCategorySection
            v-for="category in menuStore.categories"
            :key="category"
            :category="category"
            :items="menuStore.items[category]"
            :onIntersect="() => {}"
          />
        </template>
        <template v-else>
          <OrderCategorySection
            :category="selectedCategory"
            :items="menuStore.items[selectedCategory] || []"
            :onIntersect="() => {}"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMenuStore } from '../../stores/menuStore'
import OrderCategorySection from './OrderCategorySection.vue'
import CategoryNavigation from './CategoryNavigation.vue'

const menuStore = useMenuStore()
const selectedCategory = ref('All')
</script>
