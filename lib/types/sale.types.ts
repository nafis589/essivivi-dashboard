/**
 * Domain types — Sales module
 * 
 * SINGLE SOURCE OF TRUTH for all sale-related types.
 */

// ─── Sale Status ────────────────────────────────────────────────────────────────

export type SaleStatus = 'paid' | 'refunded' | 'pending' | 'partially_refunded'

// ─── Payment ────────────────────────────────────────────────────────────────────

export type PaymentMethod = 'cash' | 'mobile' | 'card'

// ─── Sale Customer (embedded reference) ─────────────────────────────────────────

export interface SaleCustomer {
  id: string
  name: string
  phone?: string
  email?: string
}

// ─── Sale Item ──────────────────────────────────────────────────────────────────

export interface SaleItem {
  id: string
  productId: string
  name: string
  quantity: number
  unitPrice: number
  total: number
  refundedQuantity: number
}

// ─── Sale Entity ────────────────────────────────────────────────────────────────

export interface Sale {
  id: string
  invoiceNumber: string
  date: string // ISO string
  customer: SaleCustomer | null
  items: SaleItem[]
  subtotal: number
  taxes: number
  total: number
  paymentMethod: PaymentMethod
  status: SaleStatus
  refundReason?: string
}

// ─── Sale Filters ───────────────────────────────────────────────────────────────

export interface SalesFilterOptions {
  dateRange: 'today' | 'this_week' | 'this_month' | 'custom'
  customDateRange?: { start: Date; end: Date }
  paymentMethod?: PaymentMethod | 'all'
  status?: SaleStatus | 'all'
  minAmount?: number
  maxAmount?: number
  searchQuery: string
}

// ─── Sales Stats ────────────────────────────────────────────────────────────────

export interface SalesStats {
  totalSalesCount: number
  totalRevenue: number
  todaySalesCount: number
  averageSaleAmount: number
}
