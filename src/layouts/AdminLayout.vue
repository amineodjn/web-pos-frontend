<template>
  <div class="flex h-screen dark:bg-dark-bg">
    <Sidebar v-model="isSidebarCollapsed" />
    <div
      class="flex-1 transition-all duration-300"
      :class="[isSidebarCollapsed ? 'ml-16' : 'ml-64']"
    >
      <div
        class="admin-view relative bg-white dark:bg-dark-bg p-5 rounded min-h-screen"
      >
        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="flex items-center justify-center min-h-[400px]"
        >
          <div class="text-center">
            <SpinnerUI />
            <p class="text-gray-600 dark:text-gray-300 mt-4">Loading...</p>
          </div>
        </div>

        <!-- Error State -->
        <ErrorUI
          v-else-if="error"
          errorType="auth"
          title="Authentication Error"
          :message="error"
          retryText="Try Again"
          @retry="handleAuthRetry"
        />

        <!-- Admin Content -->
        <RouterView v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/admin/Sidebar.vue'
import SpinnerUI from '../components/common/SpinnerUI.vue'
import ErrorUI from '../components/common/ErrorUI.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { isLoading, error, checkAuth } = useAuth()
const isSidebarCollapsed = ref(false)

const handleAuthRetry = async () => {
  const authenticated = await checkAuth()
  if (!authenticated) {
    router.push('/')
  }
}

onMounted(async () => {
  const authenticated = await checkAuth()
  if (!authenticated) {
    router.push('/')
  }
})
</script>

<style scoped>
.admin-view {
  min-height: calc(100vh - 2.5rem);
}
</style>
