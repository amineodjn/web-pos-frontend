import type { KindeUser } from '@kinde-oss/kinde-auth-pkce-js'

export type { KindeUser }

export interface KindePermission {
  orgCode: string
  isGranted: boolean
}

export interface KindePermissions {
  orgCode: string
  permissions: string[]
}

export interface KindeOrganization {
  orgCode: string
}

export interface KindeUserOrganizations {
  orgCodes: string[]
}

export interface KindeToken {
  access_token: string
  expires_in?: number
  token_type?: string
  refresh_token?: string
  id_token?: string
  scope?: string
}

export type AuthUser = KindeUser

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthError {
  message: string
  code?: string
  details?: unknown
}

export interface LoginOptions {
  redirectTo?: string
  orgCode?: string
}

export interface OrganizationContext {
  orgCode: string
  name?: string
  isActive: boolean
}
