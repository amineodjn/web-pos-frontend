<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div
      class="max-w-screen-xl flex flex-wrap items-center md:justify-between mx-auto p-4"
    >
      <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <span
          class="self-center text-xl sm:text-2xl font-semibold whitespace-nowrap text-red-600"
          >{{ $t('brand.name') }}</span
        >
      </a>
      <div v-if="screenWidth < MAX_MOBILE_SCREEN_WIDTH">
        <div class="flex items-center gap-2 ml-2">
          <LanguageSelector />
          <DarkModeToggle />

          <button
            data-collapse-toggle="navbar-default"
            type="button"
            class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            :aria-expanded="isExpanded"
            @click="toggleMenu"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul
          class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li>
            <RouterLink
              to="/"
              class="block py-2 px-3 text-xl sm:text-2xl rounded-sm md:bg-transparent md:p-0 dark:text-white text-gray-900 md:hover:bg-transparent md:dark:hover:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="{ 'text-red-600': isMenuFocused }"
              aria-current="page"
              @click="setFocus('menu')"
              >{{ $t('navbar.menu') }}</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/about"
              class="block py-2 px-3 text-xl sm:text-2xl dark:text-white text-gray-900 rounded-sm md:hover:bg-transparent md:border-0 md:p-0 hover:bg-gray-100 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              :class="{ 'text-red-600': isAboutFocused }"
              @click="setFocus('about')"
              >{{ $t('navbar.about') }}</RouterLink
            >
          </li>
        </ul>
      </div>
      <div class="flex items-center gap-2">
        <LanguageSelector v-if="screenWidth > MAX_MOBILE_SCREEN_WIDTH" />
        <DarkModeToggle v-if="screenWidth > MAX_MOBILE_SCREEN_WIDTH" />
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import DarkModeToggle from './DarkModeToggle.vue'
import LanguageSelector from './LanguageSelector.vue'

const isMenuFocused = ref<boolean>(true)
const isAboutFocused = ref<boolean>(false)
const isExpanded = ref<boolean>(false)
const screenWidth = ref<number>(window.innerWidth)
const MAX_MOBILE_SCREEN_WIDTH = 480

const setFocus = (section: 'menu' | 'about'): void => {
  isMenuFocused.value = section === 'menu'
  isAboutFocused.value = section === 'about'
}

const toggleMenu = (): void => {
  isExpanded.value = !isExpanded.value
}

const updateScreenWidth = (): void => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth)
})
</script>
