<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md">
      <h1 class="mb-6 text-2xl font-bold text-gray-800">Your Profile</h1>

      <div v-if="isLoading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
        ></div>
      </div>

      <div v-else-if="user" class="space-y-6">
        <div class="flex items-center space-x-4">
          <div
            v-if="user.picture"
            class="h-20 w-20 overflow-hidden rounded-full"
          >
            <img
              :src="user.picture"
              alt="Profile picture"
              class="h-full w-full object-cover"
            />
          </div>
          <div
            v-else
            class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-600"
          >
            {{ user.given_name?.[0] || user.email?.[0] || '?' }}
          </div>

          <div>
            <h2 class="text-xl font-semibold">{{ fullName || 'User' }}</h2>
            <p class="text-gray-600">{{ user.email }}</p>
          </div>
        </div>

        <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 class="mb-2 font-medium text-gray-700">Your Account Details</h3>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            <div>
              <dt class="text-sm text-gray-500">User ID</dt>
              <dd class="text-gray-700">{{ user.id }}</dd>
            </div>
            <div v-if="organization">
              <dt class="text-sm text-gray-500">Organization</dt>
              <dd class="text-gray-700">{{ organization.orgCode }}</dd>
            </div>
          </dl>
        </div>

        <div
          v-if="permissions.length > 0"
          class="rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <h3 class="mb-2 font-medium text-gray-700">Your Permissions</h3>
          <ul class="list-inside list-disc space-y-1 pl-2">
            <li
              v-for="permission in permissions"
              :key="permission"
              class="text-gray-700"
            >
              {{ permission }}
            </li>
          </ul>
        </div>

        <div class="flex justify-end">
          <button
            @click="handleLogout"
            @keydown="e => e.key === 'Enter' && handleLogout()"
            class="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            tabindex="0"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      </div>

      <div v-else class="py-10 text-center">
        <p class="text-gray-600">You are not signed in.</p>
        <button
          @click="handleLogin"
          @keydown="e => e.key === 'Enter' && handleLogin()"
          class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          tabindex="0"
          aria-label="Sign in"
        >
          Sign in
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { login } from '@/services/kindeAuth'

const router = useRouter()
const {
  user,
  isLoading,
  permissions,
  organization,
  fullName,
  isAuthenticated,
  loadUser,
  logout
} = useAuth()

onMounted(async () => {
  if (!isAuthenticated.value) {
    await loadUser()
  }
})

const handleLogin = async () => {
  try {
    await login({
      app_state: {
        redirectTo: '/profile'
      }
    })
  } catch (err) {
    console.error('Login error:', err)
  }
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/')
  } catch (err) {
    console.error('Logout error:', err)
  }
}
</script>
