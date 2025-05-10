<template>
  <div class="p-5">
    <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {{ translateDashboard('title') }}
      </h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Order Statistics Card -->
        <DashboardCard
          :title="translateDashboard('cards.ordersToday')"
          :value="todayOrdersCount"
          icon-bg-color="bg-blue-100 dark:bg-blue-900"
        >
          <template #icon>
            <svg
              class="w-8 h-8 text-blue-600 dark:text-blue-300"
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
                d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
              />
            </svg>
          </template>
        </DashboardCard>

        <!-- Revenue Card -->
        <DashboardCard
          :title="translateDashboard('cards.revenueToday')"
          :value="`PLN${todayRevenue}`"
          icon-bg-color="bg-green-100 dark:bg-green-900"
        >
          <template #icon>
            <svg
              class="w-8 h-8 text-green-600 dark:text-green-300"
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
                d="M13.6 16.733c.234.269.548.456.895.534a1.4 1.4 0 0 0 1.75-.762c.172-.615-.446-1.287-1.242-1.481-.796-.194-1.41-.861-1.241-1.481a1.4 1.4 0 0 1 1.75-.762c.343.077.654.26.888.524m-1.358 4.017v.617m0-5.939v.725M4 15v4m3-6v6M6 8.5 10.5 5 14 7.5 18 4m0 0h-3.5M18 4v3m2 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
              />
            </svg>
          </template>
        </DashboardCard>

        <!-- Menu Items Card -->
        <DashboardCard
          :title="translateDashboard('cards.menuItems')"
          :value="totalMenuItems"
          time-label="Total"
          icon-bg-color="bg-purple-100 dark:bg-purple-900"
        >
          <template #icon>
            <svg
              class="w-8 h-8 text-purple-600 dark:text-purple-300"
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
                d="M6 12c.263 0 .524-.06.767-.175a2 2 0 0 0 .65-.491c.186-.21.333-.46.433-.734.1-.274.15-.568.15-.864a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 12 9.736a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 16 9.736c0 .295.052.588.152.861s.248.521.434.73a2 2 0 0 0 .649.488 1.809 1.809 0 0 0 1.53 0 2.03 2.03 0 0 0 .65-.488c.185-.209.332-.457.433-.73.1-.273.152-.566.152-.861 0-.974-1.108-3.85-1.618-5.121A.983.983 0 0 0 17.466 4H6.456a.986.986 0 0 0-.93.645C5.045 5.962 4 8.905 4 9.736c.023.59.241 1.148.611 1.567.37.418.865.667 1.389.697Zm0 0c.328 0 .651-.091.94-.266A2.1 2.1 0 0 0 7.66 11h.681a2.1 2.1 0 0 0 .718.734c.29.175.613.266.942.266.328 0 .651-.091.94-.266.29-.174.537-.427.719-.734h.681a2.1 2.1 0 0 0 .719.734c.289.175.612.266.94.266.329 0 .652-.091.942-.266.29-.174.536-.427.718-.734h.681c.183.307.43.56.719.734.29.174.613.266.941.266a1.819 1.819 0 0 0 1.06-.351M6 12a1.766 1.766 0 0 1-1.163-.476M5 12v7a1 1 0 0 0 1 1h2v-5h3v5h7a1 1 0 0 0 1-1v-7m-5 3v2h2v-2h-2Z"
              />
            </svg>
          </template>
        </DashboardCard>
      </div>

      <!-- Recent Orders Table -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {{ translateDashboard('recentOrders') }}
        </h2>
        <OrdersTable :orders="recentOrders" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
<<<<<<< Updated upstream
import { computed } from 'vue'
import { useOrderStore } from '../stores/orderStore'
import { useMenuStore } from '../stores/menuStore'
import OrdersTable from '../components/OrdersTable.vue'
import DashboardCard from '../components/DashboardCard.vue'
import { useTranslate } from '../composables/useTranslate'
=======
  import { computed, onMounted } from 'vue';
  import { useOrderStore } from '../stores/orderStore';
  import { useMenuStore } from '../stores/menuStore';
  import OrdersTable from '../components/OrdersTable.vue';
  import DashboardCard from '../components/DashboardCard.vue';
  import { useTranslate } from '../composables/useTranslate';
  import { useToast } from '../composables/useToast';
>>>>>>> Stashed changes

const { translate: translateDashboard } = useTranslate('dashboard')

const orderStore = useOrderStore()
const menuStore = useMenuStore()

<<<<<<< Updated upstream
const today = new Date()
today.setHours(0, 0, 0, 0)
=======
  const { error: showError } = useToast();

  onMounted(async () => {
    try {
      await orderStore.handleFetchOrders();
    } catch (error) {
      showError('Failed to fetch orders. Please try again.');
    }
  });
>>>>>>> Stashed changes

const todayOrdersCount = computed(() => {
  return orderStore.activeOrders.filter(order => {
    const orderDate = new Date(order.createdAt)
    return orderDate >= today
  }).length
})

const todayRevenue = computed(() => {
  return orderStore.activeOrders
    .filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= today
    })
    .reduce((total, order) => total + order.total, 0)
    .toFixed(2)
})

const totalMenuItems = computed(() => {
  return menuStore.allItems.length
})

const recentOrders = computed(() => {
  return [...orderStore.activeOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)
})
</script>
