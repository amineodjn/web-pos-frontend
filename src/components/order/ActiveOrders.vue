<template>
<<<<<<< Updated upstream
  <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      {{ translateActiveOrders('title') }}
    </h2>
    <div v-if="orderStore.activeOrders.length === 0" class="text-center py-12">
      <svg
        class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
        />
      </svg>
      <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
        {{ translateActiveOrders('empty.title') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ translateActiveOrders('empty.description') }}
      </p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th
              v-for="header in tableHeaders"
              :key="header.key"
              scope="col"
              class="px-6 py-3"
            >
              {{ translateActiveOrders(`headers.${header.key}`) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orderStore.activeOrders"
            :key="order.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          >
            <td class="px-6 py-4">{{ order.id }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'text-xs font-medium px-2.5 py-0.5 rounded',
                  {
                    'bg-blue-100 text-blue-800': order.orderType === 'dine-in',
                    'bg-purple-100 text-purple-800':
                      order.orderType === 'takeaway'
                  }
                ]"
              >
                {{ translateOrderType(order.orderType) }}
              </span>
            </td>
            <td class="px-6 py-4">
              {{
                order.orderType === 'dine-in'
                  ? translateActiveOrders('table.dineIn', {
                      number: order.tableNumber ?? 0
                    })
                  : translateActiveOrders('table.takeaway')
              }}
            </td>
            <td class="px-6 py-4">{{ order.items?.length || 0 }}</td>
            <td class="px-6 py-4">PLN{{ order.total.toFixed(2) }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'text-xs font-medium px-2.5 py-0.5 rounded',
                  {
                    'bg-yellow-100 text-yellow-800':
                      order.status === 'in-progress',
                    'bg-green-100 text-green-800': order.status === 'completed',
                    'bg-red-100 text-red-800': order.status === 'cancelled'
                  }
                ]"
              >
                {{ translateStatus(`${order.status}`) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <template v-for="action in orderActions" :key="action.label">
                <button
                  v-if="!action.condition || action.condition(order)"
                  @click="action.handler(order)"
                  :class="action.class"
                >
                  {{ translateActiveOrders(`actions.${action.key}`) }}
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <OrderDetailsModal
    v-if="selectedOrder"
    :is-open="isModalOpen"
    :order="selectedOrder"
    @close="closeModal"
  />
</template>

<script setup lang="ts">
import { useOrderStore, type Order } from '../../stores/orderStore'
import { useTranslate } from '../../composables/useTranslate'
import OrderDetailsModal from './OrderDetailsModal.vue'
import { ref } from 'vue'

const { translate: translateOrderType } = useTranslate(
  'orders.currentOrder.orderType'
)
const { translate: translateActiveOrders } = useTranslate('orders.activeOrders')
const { translate: translateStatus } = useTranslate('status')

const orderStore = useOrderStore()

const isModalOpen = ref(false)
const selectedOrder = ref<Order | null>(null)

function viewOrder(order: Order) {
  selectedOrder.value = order
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedOrder.value = null
}

const tableHeaders = [
  { key: 'id', label: 'Order ID' },
  { key: 'type', label: 'Type' },
  { key: 'table', label: 'Table' },
  { key: 'items', label: 'Items' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const orderActions = [
  {
    key: 'view',
    label: 'View',
    handler: (order: Order) => viewOrder(order),
    class: 'text-blue-600 hover:text-blue-900 mr-2',
    condition: null
  },
  {
    key: 'complete',
    label: 'Complete',
    handler: (order: Order) =>
      orderStore.updateOrderStatus(order.id, 'completed'),
    class: 'text-green-600 hover:text-green-900 mr-2',
    condition: (order: Order) => order.status === 'in-progress'
  },
  {
    key: 'cancel',
    label: 'Cancel',
    handler: (order: Order) =>
      orderStore.updateOrderStatus(order.id, 'cancelled'),
    class: 'text-red-600 hover:text-red-900',
    condition: (order: Order) => order.status === 'in-progress'
  }
]
=======
  <div class="active-orders">
    <OrdersTable
      :orders="orderStore.activeOrders"
      :actions="orderActions"
      :loading="orderStore.isLoading"
      @search="handleSearch"
      @filter-change="handleFilterChange"
      @sort-change="handleSortChange"
      @page-change="handlePageChange"
      @items-per-page-change="handleItemsPerPageChange"
    />

    <OrderDetailsModal
      v-if="isModalOpen"
      :order="selectedOrder"
      :is-open="isModalOpen"
      @close="handleCloseModal"
    />

    <ConfirmationModal
      v-if="isDeleteModalOpen"
      :is-open="isDeleteModalOpen"
      :is-processing="false"
      :title="translateModal('deleteOrder.title')"
      :message="translateModal('deleteOrder.message')"
      @confirm="handleDeleteConfirm"
      @cancel="handleCloseDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useOrderStore } from '@/stores/orderStore';
  import { useTranslate } from '@/composables/useTranslate';
  import type { Order, OrderStatus } from '@/types/order';
  import type { TableAction } from '@/types/table';
  import OrdersTable from '@/components/order/OrdersTable.vue';
  import OrderDetailsModal from '@/components/order/OrderDetailsModal.vue';
  import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';

  const { t: translateActiveOrders } = useI18n({
    inheritLocale: true,
    messages: {
      en: {
        activeOrders: {
          title: 'Active Orders',
          actions: {
            view: 'View',
            complete: 'Complete',
            cancel: 'Cancel',
          },
        },
      },
    },
  });

  const { translate: translateModal } = useTranslate('confirmationModal.buttons');

  const orderStore = useOrderStore();
  const selectedOrder = ref<Order | null>(null);
  const isModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const searchQuery = ref('');
  const currentFilter = ref('');
  const currentSort = ref('');
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const handleRefreshOrders = async (): Promise<void> => {
    try {
      await orderStore.handleFetchOrders();
    } catch (error) {
      console.error('Error refreshing orders:', error);
    }
  };

  const handleViewOrder = (order: Order): void => {
    selectedOrder.value = order;
    isModalOpen.value = true;
  };

  const handleCloseModal = (): void => {
    isModalOpen.value = false;
    selectedOrder.value = null;
  };

  const handleOpenDeleteModal = (order: Order): void => {
    selectedOrder.value = order;
    isDeleteModalOpen.value = true;
  };

  const handleCloseDeleteModal = (): void => {
    isDeleteModalOpen.value = false;
    selectedOrder.value = null;
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!selectedOrder.value) return;

    try {
      await orderStore.handleDeleteOrder(selectedOrder.value.id);
      handleCloseDeleteModal();
      await handleRefreshOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus): Promise<void> => {
    try {
      await orderStore.handleUpdateOrderStatus(orderId, newStatus);
      await handleRefreshOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleSearch = (query: string): void => {
    searchQuery.value = query;
  };

  const handleFilterChange = (filter: string): void => {
    currentFilter.value = filter;
  };

  const handleSortChange = (sort: string): void => {
    currentSort.value = sort;
  };

  const handlePageChange = (page: number): void => {
    currentPage.value = page;
  };

  const handleItemsPerPageChange = (newItemsPerPage: number): void => {
    itemsPerPage.value = newItemsPerPage;
    currentPage.value = 1;
  };

  const orderActions: TableAction[] = [
    {
      key: 'view',
      label: translateActiveOrders('actions.view'),
      handler: (order: Order) => handleViewOrder(order),
      class: 'text-blue-600 hover:text-blue-900 mr-2',
      condition: undefined,
    },
    {
      key: 'complete',
      label: translateActiveOrders('actions.complete'),
      handler: (order: Order) => handleStatusChange(order.id, 'completed'),
      class: 'text-green-600 hover:text-green-900 mr-2',
      condition: (order: Order) => order.status === 'pending',
    },
    {
      key: 'cancel',
      label: translateActiveOrders('actions.cancel'),
      handler: (order: Order) => handleOpenDeleteModal(order),
      class: 'text-red-600 hover:text-red-900',
      condition: (order: Order) => order.status === 'pending',
    },
  ];

  onMounted(async () => {
    await handleRefreshOrders();
  });
>>>>>>> Stashed changes
</script>
