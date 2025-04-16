<template>
  <div
    class="md:max-h-[100px] md:min-h-[100px] xl:max-h-[330px] xl:min-h-[330px] mb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
  >
    <div
      v-if="!items?.length"
      class="text-center text-gray-500 dark:text-gray-400 mt-8"
    >
      {{ translateCurrentOrder('noItems') }}
      <p class="text-sm">{{ translateCurrentOrder('selectItems') }}</p>
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
  (e: 'edit-comment', itemId: number): void
  (e: 'remove', itemId: number): void
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
