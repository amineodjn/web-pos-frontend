<template>
  <span :class="['text-xs font-medium px-2.5 py-0.5 rounded', statusClasses]">
    {{ translatedStatus }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTranslate } from '../../composables/useTranslate'
import type { OrderStatus } from '../../types/order'

const props = defineProps<{
  status: OrderStatus
}>()

const { translate } = useTranslate('status')

const translatedStatus = computed(() => translate(props.status))

const statusClasses = computed(() => {
  switch (props.status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'preparing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'ready':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
})
</script>
