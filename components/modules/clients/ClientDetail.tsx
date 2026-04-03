'use client'

import { useState, useEffect } from 'react'
import {
    MapPin, Mail, Phone, Calendar,
    ShoppingCart, MessageSquare, Edit, Trash2,
    Clock, Package, FileText,
    TrendingUp, ArrowLeft,
    Banknote, ShoppingBag, PenLine, Send,
    Hash, ChevronRight, Loader2
} from 'lucide-react'
import { ClientAvatar } from './ClientAvatar'
import { ClientStatusBadge } from './ClientStatusBadge'
import { Client, ClientFullData, ClientSale, ClientStatus } from '@/lib/modules/clients/types'
import { formatDate, formatPhone, formatCurrency, formatRelativeDate, getClientStatus } from '@/lib/modules/clients/utils'
import { getClientFull, getClientSales } from '@/lib/modules/clients/api'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ClientDetailProps {
    client: Client
    onEdit: () => void
    onDelete: () => void
    onNewSale: () => void
    onBack?: () => void
}

// ── Status config ─────────────────────────────────────────────────
const STATUS_CONFIG: Record<ClientStatus, {
    label: string
    dot: string
    badge: string
}> = {
    active: {
        label: 'Actif',
        dot: 'bg-emerald-500',
        badge: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
    },
    new: {
        label: 'Nouveau',
        dot: 'bg-sky-500',
        badge: 'text-sky-700 bg-sky-50 border-sky-200/80',
    },
    inactive: {
        label: 'Inactif',
        dot: 'bg-orange-400',
        badge: 'text-orange-700 bg-orange-50 border-orange-200/80',
    },
}

// ── Sub-components ─────────────────────────────────────────────────

function KPICard({
    value,
    label,
    icon: Icon,
    gradient,
    iconColor,
}: {
    value: string
    label: string
    icon: React.ElementType
    gradient: string
    iconColor: string
}) {
    return (
        <div className={cn('rounded-2xl p-4 flex flex-col gap-3 border border-white/60', gradient)}>
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', iconColor)}>
                <Icon className="w-4.5 h-4.5" />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{value}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
            </div>
        </div>
    )
}

function ContactRow({
    icon: Icon,
    label,
    value,
    href,
    iconBg,
}: {
    icon: React.ElementType
    label: string
    value?: string | null
    href?: string
    iconBg: string
}) {
    const displayValue = value || undefined
    const content = (
        <div className="flex items-center gap-3 py-3 group">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
                <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className={cn('text-sm font-medium truncate', displayValue ? 'text-slate-800' : 'text-slate-300 italic font-normal')}>
                    {displayValue || 'Non renseigné'}
                </p>
            </div>
            {href && displayValue && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
            )}
        </div>
    )

    if (href && displayValue) {
        return (
            <a href={href} className="block px-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors rounded-xl cursor-pointer">
                {content}
            </a>
        )
    }

    return (
        <div className="block px-4 border-b border-slate-50 last:border-0">
            {content}
        </div>
    )
}

// ── Main Component ─────────────────────────────────────────────────

export function ClientDetail({ client, onEdit, onDelete, onNewSale, onBack }: ClientDetailProps) {
    const [fullData, setFullData] = useState<ClientFullData | null>(null)
    const [allSales, setAllSales] = useState<ClientSale[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [salesLoading, setSalesLoading] = useState(false)

    // Charger la fiche complète depuis l'API
    useEffect(() => {
        async function loadFullProfile() {
            setIsLoading(true)
            try {
                const response = await getClientFull(client.id)
                if (response.success) {
                    setFullData(response.data)
                }
            } catch (error) {
                console.error('Erreur chargement fiche client:', error)
                toast.error('Impossible de charger la fiche client')
                // Fallback : utiliser les données du client de la liste
                setFullData(null)
            } finally {
                setIsLoading(false)
            }
        }
        loadFullProfile()
    }, [client.id])

    // Charger l'historique complet des ventes quand on clique sur l'onglet historique
    const loadAllSales = async () => {
        if (allSales.length > 0) return
        setSalesLoading(true)
        try {
            const response = await getClientSales(client.id)
            if (response.success) {
                setAllSales(response.data)
            }
        } catch (error) {
            console.error('Erreur chargement ventes:', error)
            toast.error('Impossible de charger l\'historique des ventes')
        } finally {
            setSalesLoading(false)
        }
    }

    // Données résolues (API full ou fallback au client de la liste)
    const customerName = fullData?.customer.name ?? client.name
    const customerEmail = fullData?.customer.email ?? client.email
    const customerPhone = fullData?.customer.phone ?? client.phone
    const customerAddress = fullData?.customer.address ?? client.address
    const customerNotes = fullData?.customer.notes ?? client.notes
    const customerCreatedAt = fullData?.customer.createdAt ?? client.createdAt

    const status: ClientStatus = fullData?.status ?? getClientStatus(client)
    const sc = STATUS_CONFIG[status]

    const totalSpent = fullData?.stats.totalSpent ?? client.totalSpent
    const totalPurchases = fullData?.stats.totalPurchases ?? client.totalPurchases
    const averageOrder = fullData?.stats.averageOrder ?? (totalPurchases > 0 ? totalSpent / totalPurchases : 0)
    const lastPurchaseAt = fullData?.stats.lastPurchaseAt ?? client.lastPurchaseAt

    const recentSales = fullData?.recentSales ?? []

    if (isLoading) {
        return (
            <div className="flex flex-col h-full bg-slate-50/30 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
                <p className="text-sm text-slate-500 font-medium">Chargement du profil...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/30">

            {/* ── Top Bar ───────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-100 shrink-0">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Retour aux clients
                </button>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="h-8 gap-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs px-3 rounded-lg font-medium"
                    >
                        <Edit className="h-3.5 w-3.5" />
                        Modifier
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className="h-8 gap-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 text-xs px-3 rounded-lg font-medium"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Supprimer
                    </Button>
                </div>
            </div>

            {/* ── Body: Two Columns ──────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden gap-0">

                {/* ─── Left Sidebar ─────────────────────────────────── */}
                <aside className="w-72 xl:w-80 shrink-0 border-r border-slate-100 bg-white overflow-y-auto flex flex-col">

                    {/* Profile Hero */}
                    <div className="px-6 pt-8 pb-6 text-center border-b border-slate-50">
                        <div className="relative inline-block mb-4">
                            <ClientAvatar
                                name={customerName}
                                className="w-20 h-20 text-2xl mx-auto ring-4 ring-white shadow-lg"
                            />
                            <span className={cn(
                                'absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-[2.5px] border-white shadow-sm',
                                sc.dot
                            )} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1">{customerName}</h2>
                        <span className={cn(
                            'inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border',
                            sc.badge
                        )}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', sc.dot)} />
                            {sc.label}
                        </span>
                        {lastPurchaseAt && (
                            <p className="text-[11px] text-slate-400 font-medium mt-3 flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3" />
                                Dernier achat {formatRelativeDate(lastPurchaseAt)}
                            </p>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4 py-4 border-b border-slate-50">
                        <Button
                            onClick={onNewSale}
                            className="w-full h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200/50 font-semibold text-xs rounded-xl mb-2"
                        >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            Nouvelle vente
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                            {customerPhone && (
                                <a
                                    href={`sms:${customerPhone}`}
                                    className="flex items-center justify-center gap-1.5 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-[11px] font-semibold"
                                >
                                    <MessageSquare className="h-3 w-3" />
                                    SMS
                                </a>
                            )}
                            {customerEmail && (
                                <a
                                    href={`mailto:${customerEmail}`}
                                    className="flex items-center justify-center gap-1.5 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-[11px] font-semibold"
                                >
                                    <Send className="h-3 w-3" />
                                    Email
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="px-2 py-4 border-b border-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">Contact</p>
                        <div className="rounded-xl bg-white border border-slate-100 overflow-hidden">
                            <ContactRow icon={Mail} label="Email" value={customerEmail} href={customerEmail ? `mailto:${customerEmail}` : undefined} iconBg="bg-indigo-50 text-indigo-500" />
                            <ContactRow icon={Phone} label="Téléphone" value={customerPhone ? formatPhone(customerPhone) : null} href={customerPhone ? `tel:${customerPhone}` : undefined} iconBg="bg-emerald-50 text-emerald-500" />
                            <ContactRow icon={MapPin} label="Adresse" value={customerAddress} iconBg="bg-rose-50 text-rose-500" />
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="px-2 py-4 flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">Informations</p>
                        <div className="rounded-xl bg-white border border-slate-100 overflow-hidden">
                            <ContactRow icon={Calendar} label="Client depuis" value={formatDate(customerCreatedAt)} iconBg="bg-violet-50 text-violet-500" />
                            <ContactRow icon={Hash} label="ID Client" value={`#${client.id}`} iconBg="bg-slate-100 text-slate-500" />
                        </div>
                    </div>
                </aside>

                {/* ─── Right Content ─────────────────────────────────── */}
                <main className="flex-1 overflow-hidden flex flex-col">
                    <Tabs defaultValue="overview" className="flex flex-col h-full" onValueChange={(val) => {
                        if (val === 'history') loadAllSales()
                    }}>

                        {/* Tab Navigation */}
                        <div className="border-b border-slate-100 bg-white px-6 shrink-0">
                            <TabsList className="h-auto bg-white p-0 gap-0">
                                {[
                                    { value: 'overview', label: 'Profil client' },
                                    { value: 'history', label: 'Historique', count: totalPurchases },
                                    { value: 'notes', label: 'Notes' },
                                ].map(tab => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="relative text-[13px] font-medium py-3.5 px-1 mr-6 rounded-none border-b-2 border-transparent data-[state=active]:text-indigo-600 text-slate-500 hover:text-slate-800 transition-colors"
                                    >
                                        {tab.label}
                                        {tab.count !== undefined && tab.count > 0 && (
                                            <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                                                {tab.count}
                                            </span>
                                        )}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {/* ── Tab: Overview ─────────────────────────── */}
                        <TabsContent value="overview" className="m-0 flex-1 overflow-y-auto">
                            <div className="p-6 space-y-6">

                                {/* KPI Cards */}
                                <div>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Performance financière
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        <KPICard
                                            value={formatCurrency(totalSpent)}
                                            label="Total dépensé"
                                            icon={Banknote}
                                            gradient="bg-gradient-to-br from-indigo-50 to-indigo-50/20"
                                            iconColor="bg-indigo-100 text-indigo-600"
                                        />
                                        <KPICard
                                            value={String(totalPurchases)}
                                            label="Commandes"
                                            icon={ShoppingBag}
                                            gradient="bg-gradient-to-br from-emerald-50 to-emerald-50/20"
                                            iconColor="bg-emerald-100 text-emerald-600"
                                        />
                                        <KPICard
                                            value={formatCurrency(averageOrder)}
                                            label="Panier moyen"
                                            icon={TrendingUp}
                                            gradient="bg-gradient-to-br from-violet-50 to-violet-50/20"
                                            iconColor="bg-violet-100 text-violet-600"
                                        />
                                    </div>
                                </div>

                                {/* Stage Indicator */}
                                <div>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Statut du client
                                    </h3>
                                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            {([
                                                { key: 'new' as ClientStatus, label: 'Nouveau' },
                                                { key: 'active' as ClientStatus, label: 'Actif' },
                                                { key: 'inactive' as ClientStatus, label: 'Inactif' },
                                            ]).map((s) => {
                                                const isActive = s.key === status
                                                return (
                                                    <span
                                                        key={s.key}
                                                        className={cn(
                                                            'flex-1 text-center text-[11px] font-semibold py-1.5 px-2 rounded-lg border transition-all',
                                                            isActive
                                                                ? s.key === 'active'
                                                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-200'
                                                                    : s.key === 'new'
                                                                        ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200'
                                                                        : 'bg-orange-400 text-white border-orange-400 shadow-sm shadow-orange-200'
                                                                : 'bg-slate-50 text-slate-400 border-slate-100'
                                                        )}
                                                    >
                                                        {s.label}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Inscrit le</p>
                                                <p className="font-medium text-slate-800">{formatDate(customerCreatedAt)}</p>
                                            </div>
                                            {lastPurchaseAt && (
                                                <div>
                                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Dernier achat</p>
                                                    <p className="font-medium text-slate-800">{formatDate(lastPurchaseAt)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Transactions (from /full endpoint) */}
                                {recentSales.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                Dernières transactions
                                            </h3>
                                            <button
                                                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                                                onClick={() => {
                                                    const trigger = document.querySelector('[data-value="history"]') as HTMLElement
                                                    trigger?.click()
                                                }}
                                            >
                                                Voir tout →
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {recentSales.map((sale) => (
                                                <div
                                                    key={sale.id}
                                                    className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group"
                                                >
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                                        <Package className="w-4 h-4 text-indigo-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            Commande #{sale.id}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                                            {sale.itemsCount} article{sale.itemsCount > 1 ? 's' : ''} · {formatDate(sale.createdAt)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-sm font-bold text-slate-900">{formatCurrency(sale.total)}</p>
                                                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Payé</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* ── Tab: Historique ───────────────────────── */}
                        <TabsContent value="history" className="m-0 flex-1 overflow-y-auto">
                            <div className="p-6">
                                {salesLoading ? (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mb-3" />
                                        <p className="text-sm text-slate-500">Chargement de l&apos;historique...</p>
                                    </div>
                                ) : allSales.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200/60">
                                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-slate-100">
                                            <ShoppingBag className="w-5 h-5 text-slate-300" />
                                        </div>
                                        <h3 className="text-sm font-medium text-slate-900 mb-1">Aucun achat</h3>
                                        <p className="text-sm text-slate-500 max-w-sm">Ce client n&apos;a pas encore effectué d&apos;achat. Ses futures transactions apparaîtront ici.</p>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-slate-50/50">
                                                <tr className="border-slate-100">
                                                    <th className="text-left font-semibold text-slate-500 h-11 text-[11px] uppercase tracking-wider pl-5">Commande</th>
                                                    <th className="text-left font-semibold text-slate-500 h-11 text-[11px] uppercase tracking-wider">Date</th>
                                                    <th className="text-left font-semibold text-slate-500 h-11 text-[11px] uppercase tracking-wider">Articles</th>
                                                    <th className="text-right font-semibold text-slate-500 h-11 text-[11px] uppercase tracking-wider pr-5">Montant</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allSales.map((sale) => (
                                                    <tr key={sale.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                                                        <td className="font-medium text-slate-900 py-3 pl-5 text-sm">#{sale.id}</td>
                                                        <td className="text-slate-600 py-3 text-sm">{formatDate(sale.createdAt)}</td>
                                                        <td className="text-slate-600 py-3 text-sm">{sale.itemsCount} article{sale.itemsCount > 1 ? 's' : ''}</td>
                                                        <td className="font-medium text-slate-900 py-3 pr-5 text-sm text-right">{formatCurrency(sale.total)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* ── Tab: Notes ────────────────────────────── */}
                        <TabsContent value="notes" className="m-0 flex-1 overflow-y-auto">
                            <div className="p-6">
                                {customerNotes ? (
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Notes internes</h3>
                                            <button
                                                onClick={onEdit}
                                                className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                                            >
                                                <PenLine className="w-3 h-3" />
                                                Modifier
                                            </button>
                                        </div>
                                        <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                                                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                                                </div>
                                                <span className="text-sm font-semibold text-amber-800">Note</span>
                                                <span className="text-xs text-amber-500 ml-auto">{formatDate(customerCreatedAt)}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                {customerNotes}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 shadow-sm">
                                            <FileText className="w-6 h-6 text-slate-300" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700 mb-1.5">Aucune note</p>
                                        <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                                            Ajoutez des notes internes sur ce client.
                                        </p>
                                        <Button
                                            onClick={onEdit}
                                            size="sm"
                                            className="mt-5 h-8 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg px-4"
                                        >
                                            <PenLine className="w-3.5 h-3.5" />
                                            Ajouter une note
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                    </Tabs>
                </main>
            </div>
        </div>
    )
}
