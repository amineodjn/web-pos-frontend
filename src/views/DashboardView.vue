<template>
  <div class="p-5">
    <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Dashboard
      </h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Order Statistics Card -->
        <div
          class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white"
        >
          <div class="flex items-center">
            <div class="p-3 bg-blue-600 rounded-lg">
              <svg
                class="w-8 h-8"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923Z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-xl font-semibold">Orders Today</h2>
              <p class="text-3xl font-bold mt-2">25</p>
            </div>
          </div>
        </div>

        <!-- Revenue Card -->
        <div
          class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white"
        >
          <div class="flex items-center">
            <div class="p-3 bg-green-600 rounded-lg">
              <svg
                class="w-8 h-8"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1M2 5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-xl font-semibold">Revenue Today</h2>
              <p class="text-3xl font-bold mt-2">$1,250</p>
            </div>
          </div>
        </div>

        <!-- Menu Items Card -->
        <div
          class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white"
        >
          <div class="flex items-center">
            <div class="p-3 bg-purple-600 rounded-lg">
              <svg
                class="w-8 h-8"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19M1 10h10.424a3.228 3.228 0 0 0 6.152 0H19M1 15h1.424a3.228 3.228 0 0 0 6.152 0H19"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-xl font-semibold">Menu Items</h2>
              <p class="text-3xl font-bold mt-2">42</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Orders
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
                <th scope="col" class="px-6 py-3">Customer</th>
                <th scope="col" class="px-6 py-3">Items</th>
                <th scope="col" class="px-6 py-3">Total</th>
                <th scope="col" class="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td class="px-6 py-4">#12345</td>
                <td class="px-6 py-4">John Doe</td>
                <td class="px-6 py-4">3</td>
                <td class="px-6 py-4">$45.00</td>
                <td class="px-6 py-4">
                  <span
                    class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                  >
                    Completed
                  </span>
                </td>
              </tr>
              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td class="px-6 py-4">#12344</td>
                <td class="px-6 py-4">Jane Smith</td>
                <td class="px-6 py-4">2</td>
                <td class="px-6 py-4">$25.50</td>
                <td class="px-6 py-4">
                  <span
                    class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300"
                  >
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dashboard logic will be added here
</script>
