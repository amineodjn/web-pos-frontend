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
          <div class="flex items-center gap-2">
            <span
              v-if="!modelValue"
              class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
              >Order Center</span
            >
          </div>
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
                d="m9 5 7 7-7 7"
              />
              <path
                v-else
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m15 19-7-7 7-7"
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
        <div class="flex items-center gap-2 p-2">
          <div
            class="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold aspect-square"
          >
            D
          </div>
          <div v-if="!modelValue" class="flex flex-col">
            <span class="text-sm font-medium dark:text-white">John Doe</span>
            <span class="text-xs text-gray-500 dark:text-gray-400"
              >admin@example.com</span
            >
          </div>
        </div>
        <div class="flex items-center justify-around p-2">
          <div v-if="!modelValue" class="flex items-center">
            <LanguageSelector />
          </div>
          <DarkModeToggle />
          <button
            v-if="!modelValue"
            @click="handleLogout"
            class="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg
              class="w-5 h-5"
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
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useTranslate } from '../../composables/useTranslate'
import { computed } from 'vue'
import DarkModeToggle from '../navbar/DarkModeToggle.vue'
import LanguageSelector from '../navbar/LanguageSelector.vue'

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
</svg>`,
  kitchen: `<svg class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.011 13H20c-.367 2.5551-2.32 4.6825-4.9766 5.6162V20H8.97661v-1.3838C6.31996 17.6825 4.36697 15.5551 4 13h14.011Zm0 0c1.0995-.0059 1.989-.8991 1.989-2 0-.8637-.5475-1.59948-1.3143-1.87934M18.011 13H18m0-3.99997c.2409 0 .4718.04258.6857.12063m0 0c.8367-1.0335.7533-2.67022-.2802-3.50694-1.0335-.83672-2.5496-.6772-3.3864.35631-.293-1.50236-1.7485-2.15377-3.2509-1.8607-1.5023.29308-2.48263 1.74856-2.18956 3.25092C8.9805 6.17263 7.6182 5.26418 6.15462 6.00131 4.967 6.59945 4.45094 8.19239 5.04909 9.38002m0 0C4.37083 9.66467 4 10.3357 4 11.1174 4 12.1571 4.84288 13 5.88263 13m-.83354-3.61998c.2866-.12029 1.09613-.40074 2.04494.3418m5.27497-.89091c1.0047-.4589 2.1913-.01641 2.6502.98832"/>
</svg>`
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
  },
  {
    name: translateSideBar('kitchen'),
    path: '/admin/kitchen',
    icon: icons.kitchen
  }
])

const toggleSidebar = () => {
  emit('update:modelValue', !props.modelValue)
}

defineOptions({
  name: 'AdminSidebar'
})
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
