<template>
  <div class="overflow-x-auto">
    <div v-if="isLoading">
      <TableSkeleton />
    </div>
    <div v-else-if="orders.length === 0" class="text-center py-12">
      <svg
        class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto"
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
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        {{ translateOrdersTable('empty.title') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ translateOrdersTable('empty.description') }}
      </p>
    </div>
    <table
      v-else
      class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            scope="col"
            class="px-6 py-3"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in orders"
          :key="order.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        >
          <td class="px-6 py-4">{{ order.id }}</td>
          <td class="px-6 py-4">
            <span
              :class="[
                'text-xs font-medium px-2.5 py-0.5 rounded',
                {
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300':
                    order.orderType === 'dine-in',
                  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300':
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
                ? translateTable('dineIn', { number: order.tableNumber ?? 0 })
                : translateTable('takeaway')
            }}
          </td>
          <td class="px-6 py-4">{{ order.items?.length || 0 }}</td>
          <td class="px-6 py-4">PLN{{ order.total.toFixed(2) }}</td>
          <td class="px-6 py-4">
            <StatusBadge :status="order.status" />
          </td>
          <td v-if="showActions" class="px-6 py-4">
            <div class="flex space-x-3">
              <template v-for="action in actions" :key="action.key">
                <button
                  v-if="!action.condition || action.condition(order)"
                  @click="action.handler(order)"
                  class="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  :aria-label="action.label"
                >
                  <svg
                    v-if="action.key === 'view'"
                    class="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-width="2"
                      d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                    />
                    <path
                      stroke="currentColor"
                      stroke-width="2"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <svg
                    v-else-if="action.key === 'complete'"
                    class="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
                      d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"
                    />
                  </svg>
                  <svg
                    v-else-if="action.key === 'cancel'"
                    class="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
                      d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                    />
                  </svg>
                </button>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTranslate } from '../composables/useTranslate'
import type { Order } from '../types/order'
import TableSkeleton from './ui/TableSkeleton.vue'
import StatusBadge from './ui/StatusBadge.vue'

const { translate: translateOrderType } = useTranslate(
  'orders.currentOrder.orderType'
)
const { translate: translateTable } = useTranslate('orders.activeOrders.table')
const { translate: translateStatus } = useTranslate('status')
const { translate: translateOrdersTable } = useTranslate('orders.table')

interface TableHeader {
  key: string
  label: string
}

interface TableAction {
  key: string
  label: string
  handler: (order: Order) => void
  class: string
  condition?: (order: Order) => boolean
}

const props = defineProps<{
  orders: Order[]
  showActions?: boolean
  headers?: TableHeader[]
  actions?: TableAction[]
  isLoading?: boolean
}>()

const defaultHeaders: TableHeader[] = [
  { key: 'id', label: 'Order ID' },
  { key: 'type', label: 'Type' },
  { key: 'table', label: 'Table' },
  { key: 'items', label: 'Items' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Status' }
]

const headers = computed(() => {
  if (props.headers) return props.headers
  return props.showActions
    ? [...defaultHeaders, { key: 'actions', label: 'Actions' }]
    : defaultHeaders
})
</script>
