<template>
  <div class="flex mb-6">
    <div class="mr-4" v-for="tab in tabs" :key="tab.value">
      <button
        class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
        @click="$emit('update:activeTab', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="ml-auto">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: { label: string; value: string }[]
}>()

defineEmits<{
  (e: 'update:activeTab', value: string): void
}>()
</script>
