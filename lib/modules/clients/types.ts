/**
 * Types — Module Clients
 *
 * Aligné sur la documentation API `/api/customers`.
 * Tous les champs correspondent exactement à la réponse du backend.
 */

// ─── Client Status (backend renvoie en anglais) ──────────────────────────────
export type ClientStatus = 'new' | 'active' | 'inactive'

// ─── Client Entity (GET /api/customers, GET /api/customers/:id) ──────────────
export interface Client {
  id: number
  userId: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  notes: string | null
  totalPurchases: number
  totalSpent: number            // en FCFA
  lastPurchaseAt: string | null // ISO date string
  createdAt: string             // ISO date string
  updatedAt: string             // ISO date string
}

// ─── Client Form (POST /api/customers, PUT /api/customers/:id) ───────────────
export interface ClientFormData {
  name: string
  phone?: string
  email?: string
  address?: string
  notes?: string
}

// ─── Pagination (réponse paginée de GET /api/customers) ──────────────────────
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

// ─── Client List API Response ────────────────────────────────────────────────
export interface ClientsListResponse {
  success: boolean
  data: {
    customers: Client[]
    pagination: PaginationInfo
  }
}

// ─── Single Client API Response ──────────────────────────────────────────────
export interface ClientResponse {
  success: boolean
  data: Client
  message?: string
}

// ─── Client Stats (GET /api/customers/:id/stats) ─────────────────────────────
export interface ClientStats {
  totalSpent: number
  totalPurchases: number
  averageOrder: number
  lastPurchaseAt: string | null
}

export interface ClientStatsResponse {
  success: boolean
  data: ClientStats
}

// ─── Client Sales (GET /api/customers/:id/sales) ─────────────────────────────
export interface ClientSale {
  id: number
  total: number               // en FCFA
  createdAt: string           // ISO date string
  itemsCount: number
}

export interface ClientSalesResponse {
  success: boolean
  data: ClientSale[]
}

// ─── Client Full (GET /api/customers/:id/full) ───────────────────────────────
export interface ClientFullData {
  customer: Omit<Client, 'totalPurchases' | 'totalSpent' | 'lastPurchaseAt'>
  stats: ClientStats
  recentSales: ClientSale[]
  status: ClientStatus
}

export interface ClientFullResponse {
  success: boolean
  data: ClientFullData
}

// ─── Segmentation Responses ──────────────────────────────────────────────────
export interface ClientSegmentResponse {
  success: boolean
  data: Client[]
  count: number
}

// ─── Filters ─────────────────────────────────────────────────────────────────
export type ClientFilterType = 'all' | 'recent' | 'inactive' | 'best'

// ─── Query Params for listing ────────────────────────────────────────────────
export type ClientSortBy = 'name' | 'email' | 'totalPurchases' | 'totalSpent' | 'lastPurchaseAt' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export interface ClientsListParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: ClientSortBy
  sortOrder?: SortOrder
}
