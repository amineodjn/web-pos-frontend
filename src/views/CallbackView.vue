<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div
        v-if="isProcessing"
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"
      ></div>
      <div v-else-if="error" class="text-red-600">
        <p>Authentication failed. Redirecting...</p>
      </div>
      <p class="mt-4 text-gray-600">{{ statusMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getKindeClient } from '@/services/kindeAuth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isProcessing = ref(true)
const error = ref(false)
const statusMessage = ref('Processing authentication...')

onMounted(async () => {
  try {
    statusMessage.value = 'Verifying authentication...'

    // Handle the callback and get the client
    const kinde = await getKindeClient()

    // Wait a moment for token processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if we're authenticated and get user data
    const user = await kinde.getUser()

    if (user && user.id) {
      statusMessage.value = 'Authentication successful. Loading profile...'

      // Load the user profile in the store
      await authStore.loadUserProfile()

      statusMessage.value = 'Redirecting...'

      // Get the redirect URL from session storage or default to admin orders
      const redirectTo =
        sessionStorage.getItem('auth_redirect_to') || '/admin/orders'
      sessionStorage.removeItem('auth_redirect_to')

      // Use replace to prevent going back to callback
      router.replace(redirectTo)
    } else {
      throw new Error('No user data received')
    }
  } catch (err) {
    console.error('Authentication callback error:', err)
    error.value = true
    statusMessage.value = 'Authentication failed. Redirecting to home...'

    // Clear any stored auth data
    sessionStorage.removeItem('auth_redirect_to')

    // Redirect to home after a delay
    setTimeout(() => {
      router.replace('/')
    }, 2000)
  } finally {
    isProcessing.value = false
  }
})
</script>
