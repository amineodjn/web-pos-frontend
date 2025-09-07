import { ref, computed } from 'vue'
import type {
  KindeUser,
  KindePermissions,
  KindeUserOrganizations,
  KindeOrganization
} from '../types/auth'
import authService from '../services/auth'
import { useAuthStore } from '@/stores/auth'

const user = ref<KindeUser | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const permissions = ref<KindePermissions | null>(null)
const organizations = ref<KindeUserOrganizations | null>(null)
const currentOrganization = ref<KindeOrganization | null>(null)

export function useAuth() {
  const authStore = useAuthStore()
  const isAuthenticated = computed(() => user.value !== null)

  const checkAuth = async (): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    authStore.setLoading(true)
    authStore.setError(null)
    try {
      const authenticated = await authService.isAuthenticated()
      if (authenticated) {
        const u = await authService.getUser()
        user.value = u
        authStore.setAuthState({ user: u, isAuthenticated: true })
        return true
      } else {
        user.value = null
        authStore.setAuthState({ user: null, isAuthenticated: false })
        return false
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Authentication check failed'
      authStore.setError(error.value)
      user.value = null
      authStore.setAuthState({ user: null, isAuthenticated: false })
      return false
    } finally {
      isLoading.value = false
      authStore.setLoading(false)
    }
  }

  const login = async (redirectTo?: string) => {
    error.value = null
    authStore.setError(null)
    try {
      await authService.login(redirectTo)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      authStore.setError(error.value)
      throw err
    }
  }

  const logout = async () => {
    error.value = null
    authStore.setError(null)
    try {
      await authService.logout()
      user.value = null
      permissions.value = null
      organizations.value = null
      currentOrganization.value = null
      authStore.clear()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed'
      authStore.setError(error.value)
      throw err
    }
  }

  const getToken = async (): Promise<string | undefined> => {
    try {
      return await authService.getToken()
    } catch (err) {
      error.value = 'Failed to get token'
      return undefined
    }
  }

  const initializeAuth = async (): Promise<boolean> => {
    const isAuth = await checkAuth()
    if (isAuth) {
      await Promise.all([loadPermissions(), loadOrganizations()])
    }
    return isAuth
  }

  const loadPermissions = async () => {
    try {
      permissions.value = await authService.getPermissions()
    } catch (err) {
      error.value = 'Failed to load permissions'
    }
  }

  const loadOrganizations = async () => {
    try {
      organizations.value = await authService.getUserOrganizations()
      currentOrganization.value = await authService.getOrganization()
    } catch (err) {
      error.value = 'Failed to load organizations'
    }
  }

  const getStoredRedirect = (): string | null => {
    return authService.getStoredRedirect()
  }

  const clearStoredRedirect = (): void => {
    authService.clearStoredRedirect()
  }

  const register = async () => {
    error.value = null
    authStore.setError(null)
    try {
      await authService.register()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      authStore.setError(error.value)
      throw err
    }
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    permissions: computed(() => permissions.value),
    organizations: computed(() => organizations.value),
    currentOrganization: computed(() => currentOrganization.value),
    checkAuth,
    login,
    register,
    logout,
    getToken,
    initializeAuth,
    loadPermissions,
    loadOrganizations,
    getStoredRedirect,
    clearStoredRedirect
  }
}
