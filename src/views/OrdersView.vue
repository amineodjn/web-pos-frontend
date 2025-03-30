<template>
  <div class="p-5">
    <div class="bg-white dark:bg-dark-bg rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Orders
      </h1>

      <!-- Orders Table -->
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
              <th scope="col" class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
              <td class="px-6 py-4">
                <button
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                >
                  View
                </button>
                <button
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
              <td class="px-6 py-4">
                <button
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                >
                  View
                </button>
                <button
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
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
// Orders logic will be added here
</script>
