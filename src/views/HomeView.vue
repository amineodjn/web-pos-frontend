<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div
      class="relative bg-white dark:bg-dark-bg lg:min-h-screen lg:flex lg:items-center flex-col"
    >
      <!-- Auth Testing Section -->
      <div class="w-full p-4 bg-gray-100 dark:bg-gray-800">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <template v-if="user">
              <span class="text-gray-700 dark:text-gray-300">
                Welcome, {{ user.given_name || user.email }}
              </span>
            </template>
            <template v-else>
              <span class="text-gray-700 dark:text-gray-300"
                >Not logged in</span
              >
            </template>
          </div>
          <div class="flex space-x-2">
            <template v-if="user">
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
import { ref, onMounted } from 'vue'
import type { KindeUser } from '@kinde-oss/kinde-auth-pkce-js'
import HomeHeader from '../components/menu/HomeHeader.vue'
import MenuContainer from '../components/menu/MenuContainer.vue'
import authService from '../services/auth'

const user = ref<KindeUser | null>(null)
const error = ref<string | null>(null)

const checkAuth = async () => {
  try {
    const isAuthenticated = await authService.isAuthenticated()
    if (isAuthenticated) {
      user.value = await authService.getUser()
    } else {
      user.value = null
    }
    error.value = null
  } catch (err) {
    console.error('Auth check failed:', err)
    error.value = 'Failed to check authentication status'
    user.value = null
  }
}

const handleLogin = async () => {
  try {
    error.value = null
    console.log('Starting login process...')
    console.log('Kinde Domain:', import.meta.env.VITE_KINDE_DOMAIN)
    console.log('Client ID:', import.meta.env.VITE_KINDE_CLIENT_ID)
    await authService.login()
  } catch (err) {
    console.error('Login failed:', err)
    error.value = 'Login failed. Please try again.'
  }
}

const handleRegister = async () => {
  try {
    error.value = null
    await authService.register()
  } catch (err) {
    console.error('Registration failed:', err)
    error.value = 'Registration failed. Please try again.'
  }
}

const handleLogout = async () => {
  try {
    error.value = null
    await authService.logout()
    user.value = null
  } catch (err) {
    console.error('Logout failed:', err)
    error.value = 'Logout failed. Please try again.'
  }
}

onMounted(async () => {
  await checkAuth()
})
</script>

<style scoped></style>
