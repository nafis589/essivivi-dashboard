/**
 * Domain types — POS (Point of Sale) module
 * 
 * POS-specific types that reuse shared Product and PaymentMethod types.
 */

import type { Product } from './product.types'
import type { PaymentMethod } from './sale.types'

// ─── POS Customer (simplified for POS view) ────────────────────────────────────

export interface POSCustomer {
  id: number
  name: string
  phone?: string
  email?: string
  points?: number
}

// ─── Cart ───────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

// ─── Sale Record (created at checkout) ──────────────────────────────────────────

export interface SaleRecord {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  customerId?: number
  paymentMethod: PaymentMethod
  createdAt: Date
  receiptNumber: string
  isOffline?: boolean
}
