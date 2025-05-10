<template>
  <div
    class="p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 group"
  >
    <div class="flex items-center justify-between">
      <div
        :class="`p-3 ${iconBgColor} rounded-lg group-hover:scale-110 transition-transform duration-300`"
      >
        <slot name="icon"></slot>
      </div>
      <div class="text-right">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{
          translateDashboard(`timeLabels.${timeLabel.toLowerCase()}`)
        }}</span>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {{ value }}
        </p>
      </div>
    </div>
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-4">
      {{ title }}
    </h2>
  </div>
</template>

<script setup lang="ts">
  import { useTranslate } from '../composables/useTranslate';

  const { translate: translateDashboard } = useTranslate('dashboard');

  defineProps({
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    timeLabel: {
      type: String,
      default: 'today',
    },
    iconBgColor: {
      type: String,
      default: 'bg-blue-100 dark:bg-blue-900',
    },
  });
</script>
