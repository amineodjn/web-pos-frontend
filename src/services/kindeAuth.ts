import createKindeClient from '@kinde-oss/kinde-auth-pkce-js'
import type {
  ClaimTokenKey,
  User,
  Organization,
  PermissionResponse,
  LoginOptions
} from '@/types/auth'

const kindeClient = async () => {
  try {
    return await createKindeClient({
      client_id: import.meta.env.VITE_KINDE_CLIENT_ID,
      domain: import.meta.env.VITE_KINDE_DOMAIN,
      redirect_uri: import.meta.env.VITE_KINDE_REDIRECT_URL,
      logout_uri: import.meta.env.VITE_KINDE_LOGOUT_URL,
      on_redirect_callback: (user: User, appState: any) => {
        if (appState?.redirectTo) {
          window.location.href = appState.redirectTo
        }
      }
    })
  } catch (error) {
    console.error('Failed to initialize Kinde client', error)
    throw error
  }
}

let kindeClientInstance: Awaited<ReturnType<typeof createKindeClient>> | null =
  null

/**
 * Get or initialize the Kinde client instance
 */
export const getKindeClient = async () => {
  if (!kindeClientInstance) {
    kindeClientInstance = await kindeClient()
  }
  return kindeClientInstance
}

/**
 * Login with Kinde
 * @param options Additional login options
 */
export const login = async (options: LoginOptions = {}) => {
  const kinde = await getKindeClient()
  const redirectTo = options.app_state?.redirectTo || '/admin/orders'

  return kinde.login({
    ...options,
    app_state: {
      ...(options.app_state || {}),
      redirectTo
    }
  })
}

/**
 * Register with Kinde
 * @param options Additional register options
 */
export const register = async (options = {}) => {
  const kinde = await getKindeClient()
  return kinde.register(options)
}

/**
 * Logout from Kinde
 */
export const logout = async () => {
  const kinde = await getKindeClient()
  return kinde.logout()
}

/**
 * Get the authenticated user
 */
export const getUser = async (): Promise<User> => {
  const kinde = await getKindeClient()
  return kinde.getUser()
}

/**
 * Get a claim from the token
 * @param claim The claim to get
 * @param tokenType The token type (access_token or id_token)
 */
export const getClaim = async (
  claim: string,
  tokenType: ClaimTokenKey = 'access_token'
) => {
  const kinde = await getKindeClient()
  return kinde.getClaim(claim, tokenType)
}

/**
 * Get the user's permissions
 */
export const getPermissions = async (): Promise<PermissionResponse> => {
  const kinde = await getKindeClient()
  return kinde.getPermissions()
}

/**
 * Check if the user has a specific permission
 * @param permission The permission to check
 */
export const hasPermission = async (permission: string) => {
  const kinde = await getKindeClient()
  const permissionObj = await kinde.getPermission(permission)
  return permissionObj?.isGranted || false
}

/**
 * Get the organization
 */
export const getOrganization = async (): Promise<Organization> => {
  const kinde = await getKindeClient()
  return kinde.getOrganization()
}

/**
 * Creates a new organization
 */
export const createOrg = async () => {
  const kinde = await getKindeClient()
  return kinde.createOrg()
}

/**
 * Check if the user is authenticated
 */
export const isAuthenticated = async () => {
  try {
    const kinde = await getKindeClient()
    const user = await kinde.getUser()
    return !!user?.id
  } catch (error) {
    console.error('Error checking authentication status', error)
    return false
  }
}
