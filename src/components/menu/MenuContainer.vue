<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen menu-root w-full"
  >
    <div
      class="relative z-2 bg-white dark:bg-dark-bg lg:min-h-screen lg:flex lg:items-center flex-col menu-container w-full rounded-t-xl"
      :class="{ 'bg-transparent dark:bg-transparent': hasError }"
    >
      <MenuHeader
        v-if="!isLoading && !hasError"
        ref="menuHeader"
        :selectedCategory="selectedCategory"
        :categoryBadges="categoryBadges"
        @categorySelected="handleCategorySelected"
      />

      <div v-if="isLoading" class="relative min-h-[300px] w-full">
        <LoadingOverlay />
      </div>

      <div v-else-if="hasError" class="flex justify-center items-center">
        <ErrorUI
          errorType="menu"
          :title="translateErrors('menu.title')"
          :message="translateErrors('menu.message')"
          :retryText="translateErrors('retry')"
          @retry="fetchMenuData"
        />
      </div>

      <div v-else class="menu-sections scroll-container">
        <MenuCategorySection
          v-for="category in categories"
          :key="category.categoryId"
          :category="category.categoryName"
          :items="category.categoryItems || []"
          :onIntersect="handleCategoryIntersection"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { MenuData } from '../../types/MenuData'
import { useMenuStore } from '../../stores/menuStore'
import LoadingOverlay from '../common/LoadingOverlay.vue'
import ErrorUI from '../common/ErrorUI.vue'
import MenuHeader from './MenuHeader.vue'
import MenuCategorySection from './MenuCategorySection.vue'
import { useTranslate } from '../../composables/useTranslate'

const { translate: translateErrors } = useTranslate('errors')
const menuStore = useMenuStore()

const DEBOUNCE_TIME = 150
const SCROLL_DURATION = 1000

const menuHeader = ref<InstanceType<typeof MenuHeader> | null>(null)
const selectedCategory = ref<string>('')
const isLoading = computed(() => menuStore.isLoading)
const hasError = computed(() => menuStore.error !== null)
const isScrolling = ref(false)
const lastScrollTime = ref(Date.now())

const categories = computed(() => menuStore.categories)
const categoryBadges = computed(() =>
  categories.value.map(cat => cat.categoryName)
)

const scrollToCategory = (category: string) => {
  document
    .getElementById(`category-section-${category}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const updateHeaderHeight = () => {
  const header = document.querySelector('.menu-root') as HTMLElement
  if (!header) return

  const width = window.innerWidth
  const height = width <= 768 ? '60px' : width <= 1024 ? '70px' : '80px'
  header.style.setProperty('--header-height', height)
}

const fetchMenuData = async () => {
  await menuStore.fetchMenuData()
}

function handleCategorySelected(category: string) {
  selectedCategory.value = category
  isScrolling.value = true
  lastScrollTime.value = Date.now()

  scrollToCategory(category)
  setTimeout(() => (isScrolling.value = false), SCROLL_DURATION)
}

function handleCategoryIntersection(category: string) {
  const now = Date.now()
  if (
    !isScrolling.value &&
    selectedCategory.value !== category &&
    now - lastScrollTime.value > DEBOUNCE_TIME
  ) {
    selectedCategory.value = category
    lastScrollTime.value = now
    menuHeader.value?.scrollActiveBadgeIntoView()
  }
}

watch(
  () => selectedCategory.value,
  () => {
    if (!isScrolling.value) {
      menuHeader.value?.scrollActiveBadgeIntoView()
    }
  }
)

onMounted(() => {
  window.addEventListener('resize', updateHeaderHeight)
  updateHeaderHeight()

  fetchMenuData()
  if (categories.value.length > 0) {
    selectedCategory.value = categories.value[0].categoryName
  }
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
  .menu-container {
    margin-top: -30px;
  }
  .scroll-container {
    scroll-padding-top: var(--header-height-mobile);
  }
}
</style>
