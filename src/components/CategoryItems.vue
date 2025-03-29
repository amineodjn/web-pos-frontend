<template>
  <div class="flex justify-center scroll whitespace-nowrap gap-2 p-2">
    <BadgeUI
      v-for="(badge, index) in CATEGORY_BADGES"
      :key="index"
      @click="handleBadgeClick(badge)"
    >
      <template #default>{{ badge }}</template>
    </BadgeUI>
  </div>
</template>
<script setup lang="ts">
import BadgeUI from '../components/common/BadgeUI.vue'

const emit = defineEmits(['category-selected'])

const CATEGORY_BADGES = [
  'Main',
  'Sides',
  'Drinks',
  'Starters',
  'Desserts',
  'Soups',
  'Salads',
  'Kids Menu'
]

function handleBadgeClick(badge: string) {
  emit('category-selected', badge)
}
</script>
<style scoped>
.scroll {
  overflow-x: scroll;
}
</style>
