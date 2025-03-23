<template>
  <div
    class="absolute inset-0 bg-white bg-opacity-70 dark:bg-dark-bg dark:bg-opacity-70 flex items-center justify-center z-50"
  >
    <div class="text-center">
      <SpinnerUI />
      <p class="text-gray-600 dark:text-gray-300 mt-4">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import SpinnerUI from '../common/SpinnerUI.vue'

defineProps<{
  message?: string
}>()
</script>
