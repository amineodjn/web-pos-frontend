<template>
  <div class="p-5">
    <div class="grid grid-cols-3 gap-4 mb-6">
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
    <ActiveOrders />
  </div>
</template>

<script setup lang="ts">
import MenuCategories from '../components/order/MenuCategories.vue'
import CurrentOrder from '../components/order/CurrentOrder.vue'
import ActiveOrders from '../components/order/ActiveOrders.vue'
import { ref } from 'vue'

const numberOfTables = ref(5)
const guestsPerTable = ref([6, 6, 4, 4, 4])
const taxRate = ref(8) // Tax rate in percentage
</script>
