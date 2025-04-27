<template>
  <div
    class="w-full sticky rounded-b-lg top-0 z-10 bg-white dark:bg-dark-bg pt-4 pb-2"
  >
    <CategoryItems
      :selectedCategory="selectedCategory"
      :categoryBadges="categoryBadges"
      @category-selected="onCategorySelected"
    />
  </div>
</template>

<script setup lang="ts">
import CategoryItems from './CategoryItems.vue'

defineProps<{
  selectedCategory: string
  categoryBadges: string[]
}>()

const emit = defineEmits<{
  (e: 'categorySelected', category: string): void
}>()

function onCategorySelected(category: string) {
  emit('categorySelected', category)
}

function scrollActiveBadgeIntoView() {
  setTimeout(() => {
    const activeBadge = document.querySelector('.active-badge')
    if (activeBadge) {
      activeBadge.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, 100)
}

defineExpose({
  scrollActiveBadgeIntoView
})
</script>
