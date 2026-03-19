'use client'

import { ShoppingBag, TrendingUp, Calendar, Hash, LucideIcon } from 'lucide-react'
import { Client } from '@/lib/modules/clients/types'
import { formatCurrency, formatDate } from '@/lib/modules/clients/utils'

interface ClientStatsProps {
    client: Client
}

export function ClientStats({ client }: ClientStatsProps) {
    const panierMoyen = client.totalPurchases > 0
        ? client.totalSpent / client.totalPurchases
        : 0

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-2xl border border-slate-100 shadow-sm divide-y md:divide-y-0 md:divide-x divide-slate-100 overflow-hidden">
            <StatCard
                icon={TrendingUp}
                label="Total Dépensé"
                value={formatCurrency(client.totalSpent)}
            />
            <StatCard
                icon={ShoppingBag}
                label="Commandes"
                value={client.totalPurchases.toString()}
            />
            <StatCard
                icon={Hash}
                label="Panier Moyen"
                value={formatCurrency(panierMoyen)}
            />
            <StatCard
                icon={Calendar}
                label="Dernier Achat"
                value={client.lastPurchaseDate ? formatDate(client.lastPurchaseDate) : '-'}
                valueClassName={client.lastPurchaseDate ? 'text-lg md:text-xl' : ''}
            />
        </div>
    )
}

function StatCard({
    icon: Icon,
    label,
    value,
    valueClassName = ''
}: {
    icon: LucideIcon,
    label: string,
    value: string | number,
    valueClassName?: string
}) {
    return (
        <div className="p-5 flex flex-col gap-3 transition-colors hover:bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-500">
                <Icon className="h-4 w-4 text-slate-400" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
            </div>
            <div className={`text-2xl font-semibold tracking-tight text-slate-900 ${valueClassName}`}>
                {value}
            </div>
        </div>
    )
}
