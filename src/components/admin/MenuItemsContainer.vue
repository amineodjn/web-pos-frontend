<template>
  <div class="flex flex-col mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ headerConfig.title }}
      </h2>
      <span class="text-gray-500 dark:text-gray-400 text-sm">
        {{
          headerConfig.items.length === 1
            ? headerConfig.itemsCountSingular
            : headerConfig.itemsCountPlural
        }}
      </span>
    </div>

    <ListHeader
      :search-label="headerConfig.searchLabel"
      :search-placeholder="headerConfig.searchPlaceholder"
      :add-button-label="headerConfig.addButtonLabel"
      :is-processing="stateConfig.isProcessing"
      :initial-search-query="stateConfig.initialSearchQuery"
      @add-item="emit('add-item')"
      @search="handleSearch"
    >
      <template #filters>
        <slot name="filters"></slot>
      </template>
    </ListHeader>

    <slot v-if="headerConfig.items.length > 0" name="items-grid"></slot>

    <slot v-else name="empty-state"></slot>
  </div>
</template>

<script setup lang="ts">
  import ListHeader from './ListHeader.vue';
  import type { MenuItem } from '@/types/MenuData';

  defineProps<{
    headerConfig: {
      title: string;
      items: MenuItem[];
      itemsCountSingular: string;
      itemsCountPlural: string;
      searchLabel?: string;
      searchPlaceholder: string;
      addButtonLabel: string;
    };
    stateConfig: {
      isProcessing: boolean;
      initialSearchQuery?: string;
    };
  }>();

  const emit = defineEmits<{
    (e: 'add-item'): void;
    (e: 'search', query: string): void;
  }>();

  const handleSearch = (query: string): void => {
    emit('search', query);
  };
</script>
