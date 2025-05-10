<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <SearchInputUI
          v-model="searchQuery"
          :placeholder="translate('searchPlaceholder')"
          @update:model-value="handleSearch"
        />
        <div class="flex space-x-2">
          <SelectBoxUI
            v-model="currentFilter"
            :options="filterOptions"
            @update:model-value="handleFilterChange"
          />
          <SelectBoxUI
            v-model="currentSort"
            :options="sortOptions"
            @update:model-value="handleSortChange"
          />
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              {{ column.label }}
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              {{ translate('actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="loading" class="animate-pulse">
            <td :colspan="columns.length + 1" class="px-6 py-4 text-center">
              {{ translate('loading') }}
            </td>
          </tr>
          <tr v-else-if="filteredOrders.length === 0" class="text-center">
            <td :colspan="columns.length + 1" class="px-6 py-4 text-gray-500 dark:text-gray-400">
              {{ translate('noOrders') }}
            </td>
          </tr>
          <tr
            v-for="order in paginatedOrders"
            :key="order.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ order.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ formatDate(order.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ order.orderType === 'dine-in' ? order.tableNumber : translate('takeaway') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ order.items.length }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              PLN{{ order.total.toFixed(2) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  {
                    'bg-yellow-100 text-yellow-800': order.status === 'pending',
                    'bg-green-100 text-green-800': order.status === 'completed',
                    'bg-red-100 text-red-800': order.status === 'cancelled',
                  },
                ]"
              >
                {{ translate(`status.${order.status}`) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <button
                  v-for="action in visibleActions(order)"
                  :key="action.key"
                  :class="action.class"
                  @click="action.handler(order)"
                >
                  {{ action.label }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ translate('itemsPerPage') }}
          </span>
          <SelectBoxUI
            v-model="itemsPerPage"
            :options="itemsPerPageOptions"
            class="ml-2"
            @update:model-value="handleItemsPerPageChange"
          />
        </div>
        <div class="flex items-center space-x-2">
          <button
            class="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
          >
            {{ translate('previous') }}
          </button>
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ translate('page', { current: currentPage, total: totalPages }) }}
          </span>
          <button
            class="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            :disabled="currentPage === totalPages"
            @click="handlePageChange(currentPage + 1)"
          >
            {{ translate('next') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useTranslate } from '@/composables/useTranslate';
  import type { Order } from '@/types/order';
  import type { TableAction } from '@/types/table';
  import SearchInputUI from '@/components/ui/SearchInputUI.vue';
  import SelectBoxUI from '@/components/ui/SelectBoxUI.vue';

  const props = defineProps<{
    orders: Order[];
    actions: TableAction[];
    loading: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'search', query: string): void;
    (e: 'filter-change', filter: string): void;
    (e: 'sort-change', sort: string): void;
    (e: 'page-change', page: number): void;
    (e: 'items-per-page-change', itemsPerPage: number): void;
  }>();

  const { translate } = useTranslate('orders.table');

  const searchQuery = ref('');
  const currentFilter = ref('');
  const currentSort = ref('');
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const columns = [
    { key: 'id', label: translate('columns.id') },
    { key: 'date', label: translate('columns.date') },
    { key: 'type', label: translate('columns.type') },
    { key: 'items', label: translate('columns.items') },
    { key: 'total', label: translate('columns.total') },
    { key: 'status', label: translate('columns.status') },
  ];

  const filterOptions = [
    { value: '', label: translate('filters.all') },
    { value: 'pending', label: translate('filters.pending') },
    { value: 'completed', label: translate('filters.completed') },
    { value: 'cancelled', label: translate('filters.cancelled') },
  ];

  const sortOptions = [
    { value: 'date-desc', label: translate('sort.dateDesc') },
    { value: 'date-asc', label: translate('sort.dateAsc') },
    { value: 'total-desc', label: translate('sort.totalDesc') },
    { value: 'total-asc', label: translate('sort.totalAsc') },
  ];

  const itemsPerPageOptions = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];

  const filteredOrders = computed(() => {
    let result = [...props.orders];

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        order =>
          order.id.toLowerCase().includes(query) ||
          order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    if (currentFilter.value) {
      result = result.filter(order => order.status === currentFilter.value);
    }

    if (currentSort.value) {
      const [field, direction] = currentSort.value.split('-');
      result.sort((a, b) => {
        const aValue = field === 'date' ? new Date(a.createdAt).getTime() : a.total;
        const bValue = field === 'date' ? new Date(b.createdAt).getTime() : b.total;
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    return result;
  });

  const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value));

  const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredOrders.value.slice(start, end);
  });

  const visibleActions = (order: Order): TableAction[] => {
    return props.actions.filter(action => !action.condition || action.condition(order));
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleString();
  };

  const handleSearch = (query: string): void => {
    searchQuery.value = query;
    emit('search', query);
  };

  const handleFilterChange = (filter: string): void => {
    currentFilter.value = filter;
    emit('filter-change', filter);
  };

  const handleSortChange = (sort: string): void => {
    currentSort.value = sort;
    emit('sort-change', sort);
  };

  const handlePageChange = (page: number): void => {
    currentPage.value = page;
    emit('page-change', page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number): void => {
    itemsPerPage.value = newItemsPerPage;
    currentPage.value = 1;
    emit('items-per-page-change', newItemsPerPage);
  };
</script>
