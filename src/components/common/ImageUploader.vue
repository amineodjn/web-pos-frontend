<template>
  <div
    class="relative w-full"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
  >
    <div
      class="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors"
      :class="[
        isDragging
          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-500',
        'dark:bg-dark-bg'
      ]"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />

      <div v-if="!previewUrl" class="space-y-2">
        <svg
          class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <span
            class="font-medium text-red-600 dark:text-red-400 hover:text-red-500"
          >
            {{ translateImageUploader('upload.clickToUpload') }}
          </span>
          {{ translateImageUploader('upload.orDragAndDrop') }}
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ translateImageUploader('upload.supportedFormats') }}
        </p>
      </div>

      <div v-else class="relative">
        <img
          :src="previewUrl"
          :alt="translateImageUploader('upload.preview')"
          class="mx-auto max-h-48 rounded-lg object-contain"
        />
        <button
          @click.stop="removeImage"
          class="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTranslate } from '../../composables/useTranslate'

const { translate: translateImageUploader } = useTranslate('imageUploader')

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const previewUrl = ref(props.modelValue)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    handleFile(input.files[0])
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    handleFile(files[0])
  }
}

function handleFile(file: File) {
  if (!file.type.startsWith('image/')) {
    // TODO: Show error toast
    return
  }

  const reader = new FileReader()
  reader.onload = e => {
    const result = e.target?.result
    if (typeof result === 'string') {
      previewUrl.value = result
      emit('update:modelValue', result)
    }
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  previewUrl.value = ''
  emit('update:modelValue', '')
}
</script>
