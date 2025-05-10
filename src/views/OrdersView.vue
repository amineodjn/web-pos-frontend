<template>
  <div class="bg-white dark:bg-dark-bg min-h-screen">
    <div class="flex justify-end mb-6">
      <TabsBar
        :tabs="[
          { label: translateOrdersTabs('add'), value: 'add' },
          { label: translateOrdersTabs('history'), value: 'history' }
        ]"
        :active-tab="currentView"
        @update:active-tab="currentView = $event"
      />
    </div>

    <div v-if="currentView === 'add'" class="grid grid-cols-3 gap-4">
      <div class="col-span-2">
        <MenuCategories />
      </div>
      <div>
        <CurrentOrder
          :number-of-tables="numberOfTables"
          :guests-per-table="guestsPerTable"
          :tax-rate="taxRate"
          :order="currentOrder"
          :is-processing="false"
          :form-error="''"
        />
      </div>
    </div>

    <div v-else>
      <ActiveOrders />
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuCategories from '../components/order/MenuCategories.vue'
import CurrentOrder from '../components/order/CurrentOrder.vue'
import ActiveOrders from '../components/order/ActiveOrders.vue'
import TabsBar from '../components/admin/TabsBar.vue'
import { ref, computed } from 'vue'
import { useTranslate } from '../composables/useTranslate'
import { useOrderStore } from '../stores/orderStore'
import type { Order } from '../stores/orderStore'

const { translate: translateOrdersTabs } = useTranslate('orders.tabs')
const orderStore = useOrderStore()

const currentOrder = computed<Order>(() => ({
  id:
    orderStore.currentOrder.id ||
    `#${Math.floor(Math.random() * 90000) + 10000}`,
  tableNumber: orderStore.currentOrder.tableNumber || null,
  orderType: orderStore.currentOrder.orderType || 'takeaway',
  items: orderStore.currentOrder.items || [],
  status: orderStore.currentOrder.status || 'pending',
  total: orderStore.currentOrder.total || 0,
  tax: orderStore.currentOrder.tax || 0,
  createdAt: new Date()
}))

const numberOfTables = ref(5)
const guestsPerTable = ref([6, 6, 4, 4, 4])
const taxRate = ref(8) // Tax rate in percentage
const currentView = ref('add')
</script>
