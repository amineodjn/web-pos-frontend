<template>
  <div class="badge-scroller overflow-x-auto whitespace-nowrap gap-2 p-2">
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
  'Kids'
]

function handleBadgeClick(badge: string) {
  emit('category-selected', badge)
}
</script>

<style scoped>
.badge-scroller {
  display: grid;
  grid-auto-flow: column;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}

@media (max-width: 639px) {
  .badge-scroller {
    grid-auto-columns: 30%;
  }
}
</style>
