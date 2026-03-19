/**
 * Domain types — Products module
 * 
 * SINGLE SOURCE OF TRUTH for all product-related types.
 */

// ─── Product Entity ─────────────────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  price: number
  stock: number
  lowStockThreshold: number
  category: string
  barcode: string
  imageUrl: string
  popular?: boolean
  unit?: string // "pièce" | "kg" | "litre" etc.
  brand?: string
  description?: string
  status?: ProductStatus
}

export type ProductStatus = 'active' | 'inactive'
export type StockStatus = 'ok' | 'low' | 'out'

export function getStockStatus(product: Product): StockStatus {
  if (product.stock === 0) return 'out'
  if (product.stock <= product.lowStockThreshold) return 'low'
  return 'ok'
}

// ─── Product Form ───────────────────────────────────────────────────────────────

export interface ProductFormData {
  name: string
  price: number
  stock: number
  lowStockThreshold: number
  category: string
  barcode: string
  imageUrl: string
  popular?: boolean
  unit?: string
  brand?: string
  description?: string
}
