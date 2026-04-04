/**
 * Domain types — POS (Point of Sale) module
 *
 * Aligné sur les valeurs attendues par le backend :
 * - PaymentMethod uppercase (CASH, CARD, MOBILE_MONEY)
 * - POSCustomer basé sur GET /api/customers
 * - POSProduct basé sur GET /api/products
 */

// ─── Payment Method (doit correspondre exactement au backend) ─────────────────
export type PaymentMethod = 'CASH' | 'CARD' | 'MOBILE_MONEY'

// ─── POS Customer (tel que retourné par GET /api/customers) ──────────────────
export interface POSCustomer {
  id: number
  name: string
  phone?: string | null
  email?: string | null
  totalPurchases?: number
  totalSpent?: number
}

// ─── POS Product (basé sur GET /api/products) ────────────────────────────────
export interface POSProduct {
  id: number          // L'API retourne un int, pas un string
  name: string
  price: number
  stock: number
  stockAlert: number
  category?: string
  barcode?: string
  imageUrl?: string   // Champ optionnel — peut ne pas exister dans la réponse
  description?: string
  active?: boolean
  metadata?: Record<string, unknown>
  images?: { url: string }[]
}

// ─── Cart Item ────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string          // ID local du panier (string UUID)
  product: POSProduct
  quantity: number
}

// ─── Sale Record (résultat de POST /api/sales) ───────────────────────────────
export interface SaleRecord {
  id: number                    // ID réel de la vente côté backend
  invoiceNumber: string
  items: SaleItemRecord[]
  subtotal: number
  tax: number
  total: number
  customerId?: number | null
  customerName?: string | null
  customerPhone?: string | null
  paymentMethod: PaymentMethod
  createdAt: string
  status: string
}

export interface SaleItemRecord {
  id: number
  productId: number
  name: string
  quantity: number
  price: number
  total: number
}

// ─── Stock helpers ────────────────────────────────────────────────────────────
export type StockStatus = 'ok' | 'low' | 'out'

export function getStockStatus(product: POSProduct): StockStatus {
  if (product.stock === 0) return 'out'
  if (product.stock <= product.stockAlert) return 'low'
  return 'ok'
}
