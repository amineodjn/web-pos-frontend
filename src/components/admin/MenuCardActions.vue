<template>
  <div
    class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg cursor-pointer"
  >
    <div class="bg-gray-800 bg-opacity-75 backdrop-blur-sm p-3 rounded-lg flex gap-3">
      <button
        :disabled="isProcessing"
        class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-2 rounded-full disabled:opacity-50 flex items-center transition-transform hover:scale-110"
        @click="$emit('edit')"
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
            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
          />
        </svg>
      </button>
      <button
        :disabled="isProcessing"
        class="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white p-2 rounded-full disabled:opacity-50 flex items-center transition-transform hover:scale-110"
        @click="$emit('delete')"
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
    <div class="text-center mt-2">
      <span class="badge bg-gray-800 text-white px-3 py-1 rounded-full text-xs">
        {{ category }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    isProcessing: boolean;
    category: string;
  }>();

  defineEmits<{
    (e: 'edit'): void;
    (e: 'delete'): void;
  }>();
</script>
