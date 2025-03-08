<template>
  <BadgeUI>
    <template #default>HELLO</template>
  </BadgeUI>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { fetchData } from '../utils/HandleRequests'
import BadgeUI from '../components/ui/BadgeUI.vue'

const menuData = ref(null)

;(async () => {
  try {
    menuData.value = await fetchData('http://192.168.0.15:5000/api/menu/dummy')
    console.log(menuData.value)
  } catch (error) {
    console.error('Failed to fetch menu data', error)
  }
})()
</script>
