<template>
  <div class="min-h-screen bg-gray-50 rounded-lg dark:bg-dark-bg p-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-2">
        <div class="flex space-x-4">
          <!-- Left side content can be added here if needed -->
        </div>
        <button
          @click="refreshOrders"
          class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="order in activeOrders"
          :key="order.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ order.id }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(order.createdAt) }}
              </p>
            </div>
            <span
              :class="[
                'text-xs font-medium px-2.5 py-0.5 rounded',
                {
                  'bg-yellow-100 text-yellow-800':
                    order.status === 'in-progress',
                  'bg-green-100 text-green-800': order.status === 'completed',
                  'bg-red-100 text-red-800': order.status === 'cancelled'
                }
              ]"
            >
              {{ translateStatus(`${order.status}`) }}
            </span>
          </div>

          <div class="space-y-2 mb-4">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex flex-col"
            >
              <div class="flex justify-between items-center">
                <span class="text-gray-900 dark:text-white">{{
                  item.name
                }}</span>
                <span class="text-gray-500 dark:text-gray-400"
                  >x{{ item.quantity }}</span
                >
              </div>
              <div
                v-if="item.comment"
                class="mt-1 text-sm text-gray-600 dark:text-gray-300"
              >
                <span class="font-medium">{{ translate('comments') }}:</span>
                {{ item.comment }}
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-2">
            <button
              v-if="order.status === 'in-progress'"
              @click="updateOrderStatus(order.id, 'completed')"
              class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              {{ translate('complete') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrderStore } from '../stores/orderStore'
import { useTranslate } from '../composables/useTranslate'
import type { Order } from '../types/order'

const { translate } = useTranslate('kitchen.display')
const { translate: translateStatus } = useTranslate('status')
const orderStore = useOrderStore()
const activeOrders = ref<Order[]>([])

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString()
}

const refreshOrders = () => {
  activeOrders.value = orderStore.activeOrders
}

const updateOrderStatus = (orderId: string, status: Order['status']) => {
  orderStore.updateOrderStatus(orderId, status)
  refreshOrders()
}

onMounted(() => {
  refreshOrders()
})
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
</style>
