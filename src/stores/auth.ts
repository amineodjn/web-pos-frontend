import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthUser } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const setAuthState = (payload: {
    user: AuthUser | null
    isAuthenticated: boolean
  }) => {
    user.value = payload.user
    isAuthenticated.value = payload.isAuthenticated
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (err: string | null) => {
    error.value = err
  }

  const clear = () => {
    user.value = null
    isAuthenticated.value = false
    isLoading.value = false
    error.value = null
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    setAuthState,
    setLoading,
    setError,
    clear
  }
})
