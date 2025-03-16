<template>
  <div class="flex flex-col items-center justify-center min-h-screen menu-root">
    <div
      class="relative z-2 bg-white dark:bg-dark-bg lg:min-h-screen lg:flex lg:items-center flex-col menu-container w-full rounded-t-xl"
    >
      <MenuHeader
        v-if="!isLoading"
        ref="menuHeader"
        :selectedCategory="selectedCategory"
        @categorySelected="handleCategorySelected"
      />
      
      <div v-if="isLoading" class="flex justify-center items-center min-h-[300px]">
        <SpinnerUI />
      </div>
      
      <div v-else class="menu-sections scroll-container">
        <MenuCategorySection
          v-for="category in availableCategories"
          :key="category"
          :category="category"
          :items="categoryItems?.[category] || []"
          :onIntersect="handleCategoryIntersection"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { MenuData } from '../types/MenuData'
import { handleFetchPromise } from '../utils/HandleRequests'
import { MENU_DATA_URL } from '../constants/urls'
import SpinnerUI from './ui/SpinnerUI.vue'
import MenuHeader from './menu/MenuHeader.vue'
import MenuCategorySection from './menu/MenuCategorySection.vue'

// Constants
const DEBOUNCE_TIME = 150
const SCROLL_DURATION = 1000

// State
const menuHeader = ref<InstanceType<typeof MenuHeader> | null>(null)
const selectedCategory = ref<string>('Desserts')
const menuData = ref<MenuData | null>(null)
const isLoading = ref(true)
const isScrolling = ref(false)
const lastScrollTime = ref(Date.now())

// Computed
const categoryItems = computed(() => menuData.value?.categoryItems)
const availableCategories = computed(() => 
  Object.keys(menuData.value?.categoryItems || {})
    .filter(category => menuData.value?.categoryItems[category]?.length)
)

// Utils
const scrollToCategory = (category: string) => {
  document.getElementById(`category-section-${category}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const updateHeaderHeight = () => {
  const header = document.querySelector('.menu-root') as HTMLElement
  if (!header) return

  const width = window.innerWidth
  const height = width <= 768 ? '60px' : width <= 1024 ? '70px' : '80px'
  header.style.setProperty('--header-height', height)
}

// Event Handlers
function handleCategorySelected(category: string) {
  selectedCategory.value = category
  isScrolling.value = true
  lastScrollTime.value = Date.now()
  
  scrollToCategory(category)
  setTimeout(() => isScrolling.value = false, SCROLL_DURATION)
}

function handleCategoryIntersection(category: string) {
  const now = Date.now()
  if (!isScrolling.value && 
      selectedCategory.value !== category && 
      now - lastScrollTime.value > DEBOUNCE_TIME) {
    selectedCategory.value = category
    lastScrollTime.value = now
    menuHeader.value?.scrollActiveBadgeIntoView()
  }
}

// Watchers
watch(() => selectedCategory.value, () => {
  if (!isScrolling.value) {
    menuHeader.value?.scrollActiveBadgeIntoView()
  }
})

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', updateHeaderHeight)
  updateHeaderHeight()

  handleFetchPromise(MENU_DATA_URL)
    .then(data => menuData.value = data)
    .catch(error => console.error('Failed to fetch menu data:', error))
    .finally(() => isLoading.value = false)
})
</script>

<style scoped>
.menu-root {
  --header-height: 80px;
  --header-height-mobile: 60px;
  --header-height-tablet: 70px;
}

.menu-container {
  margin-top: -50px;
}

.scroll-container {
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 768px) {
  .menu-container { margin-top: -30px }
  .scroll-container { scroll-padding-top: var(--header-height-mobile) }
}
</style>
