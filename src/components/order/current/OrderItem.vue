<template>
  <div class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
    <div>
      <span class="font-medium text-gray-900 dark:text-white">{{ item.name }}</span>
      <div class="text-sm text-gray-600 dark:text-gray-400">
        PLN{{ item.price.toFixed(2) }} × {{ item.quantity }}
      </div>
      <div v-if="item.comment" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        <span class="italic">"{{ item.comment }}"</span>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <span class="font-medium text-gray-900 dark:text-white"
        >PLN{{ (item.price * item.quantity).toFixed(2) }}</span
      >
      <button
        class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 p-1"
        @click="$emit('edit-comment', item.id)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      </button>
      <button
        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
        @click="$emit('remove', item.id)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { OrderItem } from '../../../stores/orderStore';

  defineProps<{
    item: OrderItem;
  }>();

  defineEmits<{
    (e: 'edit-comment', itemId: string): void;
    (e: 'remove', itemId: string): void;
  }>();
</script>
