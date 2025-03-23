<template>
  <div class="mb-4 flex items-center justify-between">
    <div class="flex-grow mr-4 max-w-xs">
      <SearchInputUI
        v-model="searchQuery"
        :label="searchLabel"
        :placeholder="searchPlaceholder"
        @search="emit('search', searchQuery)"
        @clear="emit('search', '')"
        class="w-full"
      />
    </div>
    <div class="flex items-center gap-4">
      <button
        @click="emit('add-item')"
        :disabled="isProcessing"
        class="bg-red-600 mt-0.5 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 12h14m-7 7V5"
          />
        </svg>
        {{ addButtonLabel }}
      </button>
      <div class="flex flex-col">
        <slot name="filters"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SearchInputUI from '../common/SearchInputUI.vue'

const props = defineProps<{
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

const searchQuery = ref(props.initialSearchQuery || '')

watch(searchQuery, newValue => {
  emit('search', newValue)
})
</script>
