<template>
  <header>
    <div class="wrapper">
      <NavBar></NavBar>
    </div>
  </header>

  <RouterView />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>
