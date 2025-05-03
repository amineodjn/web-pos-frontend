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

      <!-- Comment History -->
      <div v-if="commentHistory.length > 0" class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ translateCurrentOrder('recentComments') }}
          </h4>
          <div v-if="commentHistory.length > 3" class="flex gap-2">
            <button
              @click="scrollHistory('up')"
              class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <button
              @click="scrollHistory('down')"
              class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="space-y-2 max-h-32 overflow-y-auto" ref="historyContainer">
          <button
            v-for="(historyComment, index) in visibleComments"
            :key="index"
            @click="selectHistoryComment(historyComment)"
            class="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
          >
            {{ historyComment }}
          </button>
        </div>
      </div>

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
import { useCommentHistoryStore } from '../../../stores/commentHistoryStore'

const { translate: translateCurrentOrder } = useTranslate('orders.currentOrder')
const orderStore = useOrderStore()
const commentHistoryStore = useCommentHistoryStore()

const props = defineProps<{
  modelValue: boolean
  itemId: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const comment = ref('')
const commentHistory = ref<string[]>([])
const currentIndex = ref(0)
const visibleComments = ref<string[]>([])

watch(
  () => props.modelValue,
  newValue => {
    if (newValue && props.itemId) {
      const item = orderStore.currentOrder.items?.find(
        i => Number(i.id) === props.itemId
      )
      comment.value = item?.comment || ''
      commentHistory.value = commentHistoryStore.getComments()
      updateVisibleComments()
    } else {
      comment.value = ''
    }
  }
)

const updateVisibleComments = () => {
  const start = currentIndex.value
  const end = Math.min(start + 3, commentHistory.value.length)
  visibleComments.value = commentHistory.value.slice(start, end)
}

const scrollHistory = (direction: 'up' | 'down') => {
  if (direction === 'up') {
    currentIndex.value = Math.max(0, currentIndex.value - 1)
  } else {
    currentIndex.value = Math.min(
      commentHistory.value.length - 3,
      currentIndex.value + 1
    )
  }
  updateVisibleComments()
}

const close = () => {
  emit('update:modelValue', false)
}

const save = () => {
  if (props.itemId) {
    orderStore.updateItemComment(props.itemId, comment.value)
    if (comment.value.trim()) {
      commentHistoryStore.addComment(comment.value)
    }
    close()
  }
}

const selectHistoryComment = (historyComment: string) => {
  comment.value = historyComment
}
</script>
