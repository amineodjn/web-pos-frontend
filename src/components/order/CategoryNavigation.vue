<template>
  <div class="relative w-full mb-4">
    <button
      @click="scrollCategories('left')"
      class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700 shadow-md rounded-full w-8 h-8 flex items-center justify-center"
      :class="{ invisible: isScrolledLeft }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <div
      ref="categoriesContainer"
      class="flex gap-2 overflow-x-auto py-2 no-scrollbar px-10 scroll-smooth"
    >
      <button
        v-for="category in ['All', ...categories.map(c => c.categoryName)]"
        :key="category"
        @click="$emit('update:modelValue', category)"
        :class="[
          'px-4 py-2 rounded-md whitespace-nowrap flex-shrink-0',
          modelValue === category
            ? 'bg-dark-bg text-white border border-gray-600 dark:shadow-dark-hover'
            : 'dark:bg-gray-800 hover:bg-dark-bg hover:text-white border border-gray-700'
        ]"
      >
        {{ category }}
      </button>
    </div>
    <button
      @click="scrollCategories('right')"
      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700 shadow-md rounded-full w-8 h-8 flex items-center justify-center"
      :class="{ invisible: isScrolledRight }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import type { Category } from '../../types/MenuData'

defineProps<{
  categories: Category[]
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const categoriesContainer = ref<HTMLElement | null>(null)
const isScrolledLeft = ref(true)
const isScrolledRight = ref(false)

const checkScroll = () => {
  if (!categoriesContainer.value) return

  const { scrollLeft, scrollWidth, clientWidth } = categoriesContainer.value
  isScrolledLeft.value = scrollLeft <= 0
  isScrolledRight.value = scrollLeft + clientWidth >= scrollWidth - 1
}

const scrollCategories = (direction: 'left' | 'right') => {
  if (!categoriesContainer.value) return

  const scrollAmount = 200
  const currentScroll = categoriesContainer.value.scrollLeft
  const newScroll =
    direction === 'left'
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount

  categoriesContainer.value.scrollTo({
    left: newScroll,
    behavior: 'smooth'
  })
}

onMounted(() => {
  if (categoriesContainer.value) {
    categoriesContainer.value.addEventListener('scroll', checkScroll)
    nextTick(() => {
      checkScroll()
    })
  }
})

onUnmounted(() => {
  if (categoriesContainer.value) {
    categoriesContainer.value.removeEventListener('scroll', checkScroll)
  }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  height: 4px;
}

.no-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.no-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

.no-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
