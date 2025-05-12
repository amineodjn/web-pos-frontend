<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ order.id }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ formatTime(order.createdAt) }}
        </p>
      </div>
      <StatusBadge :status="order.status" />
    </div>

    <div class="space-y-2 mb-4">
      <div v-for="item in order.items" :key="item.id" class="flex flex-col">
        <div class="flex justify-between items-center">
          <span class="text-gray-900 dark:text-white">{{ item.name }}</span>
          <span class="text-gray-500 dark:text-gray-400"
            >x{{ item.quantity }}</span
          >
        </div>
        <div
          v-if="item.comment"
          class="mt-1 text-sm text-gray-600 dark:text-gray-300"
        >
          <span class="font-medium">{{ translateKitchView('comments') }}:</span>
          {{ item.comment }}
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-2">
      <button
        v-if="order.status === 'pending'"
        class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        @click="handleStatusUpdate('preparing')"
      >
        {{ translateStatus('preparing') }}
      </button>
      <button
        v-if="order.status === 'preparing'"
        class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        @click="handleStatusUpdate('ready')"
      >
        {{ translateStatus('ready') }}
      </button>
      <button
        v-if="order.status === 'ready'"
        class="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        @click="handleStatusUpdate('completed')"
      >
        {{ translateStatus('completed') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTranslate } from '../../composables/useTranslate'
import type { Order } from '../../types/order'
import StatusBadge from '../ui/StatusBadge.vue'

const props = defineProps<{
  order: Order
}>()

const emit = defineEmits<{
  (e: 'update-status', orderId: string, status: Order['status']): void
}>()

const { translate: translateKitchView } = useTranslate('kitchen.display')
const { translate: translateStatus } = useTranslate('status')

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString()
}

const handleStatusUpdate = (newStatus: Order['status']) => {
  emit('update-status', props.order.id, newStatus)
}
</script>
