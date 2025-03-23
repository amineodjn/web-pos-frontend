<template>
  <select
    v-model="currentLocale"
    @change="changeLocale"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-400 dark:focus:border-gray-400"
  >
    <option value="en">ENG</option>
    <option value="pl">PL</option>
  </select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLocale = ref(locale.value)

const changeLocale = () => {
  locale.value = currentLocale.value
}

watch(locale, newLocale => {
  currentLocale.value = newLocale
})
</script>
