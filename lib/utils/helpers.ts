/**
 * Misc helper utilities
 */

import type { Client } from '@/lib/types/client.types'
import type { Sale } from '@/lib/types/sale.types'
import { format } from 'date-fns'

// ─── Client Helpers ─────────────────────────────────────────────────────────────

/**
 * Derive client status from their purchase history.
 */
export function getClientStatus(client: Client): 'inactif' | 'nouveau' | 'actif' {
  const now = new Date()

  if (!client.lastPurchaseDate) {
    return 'nouveau'
  }

  const diffTime = Math.abs(now.getTime() - client.lastPurchaseDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays > 90) {
    return 'inactif'
  }

  if (client.totalPurchases > 0) {
    return 'actif'
  }

  return 'nouveau'
}

// ─── Sales Helpers ──────────────────────────────────────────────────────────────

/**
 * Calculate aggregate stats from a list of sales.
 */
export function calculateSalesStats(sales: Sale[]) {
  const now = new Date()
  const today = format(now, 'yyyy-MM-dd')

  const todaySales = sales.filter(
    s => format(new Date(s.date), 'yyyy-MM-dd') === today
  )

  const totalRevenue = sales
    .filter(s => s.status === 'paid' || s.status === 'partially_refunded')
    .reduce((acc, sale) => acc + sale.total, 0)

  return {
    totalSalesCount: sales.length,
    totalRevenue,
    todaySalesCount: todaySales.length,
    averageSaleAmount: sales.length > 0 ? totalRevenue / sales.length : 0,
  }
}

// ─── Export CSV ──────────────────────────────────────────────────────────────────

/**
 * Generic CSV export utility.
 */
export function downloadCSV(
  headers: string[],
  rows: string[][],
  filename: string
): void {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    headers.join(',') +
    '\n' +
    rows.map(r => r.join(',')).join('\n')

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ─── Delay ──────────────────────────────────────────────────────────────────────

/**
 * Simulate API latency for mock services.
 */
export function delay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── ID Generation ──────────────────────────────────────────────────────────────

/**
 * Generate a simple unique ID.
 */
export function generateId(): string {
  return crypto.randomUUID()
}
