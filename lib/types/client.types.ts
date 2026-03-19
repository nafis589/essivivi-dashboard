/**
 * Domain types — Clients module
 * 
 * SINGLE SOURCE OF TRUTH for all client-related types.
 * To swap mock data with a real API, update lib/services/clients.service.ts only.
 * These types remain the contract between frontend and backend.
 */

// ─── Client Status ──────────────────────────────────────────────────────────────

export type ClientStatus = 'actif' | 'inactif' | 'nouveau'

// ─── Client Entity ──────────────────────────────────────────────────────────────

export interface Client {
  id: number
  name: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  totalPurchases: number
  totalSpent: number
  lastPurchaseDate?: Date
  createdAt: Date
  /** Derived from activity, may also be returned by API */
  status?: ClientStatus
}

// ─── Client Form ────────────────────────────────────────────────────────────────

export interface ClientFormData {
  name: string
  phone?: string
  email?: string
  address?: string
  notes?: string
}

// ─── Client Filters ─────────────────────────────────────────────────────────────

export type ClientFilterType = 'all' | 'recent' | 'inactive' | 'best'

// ─── Purchase History ───────────────────────────────────────────────────────────

export type ClientPaymentMethod = 'carte' | 'especes' | 'virement' | 'mobile_money'

export interface PurchaseHistoryItem {
  id: string
  date: Date
  amount: number
  paymentMethod: ClientPaymentMethod
  itemsCount: number
}
