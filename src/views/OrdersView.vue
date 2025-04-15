<template>
  <div class="bg-white dark:bg-dark-bg min-h-screen">
    <div class="flex justify-end mb-6">
      <TabsBar
        :tabs="[
          { label: 'Add Order', value: 'add' },
          { label: 'Order History', value: 'history' }
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
import { ref } from 'vue'

const numberOfTables = ref(5)
const guestsPerTable = ref([6, 6, 4, 4, 4])
const taxRate = ref(8) // Tax rate in percentage
const currentView = ref('add')
</script>
