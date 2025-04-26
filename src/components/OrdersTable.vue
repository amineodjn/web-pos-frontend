<template>
  <div class="overflow-x-auto">
    <div v-if="orders.length === 0" class="text-center py-12">
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
          <th scope="col" class="px-6 py-3">
            {{ translateOrdersTable('orderId') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ translateOrdersTable('type') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ translateOrdersTable('items') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ translateOrdersTable('total') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ translateOrdersTable('status') }}
          </th>
          <th v-if="showActions" scope="col" class="px-6 py-3">
            {{ translateOrdersTable('actions') }}
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
            {{ translateOrdersTable(`types.${order.orderType}`) }}
          </td>
          <td class="px-6 py-4">{{ order.items.length }}</td>
          <td class="px-6 py-4">PLN{{ order.total.toFixed(2) }}</td>
          <td class="px-6 py-4">
            <span
              :class="{
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300':
                  order.status === 'completed',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300':
                  order.status === 'in-progress',
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300':
                  order.status === 'cancelled'
              }"
              class="text-xs font-medium px-2.5 py-0.5 rounded"
            >
              {{ translateStatus(order.status) }}
            </span>
          </td>
          <td v-if="showActions" class="px-6 py-4">
            <div class="flex space-x-2">
              <button
                v-if="order.status === 'pending'"
                @click="$emit('update-status', order.id, 'in-progress')"
                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {{ translateOrdersTable('actions.start') }}
              </button>
              <button
                v-if="order.status === 'in-progress'"
                @click="$emit('update-status', order.id, 'completed')"
                class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
              >
                {{ translateOrdersTable('actions.complete') }}
              </button>
              <button
                v-if="
                  order.status !== 'completed' && order.status !== 'cancelled'
                "
                @click="$emit('update-status', order.id, 'cancelled')"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                {{ translateOrdersTable('actions.cancel') }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useTranslate } from '../composables/useTranslate'
import type { Order } from '../stores/orderStore'

const { translate: translateOrdersTable } = useTranslate('orders.table')
const { translate: translateStatus } = useTranslate('status')

defineProps<{
  orders: Order[]
  showActions?: boolean
}>()

defineEmits<{
  (e: 'update-status', orderId: string, status: Order['status']): void
}>()
</script>
