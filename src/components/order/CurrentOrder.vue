<template>
  <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
    <OrderTypeSelector
      :number-of-tables="numberOfTables"
      :guests-per-table="guestsPerTable"
      @update:order-type="orderStore.currentOrder.orderType = $event"
      @table-change="handleTableChange"
    />

    <OrderItemsList
      :items="orderStore.currentOrder.items"
      @edit-comment="id => handleEditComment(id)"
      @remove="id => orderStore.removeItemFromOrder(id)"
    />

    <CommentModal
      v-model="showCommentModal"
      :item-id="selectedItemId"
      @save="handleCommentSave"
    />

    <OrderSummary
      :subtotal="orderStore.subtotal"
      :tax="orderStore.tax"
      :total="orderStore.total"
      :tax-rate="taxRate"
      :can-place-order="!!canPlaceOrder"
      :is-processing="isProcessing"
      @place-order="handlePlaceOrder"
      @clear-order="orderStore.clearOrder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrderStore } from '../../stores/orderStore'
import type { Order } from '../../types/order'
import OrderTypeSelector from './current/OrderTypeSelector.vue'
import OrderItemsList from './current/OrderItemsList.vue'
import OrderSummary from './current/OrderSummary.vue'
import CommentModal from './current/CommentModal.vue'

defineProps<{
  numberOfTables: number
  guestsPerTable: number[]
  taxRate: number
  isProcessing: boolean
}>()

const orderStore = useOrderStore()
const showCommentModal = ref(false)
const selectedItemId = ref<string>('')

const canPlaceOrder = computed(() => {
  if (orderStore.currentOrder.orderType === 'dine-in') {
    return (
      orderStore.currentOrder.tableNumber &&
      (orderStore.currentOrder.items?.length || 0) > 0
    )
  }
  return (orderStore.currentOrder.items?.length || 0) > 0
})

const handleEditComment = (itemId: string) => {
  selectedItemId.value = itemId
  showCommentModal.value = true
}

const handleCommentSave = (comment: string) => {
  if (selectedItemId.value) {
    orderStore.updateItemComment(selectedItemId.value, comment)
  }
}

const sendToPrinter = async () => {
  const items =
    orderStore.currentOrder.items?.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price
    })) || []

  const body = {
    orders: items,
    subtotal: parseFloat(orderStore.subtotal.toFixed(2)),
    tax: parseFloat(orderStore.tax.toFixed(2)),
    total: parseFloat(orderStore.total.toFixed(2)),
    timestamp: new Date().toISOString()
  }

  const response = await fetch('http://localhost:9100', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()
  console.log('Order sent to printer service:', result)
  return result
}

async function handlePlaceOrder() {
  try {
    await orderStore.placeOrder()
    try {
      await sendToPrinter()
    } catch (printerError) {
      console.error('Failed to send to printer:', printerError)
    }
  } catch (error) {
    console.error('Failed to place order:', error)
    throw error
  }
}

const handleTableChange = (tableNumber: number | null) => {
  if (tableNumber) {
    orderStore.setTable(tableNumber)
  } else {
    orderStore.clearOrder()
  }
}

defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'update:order', order: Order): void
  (e: 'cancel'): void
}>()
</script>

<style scoped>
.bg-primary {
  @apply bg-gray-900 dark:bg-gray-800;
}

input[type='radio'] {
  @apply text-gray-900 dark:text-gray-900;
}

input[type='radio']:checked {
  @apply text-gray-900 dark:text-gray-900;
}

/* Custom scrollbar styles */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  border-radius: 4px;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
}

.dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}
</style>
