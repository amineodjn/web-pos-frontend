<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div
      class="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl dark:bg-dark-bg dark:text-white"
    >
      <!-- Processing overlay -->
      <div
        v-if="isProcessing"
        class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 dark:bg-gray-900 dark:bg-opacity-70"
      >
        <div class="text-center">
          <SpinnerUI />
          <p class="text-gray-600 mt-4 dark:text-gray-300">
            {{ processingText }}
          </p>
        </div>
      </div>

      <div class="mb-6">
        <div class="flex items-center mb-4 text-red-600">
          <slot name="icon">
            <svg
              class="w-8 h-8 mr-3"
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
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </slot>
          <h3 class="text-lg font-semibold">{{ title }}</h3>
        </div>
        <p class="text-gray-700 dark:text-gray-300">
          <slot>{{ message }}</slot>
        </p>
      </div>

      <div class="flex justify-end gap-3">
        <button
          @click="cancel"
          :disabled="isProcessing"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors duration-300"
        >
          {{ cancelText || translate('buttons.cancel') }}
        </button>
        <button
          @click="confirm"
          :disabled="isProcessing"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <span v-if="isProcessing">
            <SpinnerUI class="w-5 h-5" />
          </span>
          <svg
            v-else
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
              d="M5 12l5 5L20 7"
            />
          </svg>
          <span>{{
            isProcessing
              ? processingText
              : confirmText || translate('buttons.confirm')
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SpinnerUI from './SpinnerUI.vue'
import { useTranslate } from '../../composables/useTranslate'

const { translate } = useTranslate('confirmationModal')

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to perform this action?'
  },
  confirmText: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: ''
  },
  processingText: {
    type: String,
    default: 'Processing...'
  },
  isProcessing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

function confirm() {
  if (props.isProcessing) return
  emit('confirm')
}

function cancel() {
  if (props.isProcessing) return
  emit('update:modelValue', false)
  emit('cancel')
}
</script>
