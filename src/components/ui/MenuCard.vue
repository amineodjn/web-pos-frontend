<template>
  <div
    class="menu-card cursor-pointer w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="image-container overflow-hidden rounded-t-lg">
      <img class="p-4" :src="imageUrl" :alt="name" />
    </div>
    <div class="px-4 pb-4">
      <h5
        class="name text-lg font-semibold tracking-tight text-gray-900 dark:text-white"
      >
        {{ name }}
      </h5>
      <p class="text-gray-700 dark:text-gray-300 mt-2">{{ description }}</p>
      <div class="flex flex-wrap gap-2 mt-3">
        <span
          v-for="(tag, index) in details.tags"
          :key="index"
          class="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-red-200 dark:text-red-800"
        >
          {{ tag }}
        </span>
      </div>
      <div class="flex items-center justify-between mt-5">
        <span class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ currency }}{{ price }}
        </span>
        <!-- <button
          @click="addToCart"
          class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          {{ buttonText }}
        </button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { MenuItemDetails } from '../../types/MenuData'

defineProps({
  imageUrl: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  details: {
    type: Object as () => MenuItemDetails,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'PLN'
  },
  buttonText: {
    type: String,
    default: 'Add to cart'
  }
})
</script>

<style scoped>
.menu-card {
  transition: box-shadow 0.3s ease;
}

.menu-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.image-container img {
  transition: transform 0.3s ease;
}

.menu-card:hover .image-container img {
  transform: scale(1.05);
}

.name {
  transition: color 0.3s ease;
}

.menu-card:hover .name {
  color: rgba(220, 38, 38, 1);
}
</style>
