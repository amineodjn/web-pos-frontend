<template>
  <div class="flex justify-center overflow-x-auto whitespace-nowrap gap-2 p-2">
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
import BadgeUI from '../components/ui/BadgeUI.vue'

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
