<template>
  <div class="flex flex-col mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </h2>
      <span class="text-gray-500 dark:text-gray-400 text-sm">
        {{ items.length === 1 ? itemsCountSingular : itemsCountPlural }}
      </span>
    </div>

    <ListHeader
      :search-label="searchLabel"
      :search-placeholder="searchPlaceholder"
      :add-button-label="addButtonLabel"
      :is-processing="isProcessing"
      :initial-search-query="initialSearchQuery"
      @add-item="emit('add-item')"
      @search="handleSearch"
    >
      <template #filters>
        <slot name="filters"></slot>
      </template>
    </ListHeader>

    <slot v-if="items.length > 0" name="items-grid"></slot>

    <slot v-else name="empty-state"></slot>
  </div>
</template>

<script setup lang="ts">
import ListHeader from './ListHeader.vue'

defineProps<{
  title: string
  items: any[]
  itemsCountSingular: string
  itemsCountPlural: string
  searchLabel?: string
  searchPlaceholder: string
  addButtonLabel: string
  isProcessing: boolean
  initialSearchQuery?: string
}>()

const emit = defineEmits<{
  (e: 'add-item'): void
  (e: 'search', query: string): void
}>()

function handleSearch(query: string) {
  emit('search', query)
}
</script>
