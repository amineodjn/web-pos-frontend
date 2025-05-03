<template>
  <div
    class="md:max-h-[100px] md:min-h-[100px] xl:max-h-[330px] xl:min-h-[330px] mb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
  >
    <div
      v-if="!items?.length"
      class="text-center text-gray-500 dark:text-gray-400 mt-8"
    >
      <svg
        class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
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
      <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
        {{ translateCurrentOrder('noItems') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ translateCurrentOrder('selectItems') }}
      </p>
    </div>
    <div v-else class="space-y-2 pr-2">
      <OrderItemComponent
        v-for="item in reversedItems"
        :key="item.id"
        :item="item"
        @edit-comment="id => $emit('edit-comment', id)"
        @remove="id => $emit('remove', id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTranslate } from '../../../composables/useTranslate'
import OrderItemComponent from './OrderItem.vue'
import type { OrderItem } from '../../../stores/orderStore'

const { translate: translateCurrentOrder } = useTranslate('orders.currentOrder')

const props = defineProps<{
  items: OrderItem[] | undefined
}>()

defineEmits<{
  (e: 'edit-comment', itemId: string): void
  (e: 'remove', itemId: string): void
}>()

const reversedItems = computed(() => {
  return [...(props.items || [])].reverse()
})
</script>

<style scoped>
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
