<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="handleClose"
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
              class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              @click="scrollHistory('up')"
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
              class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              @click="scrollHistory('down')"
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
        <div ref="historyContainer" class="space-y-2 max-h-32 overflow-y-auto">
          <button
            v-for="(historyComment, index) in visibleComments"
            :key="index"
            class="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
            @click="selectHistoryComment(historyComment)"
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
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          @click="handleClose"
        >
          {{ translateCurrentOrder('cancel') }}
        </button>
        <button
          class="px-4 py-2 bg-gray-900 text-white dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600"
          @click="handleSave"
        >
          {{ translateCurrentOrder('save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useTranslate } from '../../../composables/useTranslate';
  import { useOrderStore } from '@/stores/orderStore';
  import { useCommentHistoryStore } from '@/stores/commentHistoryStore';

  const { translate: translateCurrentOrder } = useTranslate('orders.currentOrder');
  const orderStore = useOrderStore();
  const commentHistoryStore = useCommentHistoryStore();

  interface Props {
    modelValue: boolean;
    itemId: string;
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const comment = ref<string>('');
  const commentHistory = ref<string[]>([]);
  const currentIndex = ref<number>(0);
  const visibleComments = ref<string[]>([]);

  watch(
    () => props.modelValue,
    newValue => {
      if (newValue) {
        const item = orderStore.currentOrder.items?.find(i => i.id === props.itemId);
        comment.value = item?.comment || '';
        commentHistory.value = commentHistoryStore.getComments();
        updateVisibleComments();
      } else {
        comment.value = '';
      }
    }
  );

  const updateVisibleComments = (): void => {
    const start = currentIndex.value;
    const end = Math.min(start + 3, commentHistory.value.length);
    visibleComments.value = commentHistory.value.slice(start, end);
  };

  const scrollHistory = (direction: 'up' | 'down'): void => {
    if (direction === 'up') {
      currentIndex.value = Math.max(0, currentIndex.value - 1);
    } else {
      currentIndex.value = Math.min(commentHistory.value.length - 3, currentIndex.value + 1);
    }
    updateVisibleComments();
  };

  const handleClose = (): void => {
    emit('update:modelValue', false);
  };

  const handleSave = (): void => {
    if (comment.value.trim()) {
      orderStore.handleUpdateItemComment(props.itemId, comment.value);
      commentHistoryStore.addComment(comment.value);
    }
    handleClose();
  };

  const selectHistoryComment = (historyComment: string): void => {
    comment.value = historyComment;
  };
</script>
