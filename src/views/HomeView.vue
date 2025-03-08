<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div
      class="relative bg-white dark:bg-gray-900 lg:min-h-screen lg:flex lg:items-center flex-col"
    >
      <MenuHeader />
      <CategoryItems />
    </div>
  </div>
</template>
<script setup lang="ts">
import MenuHeader from '../components/MenuHeader.vue'
import CategoryItems from '../components/CategoryItems.vue'
</script>
<style scoped></style>
