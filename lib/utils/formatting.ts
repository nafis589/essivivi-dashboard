/**
 * Formatting utilities
 * 
 * SINGLE SOURCE OF TRUTH for all formatting functions.
 * Consolidates duplicates from ventes/utils.ts and clients/utils.ts.
 */

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// ─── Currency ───────────────────────────────────────────────────────────────────

/**
 * Format a number as currency (EUR by default).
 * Example: formatCurrency(1234.5) → "1 234,50 €"
 */
export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format a number as compact currency.
 * Example: formatCurrencyCompact(1234) → "1,2 k€"
 */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)} M€`
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)} k€`
  }
  return formatCurrency(amount)
}

// ─── Dates ──────────────────────────────────────────────────────────────────────

/**
 * Format a Date object to "dd MMM yyyy" in French.
 * Example: formatDate(date) → "15 mars 2024"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

/**
 * Format a date to "dd/MM/yyyy" in French.
 * Example: formatDateShort(date) → "15/03/2024"
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd/MM/yyyy', { locale: fr })
}

/**
 * Format a date to "dd/MM/yyyy HH:mm" in French.
 * Example: formatDateTime(date) → "15/03/2024 14:32"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd/MM/yyyy HH:mm', { locale: fr })
}

/**
 * Get relative time string.
 * Example: getRelativeTime(date) → "il y a 2 jours"
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
  return `Il y a ${Math.floor(diffDays / 365)} an(s)`
}

// ─── Phone ──────────────────────────────────────────────────────────────────────

/**
 * Format a French phone number.
 * Example: formatPhone("0612345678") → "06 12 34 56 78"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/)
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`
  }
  return phone
}

// ─── Names ──────────────────────────────────────────────────────────────────────

/**
 * Get initials from a name.
 * Example: getInitials("Jean Dupont") → "JD"
 */
export function getInitials(name: string): string {
  if (!name) return ''
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// ─── Numbers ────────────────────────────────────────────────────────────────────

/**
 * Format a number with locale separators.
 * Example: formatNumber(12450) → "12 450"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num)
}

/**
 * Format a percentage.
 * Example: formatPercent(0.125) → "12,5 %"
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)
}
