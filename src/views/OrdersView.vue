<template>
  <div class="p-5">
    <div class="grid grid-cols-3 gap-4 mb-6">
      <!-- Menu Items Section -->
      <div class="col-span-2 bg-white dark:bg-dark-bg rounded-lg shadow p-6">
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Menu Items
          </h2>
          <!-- Category Filters -->
          <div class="relative w-full mb-4">
            <!-- Left scroll button -->
            <button
              @click="scrollCategories('left')"
              class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center"
              :class="{ invisible: isScrolledLeft }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <!-- Categories container -->
            <div
              ref="categoriesContainer"
              class="flex gap-2 overflow-x-auto py-2 no-scrollbar px-10 scroll-smooth"
            >
              <button
                v-for="category in ['All', ...menuStore.categories]"
                :key="category"
                @click="selectedCategory = category"
                :class="[
                  'px-4 py-2 rounded-md whitespace-nowrap flex-shrink-0',
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                ]"
              >
                {{ category }}
              </button>
            </div>

            <!-- Right scroll button -->
            <button
              @click="scrollCategories('right')"
              class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center"
              :class="{ invisible: isScrolledRight }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <!-- Menu Categories -->
          <div class="space-y-8">
            <template v-if="selectedCategory === 'All'">
              <OrderCategorySection
                v-for="category in menuStore.categories"
                :key="category"
                :category="category"
                :items="menuStore.items[category]"
                :onIntersect="() => {}"
              />
            </template>
            <template v-else>
              <OrderCategorySection
                :category="selectedCategory"
                :items="menuStore.items[selectedCategory] || []"
                :onIntersect="() => {}"
              />
            </template>
          </div>
        </div>
      </div>

      <!-- Current Order Section -->
      <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Current Order
        </h2>
        <!-- Table Selection -->
        <div class="mb-4">
          <select
            v-model="selectedTable"
            class="w-full p-2 border rounded-md"
            @change="orderStore.setTable(Number(selectedTable))"
          >
            <option value="">Select Table</option>
            <option v-for="n in 15" :key="n" :value="n">
              Table #{{ n }} ({{ n <= 6 ? 6 : 4 }} seats)
            </option>
          </select>
        </div>
        <!-- Server Info -->
        <div class="mb-4 text-sm text-gray-600">
          <p>
            Server: Admin User | Guests:
            <input
              type="number"
              class="w-16 border rounded px-2"
              min="1"
              :value="orderStore.currentOrder.guests"
              @input="
                e =>
                  orderStore.setGuests(
                    Number((e.target as HTMLInputElement).value)
                  )
              "
            />
          </p>
        </div>
        <!-- Order Items List -->
        <div class="mb-4 min-h-[200px]">
          <div
            v-if="!orderStore.currentOrder.items?.length"
            class="text-center text-gray-500 mt-8"
          >
            No items in order yet
            <p class="text-sm">Select menu items to add</p>
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="item in orderStore.currentOrder.items"
              :key="item.id"
              class="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <div>
                <span class="font-medium">{{ item.name }}</span>
                <div class="text-sm text-gray-600">
                  PLN{{ item.price.toFixed(2) }} × {{ item.quantity }}
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium"
                  >PLN{{ (item.price * item.quantity).toFixed(2) }}</span
                >
                <button
                  @click="orderStore.removeItemFromOrder(item.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Order Summary -->
        <div class="border-t pt-4">
          <div class="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>PLN{{ orderStore.subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span>Tax (8%)</span>
            <span>PLN{{ orderStore.tax.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between font-bold mb-4">
            <span>Total</span>
            <span>PLN{{ orderStore.total.toFixed(2) }}</span>
          </div>
          <button
            @click="placeOrder"
            :disabled="!canPlaceOrder"
            :class="[
              'w-full py-2 rounded-md mb-2',
              canPlaceOrder
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            ]"
          >
            Place Order
          </button>
          <button
            @click="orderStore.clearOrder"
            class="w-full border border-gray-300 py-2 rounded-md"
          >
            Clear Order
          </button>
        </div>
      </div>
    </div>

    <!-- Active Orders Section -->
    <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Active Orders
      </h2>
      <div class="overflow-x-auto">
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="px-6 py-3">Order ID</th>
              <th scope="col" class="px-6 py-3">Table</th>
              <th scope="col" class="px-6 py-3">Server</th>
              <th scope="col" class="px-6 py-3">Items</th>
              <th scope="col" class="px-6 py-3">Total</th>
              <th scope="col" class="px-6 py-3">Status</th>
              <th scope="col" class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in orderStore.activeOrders"
              :key="order.id"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td class="px-6 py-4">{{ order.id }}</td>
              <td class="px-6 py-4">Table {{ order.tableNumber }}</td>
              <td class="px-6 py-4">{{ order.server }}</td>
              <td class="px-6 py-4">{{ order.items?.length || 0 }}</td>
              <td class="px-6 py-4">PLN{{ order.total.toFixed(2) }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'text-xs font-medium px-2.5 py-0.5 rounded',
                    {
                      'bg-yellow-100 text-yellow-800':
                        order.status === 'in-progress',
                      'bg-green-100 text-green-800':
                        order.status === 'completed',
                      'bg-red-100 text-red-800': order.status === 'cancelled'
                    }
                  ]"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button
                  @click="viewOrder(order)"
                  class="text-blue-600 hover:text-blue-900 mr-2"
                >
                  View
                </button>
                <button
                  v-if="order.status === 'in-progress'"
                  @click="orderStore.updateOrderStatus(order.id, 'completed')"
                  class="text-green-600 hover:text-green-900 mr-2"
                >
                  Complete
                </button>
                <button
                  v-if="order.status === 'in-progress'"
                  @click="orderStore.updateOrderStatus(order.id, 'cancelled')"
                  class="text-red-600 hover:text-red-900"
                >
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMenuStore } from '../stores/menuStore'
import { useOrderStore } from '../stores/orderStore'
import OrderCategorySection from '../components/menu/OrderCategorySection.vue'

const menuStore = useMenuStore()
const orderStore = useOrderStore()

const selectedCategory = ref('All')
const selectedTable = ref('')
const categoriesContainer = ref<HTMLElement | null>(null)
const isScrolledLeft = ref(true)
const isScrolledRight = ref(false)

// Check scroll position
const checkScroll = () => {
  if (!categoriesContainer.value) return

  const { scrollLeft, scrollWidth, clientWidth } = categoriesContainer.value
  isScrolledLeft.value = scrollLeft <= 0
  isScrolledRight.value = scrollLeft + clientWidth >= scrollWidth - 1
}

// Scroll categories
const scrollCategories = (direction: 'left' | 'right') => {
  if (!categoriesContainer.value) return

  const scrollAmount = 200 // Adjust this value to change scroll distance
  const currentScroll = categoriesContainer.value.scrollLeft
  const newScroll =
    direction === 'left'
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount

  categoriesContainer.value.scrollTo({
    left: newScroll,
    behavior: 'smooth'
  })
}

// Add scroll event listener
onMounted(() => {
  if (categoriesContainer.value) {
    categoriesContainer.value.addEventListener('scroll', checkScroll)
    // Initial check
    checkScroll()
  }
})

onUnmounted(() => {
  if (categoriesContainer.value) {
    categoriesContainer.value.removeEventListener('scroll', checkScroll)
  }
})

// Check if order can be placed
const canPlaceOrder = computed(() => {
  return selectedTable.value && (orderStore.currentOrder.items?.length || 0) > 0
})

// Place order handler
async function placeOrder() {
  try {
    await orderStore.placeOrder()
    selectedTable.value = ''
  } catch (error) {
    console.error('Failed to place order:', error)
    // Here you would typically show an error message to the user
  }
}

// View order details
function viewOrder(order: any) {
  // Implement order details view
  console.log('View order:', order)
}
</script>

<style scoped>
.bg-primary {
  background-color: #1a237e;
}

/* Add smooth scrolling for category sections */
.space-y-8 {
  scroll-behavior: smooth;
}

/* Custom scrollbar hiding utility class */
.no-scrollbar {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* Ensure buttons don't shrink */
button {
  flex-shrink: 0;
}
</style>
