import createKindeClient from '@kinde-oss/kinde-auth-pkce-js'
import type { KindeUser } from '@kinde-oss/kinde-auth-pkce-js'

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
      window.location.href = (window.location.origin +
        appState.redirectTo) as string
    }
  }
})

// Auth service methods
export const authService = {
  // Login
  login: async () => {
    await kinde.login({
      app_state: {
        redirectTo: '/admin/orders'
      }
    })
  },

  register: async () => {
    await kinde.register()
  },

  logout: async () => {
    await kinde.logout()
  },

  getUser: async () => {
    return await kinde.getUser()
  },

  getToken: async () => {
    return await kinde.getToken()
  },

  isAuthenticated: async () => {
    return await kinde.isAuthenticated()
  },

  getUserOrganizations: async () => {
    return await kinde.getUserOrganizations()
  },

  getOrganization: async () => {
    return await kinde.getOrganization()
  },

  getPermissions: async () => {
    return await kinde.getPermissions()
  },

  getPermission: async (permission: string) => {
    return await kinde.getPermission(permission)
  }
}

export default authService
