<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="close"
  >
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
      @click.stop
    >
      <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-white">
        {{ translateCurrentOrder('addComment') }}
      </h3>
      <textarea
        v-model="comment"
        class="w-full p-2 border border-gray-300 focus:border-gray-600 focus:ring-gray-600 dark:border-gray-600 dark:focus:border-gray-600 dark:focus:ring-gray-600 rounded-md mb-4 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
        rows="3"
        :placeholder="translateCurrentOrder('commentPlaceholder')"
      ></textarea>
      <div class="flex justify-end gap-2">
        <button
          @click="close"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          {{ translateCurrentOrder('cancel') }}
        </button>
        <button
          @click="save"
          class="px-4 py-2 bg-gray-900 text-white dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600"
        >
          {{ translateCurrentOrder('save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTranslate } from '../../../composables/useTranslate'
import { useOrderStore } from '../../../stores/orderStore'

const { translate: translateCurrentOrder } = useTranslate('orders.currentOrder')
const orderStore = useOrderStore()

const props = defineProps<{
  modelValue: boolean
  itemId: number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const comment = ref('')

watch(
  () => props.modelValue,
  newValue => {
    if (newValue && props.itemId !== null) {
      const item = orderStore.currentOrder.items?.find(
        i => i.id === props.itemId
      )
      comment.value = item?.comment || ''
    } else {
      comment.value = ''
    }
  }
)

const close = () => {
  emit('update:modelValue', false)
}

const save = () => {
  if (props.itemId !== null) {
    orderStore.updateItemComment(props.itemId, comment.value)
    close()
  }
}
</script>
