<template>
  <div class="mb-4">
    <div class="flex gap-4 mb-2">
      <label class="flex items-center text-gray-900 dark:text-white">
        <input
          type="radio"
          v-model="orderType"
          value="dine-in"
          class="mr-2 text-gray-900 dark:text-gray-900 focus:ring-gray-900 dark:focus:ring-gray-900"
        />
        {{ translateOrderType('dine-in') }}
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrderStore } from '../../../stores/orderStore'
import SelectBoxUI from '../../common/SelectBoxUI.vue'
import { useTranslate } from '../../../composables/useTranslate'

const { translate: translateOrderType } = useTranslate(
  'orders.currentOrder.orderType'
)
const { translate: translateCurrentOrder } = useTranslate('orders.currentOrder')

const props = defineProps<{
  numberOfTables: number
  guestsPerTable: number[]
}>()

const emit = defineEmits<{
  (e: 'update:orderType', value: 'dine-in' | 'takeaway'): void
  (e: 'tableChange', value: number | null): void
}>()

const orderStore = useOrderStore()
const selectedTable = ref('')

const orderType = computed({
  get: () => orderStore.currentOrder.orderType || 'takeaway',
  set: value => emit('update:orderType', value)
})

const tableOptions = computed(() => {
  return Array.from({ length: props.numberOfTables }, (_, i) => ({
    label: `Table #${i + 1} (${props.guestsPerTable[i]} seats)`,
    value: i + 1
  }))
})

const handleTableChange = () => {
  if (selectedTable.value) {
    orderStore.setTable(Number(selectedTable.value))
    emit('tableChange', Number(selectedTable.value))
  } else {
    orderStore.clearOrder()
    emit('tableChange', null)
  }
}
</script>
