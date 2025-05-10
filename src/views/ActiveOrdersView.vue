<template>
  <div class="p-5">
    <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {{ $t('activeOrders.title') }}
      </h1>
      <OrdersTable
        :orders="activeOrders"
        :show-actions="true"
        @update-status="handleStatusUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useOrderStore } from '../stores/orderStore';
  import OrdersTable from '../components/OrdersTable.vue';

  const orderStore = useOrderStore();

  const activeOrders = computed(() => {
    return orderStore.activeOrders;
  });

  const handleStatusUpdate = (
    orderId: string,
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  ): void => {
    orderStore.handleUpdateOrderStatus(orderId, status);
  };
</script>
