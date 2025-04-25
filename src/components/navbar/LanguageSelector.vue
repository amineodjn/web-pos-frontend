<template>
  <div class="relative">
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
    >
      <svg
        class="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m13 19 3.5-9 3.5 9m-6.125-2h5.25M3 7h7m0 0h2m-2 0c0 1.63-.793 3.926-2.239 5.655M7.5 6.818V5m.261 7.655C6.79 13.82 5.521 14.725 4 15m3.761-2.345L5 10m2.761 2.655L10.2 15"
        />
      </svg>
    </button>
    <div
      v-if="isOpen"
      class="absolute -right-2 bottom-full mb-2 min-w-[80px] bg-white rounded-lg shadow-lg dark:bg-gray-700 z-50 border border-gray-200 dark:border-gray-600"
    >
      <div class="py-1">
        <button
          @click="selectLanguage('en')"
          class="flex items-center w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
          :class="{ 'bg-gray-100 dark:bg-gray-600': currentLocale === 'en' }"
        >
          <span class="ml-1">ENG</span>
        </button>
        <button
          @click="selectLanguage('pl')"
          class="flex items-center w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
          :class="{ 'bg-gray-100 dark:bg-gray-600': currentLocale === 'pl' }"
        >
          <span class="ml-1">PL</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLocale = ref(locale.value)
const isOpen = ref(false)

const selectLanguage = (lang: string) => {
  currentLocale.value = lang
  locale.value = lang
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(locale, newLocale => {
  currentLocale.value = newLocale
})
</script>
