/**
 * User information from Kinde
 */
export interface User {
  id: string | null
  given_name?: string | null
  family_name?: string | null
  email?: string | null
  picture?: string | null
  [key: string]: string | null | undefined
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
  [key: string]: string | number | boolean | null | undefined
}

/**
 * Permission response from Kinde
 */
export interface PermissionResponse {
  permissions: string[]
  [key: string]: string[] | string | number | boolean | null | undefined
}

/**
 * Login options
 */
export interface LoginOptions {
  app_state?: {
    redirectTo?: string
    [key: string]: string | number | boolean | null | undefined
  }
  [key: string]: unknown
}
