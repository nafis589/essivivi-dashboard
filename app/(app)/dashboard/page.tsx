'use client'

import {
  TrendingUp,
  TrendingDown,
  Euro,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ChevronRight,
  Zap,
  Plus,
  Star,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const stats = [
  {
    title: 'Chiffre d\'affaires',
    value: '12 450 €',
    change: '+12.5%',
    trend: 'up',
    icon: Euro,
    color: 'indigo',
    description: 'vs hier',
    sparkData: [40, 55, 48, 65, 58, 72, 80, 75, 88, 95, 82, 100],
  },
  {
    title: 'Ventes aujourd\'hui',
    value: '23',
    change: '+5.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'emerald',
    description: 'vs hier',
    sparkData: [10, 15, 12, 18, 16, 20, 22, 19, 24, 21, 23, 25],
  },
  {
    title: 'Produits en stock',
    value: '156',
    change: '-3',
    trend: 'down',
    icon: Package,
    color: 'amber',
    description: 'unités retirées',
    sparkData: [180, 175, 170, 168, 165, 162, 160, 158, 160, 157, 158, 156],
  },
  {
    title: 'Clients actifs',
    value: '89',
    change: '+8',
    trend: 'up',
    icon: Users,
    color: 'violet',
    description: 'ce mois',
    sparkData: [60, 63, 65, 68, 70, 72, 75, 76, 78, 80, 85, 89],
  },
]

const recentSales = [
  {
    id: 1,
    time: '14:32',
    client: 'Sophie Martin',
    items: '3 articles',
    total: '45,90 €',
    status: 'completed',
    category: 'Vente directe',
  },
  {
    id: 2,
    time: '13:15',
    client: 'Jean-Paul Dubois',
    items: '1 article',
    total: '12,50 €',
    status: 'completed',
    category: 'Caisse',
  },
  {
    id: 3,
    time: '11:45',
    client: 'Claire Bernard',
    items: '5 articles',
    total: '78,20 €',
    status: 'completed',
    category: 'Vente directe',
  },
  {
    id: 4,
    time: '10:20',
    client: 'Marc Fontaine',
    items: '2 articles',
    total: '23,00 €',
    status: 'pending',
    category: 'Réservation',
  },
  {
    id: 5,
    time: '09:05',
    client: 'Isabelle Renard',
    items: '4 articles',
    total: '56,80 €',
    status: 'completed',
    category: 'Caisse',
  },
]

const topProducts = [
  { name: 'Pain de campagne', sales: 47, revenue: '141,00 €', change: '+18%', trend: 'up' },
  { name: 'Croissant beurre', sales: 38, revenue: '76,00 €', change: '+5%', trend: 'up' },
  { name: 'Baguette tradition', sales: 102, revenue: '122,40 €', change: '+32%', trend: 'up' },
  { name: 'Tarte aux pommes', sales: 12, revenue: '84,00 €', change: '-8%', trend: 'down' },
]

const quickActions = [
  {
    label: 'Nouvelle vente',
    description: 'Ouvrir la caisse',
    icon: ShoppingCart,
    href: '/dashboard/caisse',
    color: 'indigo',
  },
  {
    label: 'Ajouter un produit',
    description: 'Enrichir le catalogue',
    icon: Plus,
    href: '/dashboard/produits',
    color: 'emerald',
  },
  {
    label: 'Voir les rapports',
    description: 'Analyses & tendances',
    icon: TrendingUp,
    href: '/dashboard/rapports',
    color: 'violet',
  },
]

// ─── Color helpers ──────────────────────────────────────────────────────────────

const colorMap = {
  indigo: {
    icon: 'bg-indigo-50 text-indigo-600',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    spark: '#6366f1',
    ring: 'ring-indigo-100',
    action: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    actionLight: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100',
  },
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    spark: '#10b981',
    ring: 'ring-emerald-100',
    action: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    actionLight: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    spark: '#f59e0b',
    ring: 'ring-amber-100',
    action: 'bg-amber-600 hover:bg-amber-700 text-white',
    actionLight: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100',
  },
  violet: {
    icon: 'bg-violet-50 text-violet-600',
    badge: 'bg-violet-50 text-violet-700 border-violet-100',
    spark: '#8b5cf6',
    ring: 'ring-violet-100',
    action: 'bg-violet-600 hover:bg-violet-700 text-white',
    actionLight: 'bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-100',
  },
}

// ─── Sparkline Component ────────────────────────────────────────────────────────

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80
  const h = 32
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <polyline
        points={`0,${h} ${points} ${w},${h}`}
        fill={color}
        opacity="0.08"
        strokeWidth="0"
      />
    </svg>
  )
}

// ─── Mini Bar Chart ─────────────────────────────────────────────────────────────

function MiniBarChart() {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
  const values = [65, 82, 74, 90, 88, 45, 23]
  const max = Math.max(...values)

  return (
    <div className="flex items-end gap-1.5 h-16">
      {values.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-sm transition-all duration-300"
            style={{
              height: `${(val / max) * 52}px`,
              background: i === 4 || i === 5 ? '#6366f1' : '#e0e7ff',
            }}
          />
          <span className="text-[10px] text-slate-400 font-medium">{days[i]}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {greeting}, Marie
          </h2>
          <p className="text-sm text-slate-500 mt-0.5 capitalize">{dateStr}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-slate-600 border-slate-200 hover:bg-slate-50 text-sm font-medium gap-1.5"
          >
            <Clock className="h-3.5 w-3.5" />
            Aujourd'hui
          </Button>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium gap-1.5 shadow-sm shadow-indigo-200"
            asChild
          >
            <Link href="/dashboard/caisse">
              <Zap className="h-3.5 w-3.5" />
              Ouvrir la caisse
            </Link>
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const c = colorMap[stat.color as keyof typeof colorMap]
          const isUp = stat.trend === 'up'

          return (
            <Card
              key={stat.title}
              className="relative overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${c.icon}`}>
                    <Icon className="h-4.5 w-4.5" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <Sparkline data={stat.sparkData} color={c.spark} />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 tracking-tight">
                    {stat.value}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 mt-2.5">
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md ${
                      isUp
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-xs text-slate-400">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ── Main content row ──────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-7">

        {/* Recent transactions */}
        <Card className="lg:col-span-4 border border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 px-5 pt-5">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Transactions récentes
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                {recentSales.length} ventes aujourd'hui
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-500 hover:text-slate-800 gap-0.5 -mr-1"
              asChild
            >
              <Link href="/dashboard/ventes">
                Tout voir
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="px-5 pb-5">
            <div className="space-y-1">
              {recentSales.map((sale, idx) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-xs font-semibold text-indigo-600 shrink-0">
                      {sale.client.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 leading-tight">
                        {sale.client}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {sale.items} · {sale.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full hidden sm:inline-flex ${
                        sale.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {sale.status === 'completed' ? '✓ Payé' : '⏳ En attente'}
                    </span>
                    <p className="text-sm font-semibold text-slate-900">{sale.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="lg:col-span-3 flex flex-col gap-4">

          {/* Weekly overview */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-2 px-5 pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Vue hebdomadaire
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Ventes par jour
                  </CardDescription>
                </div>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                  Cette semaine
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <MiniBarChart />
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Total: <strong className="text-slate-800 font-semibold">467 ventes</strong></span>
                <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" /> +14% vs sem. passée
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-2 px-5 pt-5">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-2">
              {quickActions.map((action) => {
                const ActionIcon = action.icon
                const c = colorMap[action.color as keyof typeof colorMap]
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-150 cursor-pointer group"
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${c.icon}`}>
                      <ActionIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{action.label}</p>
                      <p className="text-xs text-slate-400">{action.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Top Products ──────────────────────────────────────────────────── */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3 px-5 pt-5">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Produits les plus vendus
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Performance du catalogue aujourd'hui
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-slate-500 hover:text-slate-800 gap-0.5 -mr-1"
            asChild
          >
            <Link href="/dashboard/produits">
              Voir tout
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="px-5 pb-5">

          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-3 pb-2 border-b border-slate-100">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Produit</span>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide text-right">Ventes</span>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide text-right hidden sm:block">Revenus</span>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide text-right">Tendance</span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-slate-50">
            {topProducts.map((product, idx) => (
              <div
                key={product.name}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-3 py-3 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-medium text-slate-400 w-4">{idx + 1}</span>
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Star className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-800">{product.name}</span>
                </div>
                <span className="text-sm text-slate-600 text-right font-medium">{product.sales}</span>
                <span className="text-sm text-slate-600 text-right hidden sm:block">{product.revenue}</span>
                <span
                  className={`text-xs font-medium text-right flex items-center justify-end gap-0.5 ${
                    product.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {product.trend === 'up' ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {product.change}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
