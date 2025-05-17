import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import type { LoginOptions } from '@/types/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const {
    user,
    isLoading,
    error,
    permissions,
    organization,
    isAuthenticated,
    fullName
  } = storeToRefs(authStore)

  const hasPermission = (permission: string): boolean => {
    return permissions.value.includes(permission)
  }

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(permission =>
      permissions.value.includes(permission)
    )
  }

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission =>
      permissions.value.includes(permission)
    )
  }

  const loadUser = async (): Promise<void> => {
    await authStore.loadUserProfile()
  }

  const login = async (options: LoginOptions = {}): Promise<void> => {
    await authStore.login(options)
  }

  const register = async (): Promise<void> => {
    await authStore.register()
  }

  const logout = async (): Promise<void> => {
    await authStore.logout()
  }

  const createOrganization = async (): Promise<void> => {
    await authStore.createOrganization()
  }

  return {
    user,
    isLoading,
    error,
    permissions,
    organization,
    isAuthenticated,
    fullName,

    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    loadUser,
    login,
    register,
    logout,
    createOrganization
  }
}
