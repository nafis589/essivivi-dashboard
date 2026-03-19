/**
 * API Client
 * 
 * Centralized HTTP client for all API calls.
 * Currently configured for mock/local use.
 * When backend is ready, just update API_BASE_URL.
 */

// ─── Configuration ──────────────────────────────────────────────────────────────

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
const API_TIMEOUT = 10000 // 10 seconds

// ─── Types ──────────────────────────────────────────────────────────────────────

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  timeout?: number
}

interface ApiClientError {
  message: string
  statusCode: number
  code: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}

function getAuthHeaders(): Record<string, string> {
  // Future: Read token from auth store or cookie
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('auth_token') 
    : null

  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── API Client ─────────────────────────────────────────────────────────────────

class ApiClientClass {
  private async request<T>(path: string, config: RequestConfig = {}): Promise<T> {
    const { params, timeout = API_TIMEOUT, ...fetchConfig } = config

    const url = buildUrl(path, params)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...fetchConfig.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error: ApiClientError = {
          message: `HTTP Error ${response.status}`,
          statusCode: response.status,
          code: `HTTP_${response.status}`,
        }

        // Try to parse error body
        try {
          const body = await response.json()
          error.message = body.message || error.message
          error.code = body.code || error.code
        } catch {
          // Ignore parse error
        }

        throw error
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        return response.json()
      }

      return {} as T
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          statusCode: 408,
          code: 'TIMEOUT',
        } as ApiClientError
      }

      throw error
    }
  }

  async get<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: 'GET' })
  }

  async post<T>(path: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(path: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(path: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: 'DELETE' })
  }
}

// Export singleton instance
export const apiClient = new ApiClientClass()
