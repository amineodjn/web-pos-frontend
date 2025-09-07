<template>
  <div
    @click="handleClick"
    class="menu-card w-full bg-white border border-gray-200 rounded-lg hover:shadow-[0_8px_16px_rgba(0,0,0,0.3)] dark:bg-dark-bg dark:border-gray-700 dark:hover:shadow-dark-hover flex flex-col h-full relative"
    :class="{
      'cursor-pointer': item.available,
      'cursor-not-allowed opacity-60': !item.available,
      'hover:shadow-none': !item.available
    }"
  >
    <div class="p-4 flex-grow">
      <h5
        class="name text-lg font-semibold tracking-tight text-gray-900 dark:text-white"
        :class="{ 'text-gray-400 dark:text-gray-500': !item.available }"
      >
        {{ name }}
      </h5>
    </div>
    <div v-if="!item.available" class="absolute top-2 right-2">
      <StatusBadge status="unavailable" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem, MenuItemDetails } from '../../types/MenuData'
import { useOrderStore } from '../../stores/orderStore'
import { useI18n } from 'vue-i18n'
import StatusBadge from '../ui/StatusBadge.vue'

const { t } = useI18n()
const orderStore = useOrderStore()

const props = defineProps<{
  name: string
  details: MenuItemDetails
  item: MenuItem
}>()

function handleClick() {
  if (props.item.available) {
    orderStore.addItemToOrder(props.item)
  }
}
</script>

<style scoped>
.menu-card {
  transition: all 0.3s ease;
}

.name {
  transition: color 0.3s ease;
}

.menu-card:hover .name {
  color: rgba(220, 38, 38, 1);
}

.menu-card:not(.cursor-not-allowed):hover .name {
  color: rgba(220, 38, 38, 1);
}

.hover\:bg-primary-dark:hover {
  background-color: #0d1642;
}

.focus\:ring-primary-light:focus {
  --tw-ring-color: rgba(26, 35, 126, 0.5);
}
</style>
