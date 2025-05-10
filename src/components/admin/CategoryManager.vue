<template>
  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
      {{ config.title }}
    </h2>
    <div class="mb-6 p-4 bg-gray-100 dark:bg-dark-bg border dark:border-gray-600 rounded">
      <h3 class="font-medium mb-2 text-gray-900 dark:text-white">
        {{ config.addNewLabel }}
      </h3>
      <div class="flex">
        <input
          v-model="categoryName"
          class="border border-gray-300 dark:border-gray-600 p-2 rounded mr-2 flex-grow bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white"
          :placeholder="config.placeholder"
        />
        <button
          :disabled="!categoryName || isProcessing"
          class="bg-gray-900 dark:bg-gray-800 dark:focus:ring-offset-gray-900 dark:hover:bg-gray-700 disabled:opacity-50 duration-300 flex focus:ring-2 focus:ring-offset-2 focus:ring-red-500 gap-2 hover:bg-gray-800 hover:shadow-lg items-center mt-0.5 px-4 py-2 rounded-lg shadow-md text-white transition-all"
          @click="handleAddCategory"
        >
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h14m-7 7V5"
            />
          </svg>
          <span v-if="isProcessing">{{ config.savingLabel }}</span>
          <span v-else>{{ config.addLabel }}</span>
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div
        v-for="category in categories"
        :key="category.categoryId"
        class="p-4 border border-gray-300 dark:border-gray-600 rounded flex justify-between items-center bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
      >
        <span>{{ category.categoryName }}</span>
        <button
          :disabled="isProcessing"
          class="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white p-2 rounded-full disabled:opacity-50 flex items-center transition-transform hover:scale-110"
          @click="$emit('delete', category)"
        >
          <svg
            class="w-5 h-5 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
            />
          </svg>
        </button>
      </div>
      <div
        v-if="categories.length === 0"
        class="p-4 text-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-bg"
      >
        {{ config.emptyMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import type { Category } from '../../types/MenuData';

  const props = defineProps<{
    categories: Category[];
    isProcessing: boolean;
    config: {
      title: string;
      addNewLabel: string;
      placeholder: string;
      savingLabel: string;
      addLabel: string;
      emptyMessage: string;
    };
  }>();

  const emit = defineEmits<{
    (e: 'add', value: string): void;
    (e: 'delete', value: Category): void;
  }>();

  const categoryName = ref('');

  const handleAddCategory = (): void => {
    if (categoryName.value.trim().toLocaleLowerCase() && !props.isProcessing) {
      emit('add', categoryName.value.trim().charAt(0).toUpperCase() + categoryName.value.slice(1));
      categoryName.value = '';
    }
  };
</script>
