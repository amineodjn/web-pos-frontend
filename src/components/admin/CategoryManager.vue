<template>
  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
      {{ config.title }}
    </h2>
    <div class="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded">
      <h3 class="font-medium mb-2 text-gray-900 dark:text-white">
        {{ config.addNewLabel }}
      </h3>
      <div class="flex">
        <input
          v-model="categoryName"
          class="border border-gray-300 dark:border-gray-600 p-2 rounded mr-2 flex-grow bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          :placeholder="config.placeholder"
        />
        <button
          @click="addCategory"
          :disabled="!categoryName || isProcessing"
          class="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          <span v-if="isProcessing">{{ config.savingLabel }}</span>
          <span v-else>{{ config.addLabel }}</span>
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="category in categories"
        :key="category"
        class="p-4 border border-gray-300 dark:border-gray-600 rounded flex justify-between items-center bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
      >
        <span>{{ category }}</span>
        <button
          @click="$emit('delete', category)"
          :disabled="isProcessing"
          class="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {{ config.deleteLabel }}
        </button>
      </div>
      <div
        v-if="categories.length === 0"
        class="p-4 text-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-bg"
      >
        {{ config.emptyMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  categories: string[]
  isProcessing: boolean
  config: {
    title: string
    addNewLabel: string
    placeholder: string
    savingLabel: string
    addLabel: string
    deleteLabel: string
    emptyMessage: string
  }
}>()

const emit = defineEmits<{
  (e: 'add', value: string): void
  (e: 'delete', value: string): void
}>()

const categoryName = ref('')

function addCategory() {
  if (categoryName.value.trim() && !props.isProcessing) {
    emit('add', categoryName.value.trim())
    categoryName.value = ''
  }
}
</script>
