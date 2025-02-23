<template>
  <main>
    <div class="menu bg-white dark:bg-gray-900">
      <h1 class="text-black dark:text-white">{{ $t('home.mainPage') }}</h1>
    </div>
  </main>
</template>
<script setup lang="ts"></script>
<style>
@media (min-width: 1024px) {
  .menu {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
