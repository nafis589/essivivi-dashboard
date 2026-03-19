/**
 * Domain types — Dashboard module
 */

import type { LucideIcon } from 'lucide-react'

// ─── KPI Stats ──────────────────────────────────────────────────────────────────

export interface DashboardStat {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
  color: 'indigo' | 'emerald' | 'amber' | 'violet'
  description: string
  sparkData: number[]
}

// ─── Recent Sales ───────────────────────────────────────────────────────────────

export interface RecentSale {
  id: number
  time: string
  client: string
  items: string
  total: string
  status: 'completed' | 'pending'
  category: string
}

// ─── Top Products ───────────────────────────────────────────────────────────────

export interface TopProduct {
  name: string
  sales: number
  revenue: string
  change: string
  trend: 'up' | 'down'
}

// ─── Quick Actions ──────────────────────────────────────────────────────────────

export interface QuickAction {
  label: string
  description: string
  icon: LucideIcon
  href: string
  color: 'indigo' | 'emerald' | 'violet'
}

// ─── Color Map ──────────────────────────────────────────────────────────────────

export interface ColorConfig {
  icon: string
  badge: string
  spark: string
  ring: string
  action: string
  actionLight: string
}

export type ColorMap = Record<string, ColorConfig>
