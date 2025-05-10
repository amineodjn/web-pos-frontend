<template>
  <div
    class="flex flex-col items-center justify-center p-12 text-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
    <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
      {{ title }}
    </p>
    <p class="mt-1 text-gray-500 dark:text-gray-400">
      {{ description }}
    </p>
    <button
      :disabled="isProcessing"
      class="mt-6 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2 mx-auto transition-all duration-300 shadow-md hover:shadow-lg"
      @click="$emit('add-item')"
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
      {{ buttonLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title: string;
    description: string;
    buttonLabel: string;
    isProcessing: boolean;
  }>();

  defineEmits<{
    (e: 'add-item'): void;
  }>();
</script>
