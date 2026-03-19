/**
 * API Endpoints
 * 
 * All endpoint paths in one place.
 * When the backend is ready, update paths here.
 */

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  // Clients
  CLIENTS: {
    LIST: '/clients',
    DETAIL: (id: number) => `/clients/${id}`,
    CREATE: '/clients',
    UPDATE: (id: number) => `/clients/${id}`,
    DELETE: (id: number) => `/clients/${id}`,
    PURCHASES: (id: number) => `/clients/${id}/purchases`,
    IMPORT: '/clients/import',
    EXPORT: '/clients/export',
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
