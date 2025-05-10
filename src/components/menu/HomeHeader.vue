<template>
  <div class="menu-header relative w-full">
    <img src="../../../images/bg.cd744ba5.jpg" alt="Background" class="menu-header-image" />
    <div class="absolute inset-0 flex items-center justify-center">
      <h1 class="text-white text-4xl font-bold text-center">
        {{ $t('menuHeader.title') }}
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  .menu-header {
    margin-top: -20px;
  }

  .menu-header-image {
    inline-size: 100%;
    height: auto;
    min-width: 300px;
    min-height: 200px;
    object-fit: cover;
  }
</style>
