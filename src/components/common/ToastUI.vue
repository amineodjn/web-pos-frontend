<template>
  <div
    v-if="visible"
    :class="[
      'fixed flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 rounded-lg shadow z-50',
      positionClass,
      typeClass,
    ]"
    role="alert"
  >
    <div
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
      :class="iconBgClass"
    >
      <template v-if="type === 'success'">
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
            d="M5 13l4 4L19 7"
          />
        </svg>
      </template>
      <template v-else-if="type === 'error'">
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </template>
      <template v-else-if="type === 'warning'">
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
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </template>
      <template v-else>
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
            d="M11 12h1v4h1m-6.31-4.9 1.6-1.7a1 1 0 0 1 1.42 0l3.38 3.38a1 1 0 0 1 0 1.42l-1.6 1.6a1 1 0 0 1-1.42 0l-3.38-3.38a1 1 0 0 1 0-1.42ZM14 6h.01M10 6h.01M6 6h.01"
          />
        </svg>
      </template>
      <span class="sr-only">{{ type }} icon</span>
    </div>
    <div class="ml-3 text-sm font-normal" :class="textClass">{{ message }}</div>
    <button
      type="button"
      class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
      aria-label="Close"
      @click="handleClose"
    >
      <span class="sr-only">Close</span>
      <svg
        class="w-3 h-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted } from 'vue';

  interface Props {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
    position?: string;
  }

  const props = defineProps<Props>();

  interface Emits {
    (e: 'close'): void;
  }

  const emit = defineEmits<Emits>();

  const visible = ref(true);

  const typeClass = computed((): string => {
    switch (props.type) {
      case 'success':
        return 'bg-white dark:bg-gray-800';
      case 'error':
        return 'bg-white dark:bg-gray-800';
      case 'warning':
        return 'bg-white dark:bg-gray-800';
      case 'info':
      default:
        return 'bg-white dark:bg-gray-800';
    }
  });

  const iconBgClass = computed((): string => {
    switch (props.type) {
      case 'success':
        return 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200';
      case 'warning':
        return 'text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200';
      case 'info':
      default:
        return 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200';
    }
  });

  const textClass = computed((): string => {
    return 'text-gray-700 dark:text-gray-300';
  });

  const positionClass = computed((): string => {
    switch (props.position) {
      case 'top-right':
        return 'top-5 right-5';
      case 'top-left':
        return 'top-5 left-5';
      case 'bottom-left':
        return 'bottom-5 left-5';
      case 'bottom-right':
      default:
        return 'bottom-5 right-5 z-50';
    }
  });

  const handleClose = (): void => {
    visible.value = false;
    emit('close');
  };

  onMounted((): void => {
    if (props.duration) {
      setTimeout(() => {
        handleClose();
      }, props.duration);
    }
  });
</script>

<style scoped>
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  div[role='alert'] {
    animation: slideIn 0.3s ease-out forwards;
  }
</style>
