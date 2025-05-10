<template>
  <div class="about bg-white dark:bg-gray-900">
    <h1 class="text-black dark:text-white">{{ $t('about.title') }}</h1>
  </div>
</template>

<style>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
</style>
