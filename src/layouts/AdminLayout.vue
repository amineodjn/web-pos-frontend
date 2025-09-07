<template>
  <div class="flex h-screen dark:bg-dark-bg">
    <Sidebar v-model="isSidebarCollapsed" />
    <div
      class="flex-1 transition-all duration-300"
      :class="[isSidebarCollapsed ? 'ml-16' : 'ml-64']"
    >
      <div
        class="admin-view relative bg-white dark:bg-dark-bg p-5 rounded min-h-screen"
      >
        <!-- Admin Content -->
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/admin/Sidebar.vue'

const isSidebarCollapsed = ref(false)
</script>

<style scoped>
.admin-view {
  min-height: calc(100vh - 2.5rem);
}
</style>
