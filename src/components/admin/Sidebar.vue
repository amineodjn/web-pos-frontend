<template>
  <aside
    :class="[
      'fixed top-0 left-0 z-40 h-screen transition-transform',
      modelValue ? 'w-16' : 'w-64',
      modelValue ? '-translate-x-0' : '-translate-x-full sm:translate-x-0'
    ]"
  >
    <div
      class="h-full flex flex-col justify-between px-3 py-4 overflow-y-auto bg-white dark:bg-dark-bg"
    >
      <div>
        <div class="flex items-center justify-between mb-5">
          <span
            v-if="!modelValue"
            class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
            >Admin Center</span
          >
          <button
            @click="toggleSidebar"
            class="p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                v-if="modelValue"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m15 19-7-7 7-7"
              />
              <path
                v-else
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m9 5 7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <ul class="space-y-2 font-medium">
          <li v-for="item in menuItems" :key="item.path">
            <router-link
              :to="item.path"
              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              :class="{ 'bg-gray-100 dark:bg-gray-700': isActive(item.path) }"
            >
              <span
                class="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                v-html="item.icon"
              ></span>
              <span v-if="!modelValue" class="ml-3">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      <div
        class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700"
      >
        <div
          v-if="modelValue"
          class="flex items-center justify-center p-2 text-gray-900 rounded-lg dark:text-white"
        >
          <span
            class="inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300 aspect-square"
          >
            A
          </span>
        </div>
        <div
          v-if="!modelValue"
          class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white"
        >
          <div class="flex-shrink-0">
            <span
              class="inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300"
            >
              A
            </span>
          </div>
          <div class="flex-1 min-w-0 ms-3">
            <p
              class="text-sm font-medium text-gray-900 truncate dark:text-white"
            >
              Admin User
            </p>
            <p class="text-sm text-gray-500 truncate dark:text-gray-400">
              admin@example.com
            </p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="flex items-center justify-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
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
              d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
            />
          </svg>
          <span v-if="!modelValue" class="ms-3">{{
            translateSideBar('logout')
          }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useTranslate } from '../../composables/useTranslate'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const route = useRoute()
const { translate: translateSideBar } = useTranslate('adminView.sidebar')
const icons = {
  dashboard: `<svg class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
               </svg>`,
  menu: `<svg class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
               </svg>`,
  orders: `<svg class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"/>
</svg>
`
}

const isActive = (path: string) => {
  return route.path === path
}

const handleLogout = () => {
  console.log('Logout clicked')
}

const menuItems = computed(() => [
  {
    name: translateSideBar('dashboard'),
    path: '/admin/dashboard',
    icon: icons.dashboard
  },
  {
    name: translateSideBar('menu'),
    path: '/admin/menu',
    icon: icons.menu
  },
  {
    name: translateSideBar('orders'),
    path: '/admin/orders',
    icon: icons.orders
  }
])

const toggleSidebar = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
