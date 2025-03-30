<template>
  <div
    class="inline-flex rounded-md shadow-sm"
    role="tablist"
    aria-label="View options"
  >
    <button
      v-for="(tab, index) in tabs"
      :key="tab.value"
      type="button"
      role="tab"
      :aria-selected="activeTab === tab.value"
      @click="$emit('update:activeTab', tab.value)"
      class="px-4 py-2 text-sm font-medium transition-colors"
      :class="[
        'focus:ring-2 focus:z-10 focus:outline-none',
        index === 0 ? 'rounded-l-lg' : '',
        index === tabs.length - 1 ? 'rounded-r-lg' : '',
        activeTab === tab.value
          ? 'bg-gray-900 text-white border-2 border-gray-900 dark:bg-gray-800 dark:border-white dark:text-white'
          : 'bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 border-0'
      ]"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: { label: string; value: string }[]
  activeTab: string
}>()

defineEmits<{
  (e: 'update:activeTab', value: string): void
}>()
</script>
