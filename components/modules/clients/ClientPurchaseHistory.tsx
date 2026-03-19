'use client'

import { formatCurrency, formatDate } from '@/lib/modules/clients/utils'
import { PurchaseHistoryItem } from '@/lib/modules/clients/types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface ClientPurchaseHistoryProps {
    history: PurchaseHistoryItem[]
}

export function ClientPurchaseHistory({ history }: ClientPurchaseHistoryProps) {
    const formatPaymentMethod = (method: string) => {
        switch (method) {
            case 'carte': return 'Carte bancaire'
            case 'especes': return 'Espèces'
            case 'virement': return 'Virement'
            case 'mobile_money': return 'Mobile Money'
            default: return method
        }
    }

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200/60">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-slate-100">
                    <span className="text-slate-400">🛍️</span>
                </div>
                <h3 className="text-sm font-medium text-slate-900 mb-1">Aucun achat</h3>
                <p className="text-sm text-slate-500 max-w-sm">Ce client n'a pas encore effectué d'achat. Ses futures transactions apparaîtront ici.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100 hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-500 h-11 text-[11px] uppercase tracking-wider pl-5">Commande</TableHead>
                        <TableHead className="font-semibold text-slate-500 h-11 text-[11px] uppercase tracking-wider">Date</TableHead>
                        <TableHead className="font-semibold text-slate-500 h-11 text-[11px] uppercase tracking-wider">Montant</TableHead>
                        <TableHead className="font-semibold text-slate-500 h-11 text-[11px] uppercase tracking-wider">Paiement</TableHead>
                        <TableHead className="text-right font-semibold text-slate-500 h-11 text-[11px] uppercase tracking-wider pr-5"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {history.map((purchase) => (
                        <TableRow key={purchase.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <TableCell className="font-medium text-slate-900 py-3 pl-5">#{purchase.id}</TableCell>
                            <TableCell className="text-slate-600 py-3 text-sm">{formatDate(purchase.date)}</TableCell>
                            <TableCell className="font-medium text-slate-900 py-3">{formatCurrency(purchase.amount)}</TableCell>
                            <TableCell className="py-3">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 font-medium">
                                    {formatPaymentMethod(purchase.paymentMethod)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right py-3 pr-5">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-white shadow-sm border border-transparent hover:border-slate-200 transition-all rounded-lg">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
