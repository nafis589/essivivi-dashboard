/**
 * Service API — Module POS (Point de Vente)
 *
 * Connecte le POS aux endpoints backend :
 * - GET  /api/products          → catalogue produits
 * - GET  /api/customers         → recherche clients
 * - POST /api/customers         → créer un client rapide
 * - POST /api/sales             → enregistrer une vente
 */

import { apiClient } from '@/lib/api/client'
import type { Product } from '@/lib/types/product.types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type POSPaymentMethod = 'CASH' | 'CARD' | 'MOBILE_MONEY'

export interface POSCustomer {
  id: number
  name: string
  phone?: string | null
  email?: string | null
  totalPurchases?: number
  totalSpent?: number
}

export interface POSCartItem {
  productId: number
  quantity: number
}

export interface CreateSalePayload {
  customerId?: number | null
  items: POSCartItem[]
  paymentMethod: POSPaymentMethod
}

export interface SaleItemResult {
  id: number
  productId: number
  name: string
  quantity: number
  price: number
  costPrice: number
  total: number
}

export interface SalePaymentResult {
  id: number
  method: POSPaymentMethod
  amount: number
}

export interface CreatedSale {
  id: number
  invoiceNumber: string
  subtotal: number
  tax: number
  total: number
  status: string
  createdAt: string
  customer: {
    id: number
    name: string
    phone: string | null
    email: string | null
  } | null
  items: SaleItemResult[]
  payments: SalePaymentResult[]
}

export interface CreateSaleResponse {
  success: boolean
  data: CreatedSale
  message: string
}

// Products list response
export interface ProductsListResponse {
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

// Customers search response
export interface CustomersSearchResponse {
  success: boolean
  data: {
    customers: POSCustomer[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface CreateCustomerResponse {
  success: boolean
  data: POSCustomer
  message: string
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Charger les produits actifs pour le catalogue POS.
 * GET /api/products
 */
export async function fetchPOSProducts(params?: {
  search?: string
  page?: number
  limit?: number
}): Promise<ProductsListResponse> {
  return apiClient.get<ProductsListResponse>('/products', {
    params: {
      limit: 100,
      active: true,
      ...params,
    } as Record<string, string | number | boolean | undefined>,
  })
}

/**
 * Rechercher des clients pour l'association à une vente.
 * GET /api/customers
 */
export async function searchPOSCustomers(params?: {
  search?: string
  page?: number
  limit?: number
}): Promise<CustomersSearchResponse> {
  return apiClient.get<CustomersSearchResponse>('/customers', {
    params: {
      limit: 20,
      ...params,
    } as Record<string, string | number | boolean | undefined>,
  })
}

/**
 * Créer un client rapide depuis le POS.
 * POST /api/customers
 */
export async function createPOSCustomer(data: {
  name: string
  phone?: string
  email?: string
}): Promise<CreateCustomerResponse> {
  return apiClient.post<CreateCustomerResponse>('/customers', data)
}

/**
 * Enregistrer une vente (transactionnel côté backend).
 * POST /api/sales
 */
export async function createPOSSale(payload: CreateSalePayload): Promise<CreateSaleResponse> {
  return apiClient.post<CreateSaleResponse>('/sales', payload)
}
