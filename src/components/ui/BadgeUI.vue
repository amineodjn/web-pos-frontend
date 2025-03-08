<template>
  <span
    :class="[
      'text-xs font-medium me-2 px-2.5 py-0.5 rounded-lg border',
      `bg-${color}-100 text-${color}-800 dark:bg-gray-700 dark:text-${color}-400 border-${color}-400`
    ]"
  >
    <slot />
  </span>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps({
  color: {
    type: String,
    default: 'yellow'
  }
})
</script>
