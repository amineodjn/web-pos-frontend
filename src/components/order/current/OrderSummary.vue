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

    <div class="mb-4">
      <label
        for="order-notes"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {{ translateCurrentOrder('notes') }}
      </label>
      <textarea
        id="order-notes"
        v-model="notes"
        rows="2"
        class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
        :placeholder="translateCurrentOrder('notesPlaceholder')"
        @input="handleNotesInput"
      ></textarea>
    </div>

    <button
      @click="$emit('place-order')"
      :disabled="!canPlaceOrder || isProcessing"
      :class="[
        'w-full py-2 rounded-md mb-2 flex items-center justify-center',
        canPlaceOrder && !isProcessing
          ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700'
          : 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
      ]"
    >
      <span v-if="isProcessing" class="flex items-center">
        {{ translateCurrentOrder('placeOrder') }}
        <span class="ml-2 animate-pulse">...</span>
      </span>
      <span v-else>
        {{ translateCurrentOrder('placeOrder') }}
      </span>
    </button>
    <button
      @click="$emit('clear-order')"
      :disabled="isProcessing"
      class="w-full border border-gray-300 dark:border-gray-600 py-2 rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ translateCurrentOrder('clearOrder') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOrderStore } from '../../../stores/orderStore'
import { useTranslate } from '../../../composables/useTranslate'

const { translate: translateCurrentOrder } = useTranslate('orders.currentOrder')
const orderStore = useOrderStore()

defineProps<{
  subtotal: number
  tax: number
  total: number
  taxRate: number
  canPlaceOrder: boolean
  isProcessing: boolean
}>()

defineEmits<{
  (e: 'place-order'): void
  (e: 'clear-order'): void
}>()

const notes = computed({
  get: () => orderStore.currentOrder.notes || '',
  set: (val: string) => orderStore.updateOrderNotes(val)
})

const handleNotesInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  notes.value = target.value
}
</script>
