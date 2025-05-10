<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="relative bg-white dark:bg-dark-bg lg:min-h-screen lg:flex lg:items-center flex-col">
      <HomeHeader />
      <MenuContainer />
    </div>
  </div>
</template>
<script setup lang="ts">
  import HomeHeader from '../components/menu/HomeHeader.vue';
  import MenuContainer from '../components/menu/MenuContainer.vue';
</script>
<style scoped></style>
