/**
 * Generic API types
 * 
 * These types define the contract for all API interactions.
 * Used by services and hooks.
 */

// ─── Pagination ─────────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ─── API Response Wrapper ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
  details?: Record<string, string[]>
}

// ─── Filtering & Sorting ────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc'

export interface SortParams {
  field: string
  direction: SortDirection
}

export interface DateRangeFilter {
  start: Date
  end: Date
}

// ─── Async State ────────────────────────────────────────────────────────────────

export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

export interface AsyncListState<T> extends AsyncState<T[]> {
  data: T[]
}
