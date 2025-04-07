<template>
  <div
    class="menu-card w-full bg-white border border-gray-200 rounded-lg hover:shadow-[0_8px_16px_rgba(0,0,0,0.3)] dark:bg-dark-bg dark:border-gray-700 dark:hover:shadow-dark-hover"
  >
    <div class="image-container overflow-hidden rounded-t-lg">
      <imagePlaceholder v-if="!imageLoaded" />
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="name"
        loading="lazy"
        @load="imageLoaded = true"
        class="w-full h-full object-cover"
      />
    </div>
    <div class="p-4 flex flex-col h-[180px]">
      <h5
        class="name text-lg font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-1"
      >
        {{ name }}
      </h5>
      <p
        class="text-gray-700 dark:text-gray-300 mt-2 text-sm line-clamp-3 flex-grow"
      >
        {{ description }}
      </p>
      <div class="flex flex-wrap gap-1.5 mt-2">
        <span
          v-for="(tag, index) in details.tags.slice(0, 2)"
          :key="index"
          class="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-sm dark:bg-red-200 dark:text-red-800"
        >
          {{ tag }}
        </span>
      </div>
      <div class="flex items-center justify-between mt-3">
        <span class="text-lg font-bold text-gray-900 dark:text-white">
          {{ currency }}{{ price.toFixed(2) }}
        </span>
        <button
          @click="addToOrder"
          class="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg text-sm px-3 py-1.5 text-center"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MenuItem, MenuItemDetails } from '../../types/MenuData'
import imagePlaceholder from '../common/imagePlaceholder.vue'
import { useOrderStore } from '../../stores/orderStore'

const orderStore = useOrderStore()

const props = defineProps<{
  imageUrl: string
  name: string
  description: string
  details: MenuItemDetails
  price: number
  currency: string
  item: MenuItem
}>()

const imageLoaded = ref<boolean>(false)

function addToOrder() {
  orderStore.addItemToOrder(props.item)
}
</script>

<style scoped>
.menu-card {
  transition: box-shadow 0.3s ease;
}

.image-container {
  aspect-ratio: 16 / 10;
  background-color: #f3f4f6;
}

.image-container img {
  transition: transform 0.3s ease;
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.bg-primary {
  background-color: #1a237e;
}

.hover\:bg-primary-dark:hover {
  background-color: #0d1642;
}

.focus\:ring-primary-light:focus {
  --tw-ring-color: rgba(26, 35, 126, 0.5);
}
</style>
