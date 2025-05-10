<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="closeModal"
  >
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4"
      @click.stop
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ translate('title', { orderId: order.id }) }}
        </h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

      <div class="mt-4">
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ translate('orderType') }}:
            <span class="font-medium text-gray-900 dark:text-white">
              {{ translateOrderType(order.orderType) }}
            </span>
          </span>
          <span
            :class="[
              'text-xs font-medium px-2.5 py-0.5 rounded',
              {
                'bg-yellow-100 text-yellow-800': order.status === 'pending',
                'bg-green-100 text-green-800': order.status === 'completed',
                'bg-red-100 text-red-800': order.status === 'cancelled',
              },
            ]"
          >
            {{ translateStatus(order.status) }}
          </span>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
            {{ translate('items') }}
          </h4>
          <div class="space-y-3">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex justify-between items-center"
            >
              <div class="flex items-center space-x-3">
                <span class="text-sm text-gray-900 dark:text-white">
                  {{ item.name }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400"> x{{ item.quantity }} </span>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                PLN{{ (item.price * item.quantity).toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
          <div class="flex justify-between items-center">
            <span class="text-base font-medium text-gray-900 dark:text-white">
              {{ translate('total') }}
            </span>
            <span class="text-lg font-bold text-gray-900 dark:text-white">
              PLN{{ order.total.toFixed(2) }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          @click="closeModal"
        >
          {{ translate('close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTranslate } from '../../composables/useTranslate';
  import type { Order } from '../../stores/orderStore';

  defineProps<{
    isOpen: boolean;
    order: Order;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
  }>();

  const { translate } = useTranslate('orders.orderDetails');
  const { translate: translateOrderType } = useTranslate('orders.currentOrder.orderType');
  const { translate: translateStatus } = useTranslate('status');

  const closeModal = () => {
    emit('close');
  };
</script>
