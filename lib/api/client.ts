/**
 * API Client
 *
 * Centralized HTTP client for all API calls.
 * Sends the JWT token (stored in localStorage as "fc_token") via the
 * Authorization header AND includes cookies via `credentials: 'include'`.
 */

// ─── Configuration ──────────────────────────────────────────────────────────────

const API_BASE_URL = "http://localhost:3001/api"
const API_TIMEOUT = 10000 // 10 seconds

// ─── Types ──────────────────────────────────────────────────────────────────────

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  timeout?: number
}

export interface ApiClientError {
  message: string
  statusCode: number
  code: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  let url = `${API_BASE_URL}${path}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value))
      }
    })
    const qs = searchParams.toString()
    if (qs) url += `?${qs}`
  }

  return url
}

/**
 * Reads the JWT token stored under "fc_token" in localStorage.
 * Returns an Authorization header object, or empty if no token is found.
 */
function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("fc_token") : null

  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── API Client ─────────────────────────────────────────────────────────────────

class ApiClientClass {
  private async request<T>(
    path: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, timeout = API_TIMEOUT, ...fetchConfig } = config

    const url = buildUrl(path, params)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        // credentials AFTER the spread so it cannot be accidentally overridden
        credentials: "include",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
          ...(fetchConfig.headers as Record<string, string>),
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

        // Auto-logout on 401 (session expired / invalid token)
        if (response.status === 401) {
          console.warn("[ApiClient] 401 Unauthorized — token may be invalid or expired.")
        }

        throw error
      }

      // Handle empty responses (204 No Content, etc.)
      const contentType = response.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        return response.json()
      }

      return {} as T
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof DOMException && error.name === "AbortError") {
        throw {
          message: "Request timeout",
          statusCode: 408,
          code: "TIMEOUT",
        } as ApiClientError
      }

      throw error
    }
  }

  async get<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: "GET" })
  }

  async post<T>(
    path: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(
    path: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(
    path: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: "DELETE" })
  }
}

// Export singleton instance
export const apiClient = new ApiClientClass()
