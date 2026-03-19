'use client'

import { ShoppingCart, MessageSquare, Mail, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ClientActionsProps {
    clientPhone?: string
    clientEmail?: string
    onEdit: () => void
    onDelete: () => void
    onNewSale: () => void
}

export function ClientActions({ clientPhone, clientEmail, onEdit, onDelete, onNewSale }: ClientActionsProps) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            {clientPhone && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `sms:${clientPhone}`}
                    className="h-9 gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm rounded-lg"
                >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline font-medium">SMS</span>
                </Button>
            )}

            {clientEmail && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `mailto:${clientEmail}`}
                    className="h-9 gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm rounded-lg"
                >
                    <Mail className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline font-medium">Email</span>
                </Button>
            )}

            <div className="w-px h-5 bg-slate-200 mx-1 hidden sm:block" />

            <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-9 gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg px-2.5 sm:px-3"
            >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Modifier</span>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg shrink-0"
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <Button
                onClick={onNewSale}
                size="sm"
                className="h-9 gap-2 bg-slate-900 hover:bg-slate-800 text-white ml-1 shadow-sm rounded-lg font-medium"
            >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Nouvelle Vente</span>
                <span className="sm:hidden">Vente</span>
            </Button>
        </div>
    )
}
