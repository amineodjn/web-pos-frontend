<template>
  <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
    <div class="mb-4">
      <div class="flex gap-4 mb-2">
        <label class="flex items-center text-gray-900 dark:text-white">
          <input
            type="radio"
            v-model="orderType"
            value="dine-in"
            class="mr-2 text-gray-900 dark:text-gray-900 focus:ring-gray-900 dark:focus:ring-gray-900"
          />
          {{ translateOrderType('dineIn') }}
        </label>
        <label class="flex items-center text-gray-900 dark:text-white">
          <input
            type="radio"
            v-model="orderType"
            value="takeaway"
            class="mr-2 text-gray-900 dark:text-gray-900 focus:ring-gray-900 dark:focus:ring-gray-900"
          />
          {{ translateOrderType('takeaway') }}
        </label>
      </div>
      <div v-if="orderType === 'dine-in'" class="mb-4">
        <SelectBoxUI
          v-model="selectedTable"
          :options="tableOptions"
          :placeholder="translateCurrentOrder('selectTable')"
          @change="handleTableChange"
        />
      </div>
    </div>
    <div
      class="md:max-h-[100px] md:min-h-[100px] xl:max-h-[330px] xl:min-h-[330px] mb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
    >
      <div
        v-if="!orderStore.currentOrder.items?.length"
        class="text-center text-gray-500 dark:text-gray-400 mt-8"
      >
        {{ translateCurrentOrder('noItems') }}
        <p class="text-sm">{{ translateCurrentOrder('selectItems') }}</p>
      </div>
      <div v-else class="space-y-2 pr-2">
        <div
          v-for="item in reversedOrderItems"
          :key="item.id"
          class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
        >
          <div>
            <span class="font-medium text-gray-900 dark:text-white">{{
              item.name
            }}</span>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              PLN{{ item.price.toFixed(2) }} × {{ item.quantity }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-900 dark:text-white"
              >PLN{{ (item.price * item.quantity).toFixed(2) }}</span
            >
            <button
              @click="orderStore.removeItemFromOrder(item.id)"
              class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Order Summary -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
      <div class="flex justify-between mb-2 text-gray-900 dark:text-white">
        <span>{{ translateCurrentOrder('subtotal') }}</span>
        <span>PLN{{ orderStore.subtotal.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between mb-2 text-gray-900 dark:text-white">
        <span>{{ translateCurrentOrder('tax') }} ({{ taxRate }}%)</span>
        <span>PLN{{ orderStore.tax.toFixed(2) }}</span>
      </div>
      <div
        class="flex justify-between font-bold mb-4 text-gray-900 dark:text-white"
      >
        <span>{{ translateCurrentOrder('total') }}</span>
        <span>PLN{{ orderStore.total.toFixed(2) }}</span>
      </div>
      <button
        @click="placeOrder"
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
        @click="orderStore.clearOrder"
        class="w-full border border-gray-300 dark:border-gray-600 py-2 rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {{ translateCurrentOrder('clearOrder') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrderStore } from '../../stores/orderStore'
import SelectBoxUI from '../common/SelectBoxUI.vue'
import { useTranslate } from '../../composables/useTranslate'

const { translate: translateOrderType } = useTranslate(
  'orders.currentOrder.orderType'
)
const { translate: translateCurrentOrder } = useTranslate('orders.currentOrder')

const props = defineProps<{
  numberOfTables: number
  guestsPerTable: number[]
  taxRate: number
}>()

const orderStore = useOrderStore()
const selectedTable = ref('')
const orderType = ref<'dine-in' | 'takeaway'>('takeaway')

const tableOptions = computed(() => {
  return Array.from({ length: props.numberOfTables }, (_, i) => ({
    label: `Table #${i + 1} (${props.guestsPerTable[i]} seats)`,
    value: i + 1
  }))
})

const canPlaceOrder = computed(() => {
  if (orderType.value === 'dine-in') {
    return (
      selectedTable.value && (orderStore.currentOrder.items?.length || 0) > 0
    )
  }
  return (orderStore.currentOrder.items?.length || 0) > 0
})

const reversedOrderItems = computed(() => {
  return [...(orderStore.currentOrder.items || [])].reverse()
})

async function placeOrder() {
  try {
    orderStore.currentOrder.orderType = orderType.value
    await orderStore.placeOrder()
    selectedTable.value = ''
  } catch (error) {
    console.error('Failed to place order:', error)
  }
}

const handleTableChange = () => {
  if (selectedTable.value) {
    orderStore.setTable(Number(selectedTable.value))
  } else {
    orderStore.clearOrder()
  }
}
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
