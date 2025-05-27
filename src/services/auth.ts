import createKindeClient from '@kinde-oss/kinde-auth-pkce-js'
import type { KindeUser } from '@kinde-oss/kinde-auth-pkce-js'

interface AppState {
  redirectTo?: string
}

interface User {
  id: string
  email: string
  given_name?: string
  family_name?: string
}

// Initialize Kinde client
const kinde = await createKindeClient({
  client_id: import.meta.env.VITE_KINDE_CLIENT_ID,
  domain: import.meta.env.VITE_KINDE_DOMAIN,
  redirect_uri: window.location.origin,
  logout_uri: window.location.origin,
  on_redirect_callback: (
    user: KindeUser,
    appState?: Record<string, unknown>
  ) => {
    if (appState?.redirectTo) {
      window.location.href = appState.redirectTo as string
    }
  }
})

// Auth service methods
export const authService = {
  // Login
  login: async () => {
    await kinde.login()
  },

  // Register
  register: async () => {
    await kinde.register()
  },

  // Logout
  logout: async () => {
    await kinde.logout()
  },

  // Get user profile
  getUser: async () => {
    return await kinde.getUser()
  },

  // Get access token
  getToken: async () => {
    return await kinde.getToken()
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    return await kinde.isAuthenticated()
  },

  // Get user organizations
  getUserOrganizations: async () => {
    return await kinde.getUserOrganizations()
  },

  // Get current organization
  getOrganization: async () => {
    return await kinde.getOrganization()
  },

  // Get user permissions
  getPermissions: async () => {
    return await kinde.getPermissions()
  },

  // Check specific permission
  getPermission: async (permission: string) => {
    return await kinde.getPermission(permission)
  }
}

export default authService
