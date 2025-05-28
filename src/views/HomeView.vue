<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div
      class="relative bg-white dark:bg-dark-bg lg:min-h-screen lg:flex lg:items-center flex-col"
    >
      <!-- Auth Testing Section -->
      <div class="w-full p-4 bg-gray-100 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <template v-if="isAuthenticated">
              <span class="text-gray-700 dark:text-gray-300">
                Welcome, {{ user?.given_name || user?.email }}
              </span>
            </template>
            <template v-else>
              <span class="text-gray-700 dark:text-gray-300"
                >Not logged in</span
              >
            </template>
          </div>
          <div class="flex space-x-2">
            <template v-if="isAuthenticated">
              <button
                @click="handleLogout"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <button
                @click="handleLogin"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
              <button
                @click="handleRegister"
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Register
              </button>
            </template>
          </div>
        </div>
        <!-- Error Message -->
        <div v-if="error" class="mt-2 p-2 bg-red-100 text-red-700 rounded">
          {{ error }}
        </div>
      </div>

      <HomeHeader />
      <MenuContainer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HomeHeader from '../components/menu/HomeHeader.vue'
import MenuContainer from '../components/menu/MenuContainer.vue'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { user, isAuthenticated, error, login, register, logout, checkAuth } =
  useAuth()

const handleLogin = async () => {
  try {
    await login()
  } catch (err) {
    console.error('Login failed:', err)
  }
}

const handleRegister = async () => {
  try {
    await register()
  } catch (err) {
    console.error('Registration failed:', err)
  }
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/')
  } catch (err) {
    console.error('Logout failed:', err)
  }
}

onMounted(async () => {
  await checkAuth()
  if (isAuthenticated.value && route.query.redirect) {
    router.push(route.query.redirect as string)
  }
})
</script>

<style scoped></style>
