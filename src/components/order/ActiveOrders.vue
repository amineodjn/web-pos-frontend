<template>
  <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      {{ translateActiveOrders('title') }}
    </h2>
    <div v-if="orderStore.activeOrders.length === 0" class="text-center py-12">
      <svg
        class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
        />
      </svg>
      <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
        {{ translateActiveOrders('empty.title') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ translateActiveOrders('empty.description') }}
      </p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th
              v-for="header in tableHeaders"
              :key="header.key"
              scope="col"
              class="px-6 py-3"
            >
              {{ translateActiveOrders(`headers.${header.key}`) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orderStore.activeOrders"
            :key="order.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          >
            <td class="px-6 py-4">{{ order.id }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'text-xs font-medium px-2.5 py-0.5 rounded',
                  {
                    'bg-blue-100 text-blue-800': order.orderType === 'dine-in',
                    'bg-purple-100 text-purple-800':
                      order.orderType === 'takeaway'
                  }
                ]"
              >
                {{ translateOrderType(order.orderType) }}
              </span>
            </td>
            <td class="px-6 py-4">
              {{
                order.orderType === 'dine-in'
                  ? translateActiveOrders('table.dineIn', {
                      number: order.tableNumber ?? 0
                    })
                  : translateActiveOrders('table.takeaway')
              }}
            </td>
            <td class="px-6 py-4">{{ order.items?.length || 0 }}</td>
            <td class="px-6 py-4">PLN{{ order.total.toFixed(2) }}</td>
            <td class="px-6 py-4">
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
            </td>
            <td class="px-6 py-4">
              <template v-for="action in orderActions" :key="action.label">
                <button
                  v-if="!action.condition || action.condition(order)"
                  @click="action.handler(order)"
                  :class="action.class"
                >
                  {{ translateActiveOrders(`actions.${action.key}`) }}
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <OrderDetailsModal
    v-if="selectedOrder"
    :is-open="isModalOpen"
    :order="selectedOrder"
    @close="closeModal"
  />
</template>

<script setup lang="ts">
import { useOrderStore, type Order } from '../../stores/orderStore'
import { useTranslate } from '../../composables/useTranslate'
import OrderDetailsModal from './OrderDetailsModal.vue'
import { ref } from 'vue'

const { translate: translateOrderType } = useTranslate(
  'orders.currentOrder.orderType'
)
const { translate: translateActiveOrders } = useTranslate('orders.activeOrders')
const { translate: translateStatus } = useTranslate('status')

const orderStore = useOrderStore()

const isModalOpen = ref(false)
const selectedOrder = ref<Order | null>(null)

function viewOrder(order: Order) {
  selectedOrder.value = order
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedOrder.value = null
}

const tableHeaders = [
  { key: 'id', label: 'Order ID' },
  { key: 'type', label: 'Type' },
  { key: 'table', label: 'Table' },
  { key: 'items', label: 'Items' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const orderActions = [
  {
    key: 'view',
    label: 'View',
    handler: (order: Order) => viewOrder(order),
    class: 'text-blue-600 hover:text-blue-900 mr-2',
    condition: null
  },
  {
    key: 'complete',
    label: 'Complete',
    handler: (order: Order) =>
      orderStore.updateOrderStatus(order.id, 'completed'),
    class: 'text-green-600 hover:text-green-900 mr-2',
    condition: (order: Order) => order.status === 'in-progress'
  },
  {
    key: 'cancel',
    label: 'Cancel',
    handler: (order: Order) =>
      orderStore.updateOrderStatus(order.id, 'cancelled'),
    class: 'text-red-600 hover:text-red-900',
    condition: (order: Order) => order.status === 'in-progress'
  }
]
</script>
