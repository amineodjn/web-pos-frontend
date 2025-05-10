<template>
  <div
    class="menu-card w-full bg-white border border-gray-200 rounded-lg hover:shadow-[0_8px_16px_rgba(0,0,0,0.3)] dark:bg-dark-bg dark:border-gray-700 dark:hover:shadow-dark-hover flex flex-col h-full cursor-pointer"
    @click="handleAddToOrder"
  >
    <div class="p-4 flex-grow">
      <h5 class="name text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
        {{ name }}
      </h5>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { MenuItem, MenuItemDetails } from '../../types/MenuData';
  import { useOrderStore } from '../../stores/orderStore';

  const orderStore = useOrderStore();

  const props = defineProps<{
    name: string;
    details: MenuItemDetails;
    item: MenuItem;
  }>();

  const handleAddToOrder = (): void => {
    orderStore.addItemToOrder(props.item);
  };
</script>

<style scoped>
  .menu-card {
    transition: box-shadow 0.3s ease;
  }

  .name {
    transition: color 0.3s ease;
  }

  .menu-card:hover .name {
    color: rgba(220, 38, 38, 1);
  }

  .hover\:bg-primary-dark:hover {
    background-color: #0d1642;
  }

  .focus\:ring-primary-light:focus {
    --tw-ring-color: rgba(26, 35, 126, 0.5);
  }
</style>
