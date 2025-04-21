<template>
  <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      {{ translateActiveOrders('title') }}
    </h2>
    <div class="overflow-x-auto">
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
                  ? `Table ${order.tableNumber}`
                  : translateOrderType('takeaway')
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
</template>

<script setup lang="ts">
import { useOrderStore } from '../../stores/orderStore'
import { useTranslate } from '../../composables/useTranslate'

const { translate: translateOrderType } = useTranslate(
  'orders.currentOrder.orderType'
)
const { translate: translateActiveOrders } = useTranslate('orders.activeOrders')
const { translate: translateStatus } = useTranslate('status')

const orderStore = useOrderStore()

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
    handler: (order: any) => viewOrder(order),
    class: 'text-blue-600 hover:text-blue-900 mr-2',
    condition: null
  },
  {
    key: 'complete',
    label: 'Complete',
    handler: (order: any) =>
      orderStore.updateOrderStatus(order.id, 'completed'),
    class: 'text-green-600 hover:text-green-900 mr-2',
    condition: (order: any) => order.status === 'in-progress'
  },
  {
    key: 'cancel',
    label: 'Cancel',
    handler: (order: any) =>
      orderStore.updateOrderStatus(order.id, 'cancelled'),
    class: 'text-red-600 hover:text-red-900',
    condition: (order: any) => order.status === 'in-progress'
  }
]

function viewOrder(order: any) {
  // Implement order details view
  console.log('View order:', order)
}
</script>
