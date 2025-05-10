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

    <CommentModal v-model="showCommentModal" :item-id="selectedItemId" />

    <OrderSummary
      :subtotal="orderStore.subtotal"
      :tax="orderStore.tax"
      :total="orderStore.total"
      :tax-rate="taxRate"
      :can-place-order="!!canPlaceOrder"
      @place-order="placeOrder"
      @clear-order="orderStore.clearOrder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrderStore, type Order } from '../../stores/orderStore'
import OrderTypeSelector from './current/OrderTypeSelector.vue'
import OrderItemsList from './current/OrderItemsList.vue'
import OrderSummary from './current/OrderSummary.vue'
import CommentModal from './current/CommentModal.vue'

defineProps<{
  numberOfTables: number
  guestsPerTable: number[]
  taxRate: number
  order: Order
  isProcessing: boolean
  formError: string
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

async function placeOrder() {
  try {
    await orderStore.placeOrder()
  } catch (error) {
    console.error('Failed to place order:', error)
  }
}

const handleTableChange = (tableNumber: number | null) => {
  if (tableNumber) {
    orderStore.setTable(tableNumber)
  } else {
    orderStore.clearOrder()
  }
}

const handleEditComment = (itemId: string) => {
  selectedItemId.value = itemId
  showCommentModal.value = true
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
