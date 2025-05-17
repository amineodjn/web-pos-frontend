<template>
  <div role="status" class="w-full animate-pulse">
    <div class="w-full">
      <div class="h-10 bg-gray-200 rounded-lg dark:bg-gray-700 mb-4"></div>
      <div class="space-y-4">
        <div class="grid grid-cols-7 gap-4">
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div class="grid grid-cols-7 gap-4">
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div class="grid grid-cols-7 gap-4">
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
    <span class="sr-only">Loading table data...</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TableSkeleton'
}
</script>
