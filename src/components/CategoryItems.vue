<template>
  <div class="badge-scroller overflow-x-auto whitespace-nowrap gap-2 p-2">
    <BadgeUI
      v-for="(badge, index) in CATEGORY_BADGES"
      :key="index"
      :class="{ 'active-badge': badge === selectedCategory }"
      @click="handleBadgeClick(badge)"
    >
      <template #default>{{ badge }}</template>
    </BadgeUI>
  </div>
</template>

<script setup lang="ts">
import BadgeUI from '../components/ui/BadgeUI.vue'

defineProps({
  selectedCategory: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['category-selected'])

const CATEGORY_BADGES = [
  'Desserts',
  'Drinks',
  'Kids Menu',
  'Main',
  'Salads',
  'Sides',
  'Soups',
  'Starters',
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

.badge-scroller :deep(.badge) {
  transition: all 0.3s ease;
  transform: translateY(0) scale(1);
}

.active-badge {
  background-color: rgba(220, 38, 38, 0.1) !important;
  border-color: rgba(220, 38, 38, 1) !important;
  color: rgba(220, 38, 38, 1) !important;
  font-weight: bold !important;
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 8px 24px rgba(255, 192, 203, 0.2);
}

.active-badge::before {
  transform: translateX(0);
}
</style>
