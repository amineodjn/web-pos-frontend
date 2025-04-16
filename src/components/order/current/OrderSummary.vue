<template>
  <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
    <div class="flex justify-between mb-2 text-gray-900 dark:text-white">
      <span>{{ translateCurrentOrder('subtotal') }}</span>
      <span>PLN{{ subtotal.toFixed(2) }}</span>
    </div>
    <div class="flex justify-between mb-2 text-gray-900 dark:text-white">
      <span>{{ translateCurrentOrder('tax') }} ({{ taxRate }}%)</span>
      <span>PLN{{ tax.toFixed(2) }}</span>
    </div>
    <div
      class="flex justify-between font-bold mb-4 text-gray-900 dark:text-white"
    >
      <span>{{ translateCurrentOrder('total') }}</span>
      <span>PLN{{ total.toFixed(2) }}</span>
    </div>
    <button
      @click="$emit('place-order')"
      :disabled="!canPlaceOrder"
      :class="[
        'w-full py-2 rounded-md mb-2',
        canPlaceOrder
          ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700'
          : 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
      ]"
    >
      {{ translateCurrentOrder('placeOrder') }}
    </button>
    <button
      @click="$emit('clear-order')"
      class="w-full border border-gray-300 dark:border-gray-600 py-2 rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {{ translateCurrentOrder('clearOrder') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTranslate } from '../../../composables/useTranslate'

const { translate: translateCurrentOrder } = useTranslate('orders.currentOrder')

defineProps<{
  subtotal: number
  tax: number
  total: number
  taxRate: number
  canPlaceOrder: boolean
}>()

defineEmits<{
  (e: 'place-order'): void
  (e: 'clear-order'): void
}>()
</script>
