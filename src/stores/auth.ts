import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as kindeAuth from '@/services/kindeAuth'
import type { User, Organization, LoginOptions } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  const permissions = ref<string[]>([])
  const organization = ref<Organization | null>(null)

  const isAuthenticated = computed(() => !!user.value?.id)
  const fullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.given_name || ''} ${user.value.family_name || ''}`.trim()
  })

  const loadUserProfile = async () => {
    try {
      isLoading.value = true
      error.value = null

      const authenticated = await kindeAuth.isAuthenticated()

      if (authenticated) {
        const userData = await kindeAuth.getUser()
        user.value = userData

        const userPermissions = await kindeAuth.getPermissions()
        permissions.value = userPermissions?.permissions || []

        const userOrg = await kindeAuth.getOrganization()
        organization.value = userOrg
      } else {
        user.value = null
        permissions.value = []
        organization.value = null
      }
    } catch (err) {
      error.value = 'Failed to load user profile'
      console.error('Error loading user profile:', err)
    } finally {
      isLoading.value = false
    }
  }

  const login = async (options: LoginOptions = {}) => {
    await kindeAuth.login(options)
  }

  const register = async () => {
    await kindeAuth.register()
  }

  const logout = async () => {
    try {
      await kindeAuth.logout()
      user.value = null
      permissions.value = []
      organization.value = null
    } catch (err) {
      error.value = 'Failed to logout'
      console.error('Error during logout:', err)
    }
  }

  const hasPermission = (permission: string) => {
    return permissions.value.includes(permission)
  }

  const createOrganization = async () => {
    await kindeAuth.createOrg()
  }

  return {
    user,
    isLoading,
    error,
    permissions,
    organization,

    isAuthenticated,
    fullName,

    loadUserProfile,
    login,
    register,
    logout,
    hasPermission,
    createOrganization
  }
})
