/**
 * User information from Kinde
 */
export interface User {
  id: string | null
  given_name?: string | null
  family_name?: string | null
  email?: string | null
  picture?: string | null
  [key: string]: any
}

/**
 * Authentication token types
 */
export type ClaimTokenKey = 'access_token' | 'id_token'

/**
 * Organization information
 */
export interface Organization {
  orgCode: string
  [key: string]: any
}

/**
 * Permission response from Kinde
 */
export interface PermissionResponse {
  permissions: string[]
  [key: string]: any
}

/**
 * Login options
 */
export interface LoginOptions {
  app_state?: {
    redirectTo?: string
    [key: string]: any
  }
  [key: string]: any
}
