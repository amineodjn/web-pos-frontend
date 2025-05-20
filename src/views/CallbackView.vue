<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Processing authentication...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getKindeClient } from '@/services/kindeAuth'

const router = useRouter()

onMounted(async () => {
  try {
    const kinde = await getKindeClient()
    const user = await kinde.getUser()

    if (user && user.id) {
      // Redirect to admin orders page after successful authentication
      router.replace('/admin/orders')
    } else {
      // If authentication failed, redirect to home
      router.replace('/')
    }
  } catch (error) {
    console.error('Authentication callback error:', error)
    router.replace('/')
  }
})
</script>
