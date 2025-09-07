<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div
      class="relative bg-white dark:bg-dark-bg lg:min-h-screen lg:flex lg:items-center flex-col"
    >
      <!-- Admin Access Section -->
      <div class="w-full p-4 bg-gray-100 dark:bg-gray-800 mb-4">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-gray-700 dark:text-gray-300 font-bold">
              POS system demo mode
            </span>
          </div>
          <div class="flex space-x-2">
            <button
              @click="goToAdmin"
              class="transition-all duration-300 ease-in-out hover:scale-105"
            >
              <svg class="w-6 h-6 text-gray-800 dark:text-white transition-all duration-300 ease-in-out hover:fill-current hover:stroke-none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <HomeHeader />
      <MenuContainer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import HomeHeader from '../components/menu/HomeHeader.vue'
import MenuContainer from '../components/menu/MenuContainer.vue'

const router = useRouter()

const goToAdmin = () => {
  router.push('/admin')
}
</script>

<style scoped></style>
