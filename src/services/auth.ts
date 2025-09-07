import createKindeClient from '@kinde-oss/kinde-auth-pkce-js'
import type {
  KindeUser,
  KindePermission,
  KindePermissions,
  KindeOrganization,
  KindeUserOrganizations
} from '../types/auth'

const initializeKindeClient = async () => {
  try {
    return await createKindeClient({
      client_id: import.meta.env.VITE_KINDE_CLIENT_ID,
      domain: import.meta.env.VITE_KINDE_DOMAIN,
      redirect_uri: window.location.origin,
      logout_uri: window.location.origin,
      scope: 'openid profile email offline',
      on_redirect_callback: (
        user: KindeUser,
        appState?: Record<string, unknown>
      ) => {
        if (appState?.redirectTo) {
          localStorage.setItem('auth_redirect', appState.redirectTo as string)
        }
      }
    })
  } catch (error) {
    console.error('Failed to initialize Kinde client:', error)
    throw error
  }
}

const kinde = await initializeKindeClient()

// Auth service methods
export const authService = {
  login: async (redirectTo: string = '/admin/orders') => {
    try {
      localStorage.setItem('auth_redirect', redirectTo)
      await kinde.login({
        app_state: {
          redirectTo
        }
      })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  register: async () => {
    try {
      await kinde.register()
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem('auth_redirect')
      await kinde.logout()
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  },

  getUser: async (): Promise<KindeUser | null> => {
    try {
      const user = await kinde.getUser()
      return user
    } catch (error) {
      console.error('Get user failed:', error)
      return null
    }
  },

  getToken: async (): Promise<string | undefined> => {
    try {
      const token = await kinde.getToken()
      return token
    } catch (error) {
      console.error('Get token failed:', error)
      return undefined
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await kinde.getToken()
      return !!token
    } catch (error) {
      console.error('Auth check failed:', error)
      return false
    }
  },

  getUserOrganizations: async (): Promise<KindeUserOrganizations | null> => {
    try {
      return await kinde.getUserOrganizations()
    } catch (error) {
      console.error('Get organizations failed:', error)
      return null
    }
  },

  getOrganization: async (): Promise<KindeOrganization | null> => {
    try {
      return await kinde.getOrganization()
    } catch (error) {
      console.error('Get organization failed:', error)
      return null
    }
  },

  getPermissions: async (): Promise<KindePermissions | null> => {
    try {
      return await kinde.getPermissions()
    } catch (error) {
      console.error('Get permissions failed:', error)
      return null
    }
  },

  getPermission: async (
    permission: string
  ): Promise<KindePermission | null> => {
    try {
      return await kinde.getPermission(permission)
    } catch (error) {
      console.error('Get permission failed:', error)
      return null
    }
  },

  getStoredRedirect: (): string | null => {
    return localStorage.getItem('auth_redirect')
  },

  clearStoredRedirect: (): void => {
    localStorage.removeItem('auth_redirect')
  }
}

export default authService
