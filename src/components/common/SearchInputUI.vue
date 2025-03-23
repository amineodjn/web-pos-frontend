<template>
  <div class="search-input-component">
    <label v-if="$slots.label || label" :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      <slot name="label">{{ label }}</slot>
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      <input 
        :type="type" 
        :id="id" 
        :placeholder="placeholder"
        :value="modelValue"
        @input="updateValue"
        @keyup.enter="$emit('search')"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full ps-10 p-2.5 dark:bg-dark-bg dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
        :required="required"
      />
      <button 
        v-if="showClearButton && modelValue" 
        @click="clearInput" 
        type="button"
        class="absolute inset-y-0 end-0 flex items-center pe-3 hover:text-red-500"
      >
        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: String,
    default: () => `search-${Math.random().toString(36).substring(2, 9)}`
  },
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  type: {
    type: String,
    default: 'search'
  },
  required: {
    type: Boolean,
    default: false
  },
  showClearButton: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const clearInput = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
.search-input-component input::-webkit-search-cancel-button {
  display: none;
}
</style> 