/**
 * API Endpoints
 * 
 * All endpoint paths in one place.
 * Aligned with customers_api_documentation.md
 */

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  // Clients (aligned with /api/customers doc)
  CLIENTS: {
    LIST: '/customers',
    CREATE: '/customers',
    DETAIL: (id: number) => `/customers/${id}`,
    UPDATE: (id: number) => `/customers/${id}`,
    DELETE: (id: number) => `/customers/${id}`,
    SALES: (id: number) => `/customers/${id}/sales`,
    STATS: (id: number) => `/customers/${id}/stats`,
    FULL: (id: number) => `/customers/${id}/full`,
    TOP: '/customers/top',
    INACTIVE: '/customers/inactive',
    NEW: '/customers/new',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },

  // Sales
  SALES: {
    LIST: '/sales',
    DETAIL: (id: string) => `/sales/${id}`,
    CREATE: '/sales',
    REFUND: (id: string) => `/sales/${id}/refund`,
    EXPORT: '/sales/export',
    STATS: '/sales/stats',
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_SALES: '/dashboard/recent-sales',
    TOP_PRODUCTS: '/dashboard/top-products',
  },

  // POS
  POS: {
    CHECKOUT: '/pos/checkout',
    SYNC_OFFLINE: '/pos/sync-offline',
  },
} as const
