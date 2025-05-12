<template>
  <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      {{ translateActiveOrders('title') }}
    </h2>
    <OrdersTable
      :orders="orderStore.activeOrders"
      :show-actions="true"
      :actions="orderActions"
      :is-loading="orderStore.isLoading"
    />
  </div>
  <OrderDetailsModal
    v-if="selectedOrder"
    :is-open="isModalOpen"
    :order="selectedOrder"
    @close="closeModal"
  />
  <ConfirmationModal
    :is-open="isDeleteModalOpen"
    :title="translateActiveOrders('actions.deleteTitle')"
    :message="translateActiveOrders('actions.deleteMessage')"
    :confirm-text="translateModal('confirm')"
    :cancel-text="translateModal('cancel')"
    @close="closeDeleteModal"
    @confirm="handleDeleteConfirm"
  />
</template>
<script setup lang="ts">
import { useOrderStore } from '../../stores/orderStore'
import type { Order } from '../../types/order'
import { useTranslate } from '../../composables/useTranslate'
import OrderDetailsModal from './OrderDetailsModal.vue'
import OrdersTable from '../OrdersTable.vue'
import ConfirmationModal from '../ui/ConfirmationModal.vue'
import { ref, onMounted } from 'vue'

const { translate: translateActiveOrders } = useTranslate('orders.activeOrders')
const { translate: translateModal } = useTranslate('confirmationModal.buttons')

const orderStore = useOrderStore()

const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedOrder = ref<Order | null>(null)
const orderToDelete = ref<Order | null>(null)

async function refreshOrders() {
  try {
    await orderStore.fetchOrders()
  } catch (error) {
    console.error('Failed to refresh orders:', error)
  }
}

function viewOrder(order: Order) {
  selectedOrder.value = order
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedOrder.value = null
}

function openDeleteModal(order: Order) {
  orderToDelete.value = order
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  orderToDelete.value = null
}

async function handleDeleteConfirm() {
  if (orderToDelete.value) {
    try {
      await orderStore.deleteOrder(orderToDelete.value.id)
      closeDeleteModal()
    } catch (error) {
      console.error('Failed to delete order:', error)
    }
  }
}

const orderActions = [
  {
    key: 'view',
    label: translateActiveOrders('actions.view'),
    handler: (order: Order) => viewOrder(order),
    class: 'text-blue-600 hover:text-blue-900 mr-2',
    condition: undefined
  },
  {
    key: 'complete',
    label: translateActiveOrders('actions.complete'),
    handler: (order: Order) =>
      orderStore.updateOrderStatus(order.id, 'completed'),
    class: 'text-green-600 hover:text-green-900 mr-2',
    condition: (order: Order) => order.status === 'pending'
  },
  {
    key: 'cancel',
    label: translateActiveOrders('actions.cancel'),
    handler: (order: Order) => openDeleteModal(order),
    class: 'text-red-600 hover:text-red-900',
    condition: (order: Order) => order.status === 'pending'
  }
]

onMounted(async () => {
  await refreshOrders()
})
</script>
