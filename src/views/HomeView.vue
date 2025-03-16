<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div
      class="relative bg-white dark:bg-dark-bg lg:min-h-screen lg:flex lg:items-center flex-col"
    >
      <MenuHeader />
      <MenuContainer />
    </div>
  </div>
</template>
<script setup lang="ts">
import MenuHeader from '../components/MenuHeader.vue'
import MenuContainer from '../components/MenuContainer.vue'
</script>
<style scoped></style>
