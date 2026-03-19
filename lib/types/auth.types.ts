/**
 * Domain types — Authentication & User
 * 
 * SINGLE SOURCE OF TRUTH for user-related types.
 * Replaces the scattered User type from navigation.types.ts
 */

// ─── User Entity ────────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  company?: string
  role?: UserRole
}

export type UserRole = 'owner' | 'manager' | 'cashier'

// ─── Auth State ─────────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token?: string
}

// ─── Login/Register ─────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  company?: string
}
