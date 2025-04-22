<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">
            {{ translateOrdersTable('table.orderId') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ translateOrdersTable('table.type') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ translateOrdersTable('table.items') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ translateOrdersTable('table.total') }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ translateOrdersTable('table.status') }}
          </th>
          <th v-if="showActions" scope="col" class="px-6 py-3">
            {{ translateOrdersTable('table.actions') }}
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

const { translate: translateOrdersTable } = useTranslate('orders')
const { translate: translateStatus } = useTranslate('status')

defineProps<{
  orders: Order[]
  showActions?: boolean
}>()

defineEmits<{
  (e: 'update-status', orderId: string, status: Order['status']): void
}>()
</script>
