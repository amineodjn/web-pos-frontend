<template>
  <div class="w-full sticky rounded-b-lg top-0 z-10 bg-white dark:bg-dark-bg pt-4 pb-2">
    <CategoryItems
      :selected-category="selectedCategory"
      :category-badges="categoryBadges"
      @category-selected="handleCategorySelected"
    />
  </div>
</template>

<script setup lang="ts">
  import CategoryItems from './CategoryItems.vue';

  defineProps<{
    selectedCategory: string;
    categoryBadges: string[];
  }>();

  const emit = defineEmits<{
    (e: 'category-selected', category: string): void;
  }>();

  const handleCategorySelected = (category: string): void => {
    emit('category-selected', category);
  };

  const handleScrollActiveBadgeIntoView = (): void => {
    const activeBadge = document.querySelector('.badge.active');
    if (activeBadge) {
      activeBadge.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  defineExpose({
    handleScrollActiveBadgeIntoView,
  });
</script>
