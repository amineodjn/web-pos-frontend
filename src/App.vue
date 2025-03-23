<template>
  <header>
    <NavBar></NavBar>
  </header>
  <main><RouterView /></main>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/navbar/NavBar.vue'
</script>
