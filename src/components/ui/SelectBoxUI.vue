<template>
  <div class="select-box-component">
    <label v-if="$slots.label || label" :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      <slot name="label">{{ label }}</slot>
    </label>
    <select 
      :id="id"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
      v-model="internalValue"
      @change="onChange"
      :required="required"
    >
      <option v-if="placeholder" :value="placeholderValue" :disabled="placeholderDisabled">{{ placeholder }}</option>
      <option 
        v-for="(option, index) in options" 
        :key="index" 
        :value="getOptionValue(option)"
        :disabled="isOptionDisabled(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

type OptionObject = {
  label: string
  value: any
  disabled?: boolean
}

type OptionItem = OptionObject | string | number

const props = defineProps({
  id: {
    type: String,
    default: () => `select-${Math.random().toString(36).substring(2, 9)}`
  },
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number, Object],
    default: ''
  },
  options: {
    type: Array as () => OptionItem[],
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  placeholderValue: {
    type: [String, Number],
    default: ''
  },
  placeholderDisabled: {
    type: Boolean,
    default: false
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const internalValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
})

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const onChange = (event: Event) => {
  emit('change', event)
}

const isOptionObject = (option: OptionItem): option is OptionObject => {
  return typeof option === 'object' && option !== null
}

const getOptionValue = (option: OptionItem): any => {
  if (isOptionObject(option)) {
    return option[props.valueKey as keyof OptionObject] !== undefined 
      ? option[props.valueKey as keyof OptionObject] 
      : option
  }
  return option
}

const getOptionLabel = (option: OptionItem): string => {
  if (isOptionObject(option)) {
    return option[props.labelKey as keyof OptionObject] !== undefined 
      ? String(option[props.labelKey as keyof OptionObject]) 
      : String(option)
  }
  return String(option)
}

const isOptionDisabled = (option: OptionItem): boolean => {
  if (isOptionObject(option)) {
    return !!option.disabled
  }
  return false
}
</script>

<style scoped>
.select-box-component select {
  appearance: none;
  padding-right: 2.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%236b7280' class='w-6 h-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em;
}
</style> 