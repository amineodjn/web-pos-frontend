<template>
  <main>
    <RouterView />
  </main>
  <ToastContainer />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastContainer from './components/common/ToastContainer.vue'
import { onMounted } from 'vue'
import { useAuth } from './composables/useAuth'

const { loadUser } = useAuth()

onMounted(async () => {
  await loadUser()
})
</script>
