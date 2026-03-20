'use client'

import { Client } from '@/lib/modules/clients/types'
import { formatCurrency, formatDate, formatPhone, getClientStatus } from '@/lib/modules/clients/utils'
import { TableRow, TableCell } from '@/components/ui/table'
import { ClientAvatar } from './ClientAvatar'
import { ClientStatusBadge } from './ClientStatusBadge'
import { Button } from '@/components/ui/button'
import { Edit2, MoreHorizontal, ChevronRight } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { cn } from '@/lib/utils'

interface ClientsTableRowProps {
    client: Client
    onView: (client: Client) => void
    onEdit: (client: Client) => void
    isSelected?: boolean
    visibleColumns: string[]
}

export function ClientsTableRow({ client, onView, onEdit, isSelected, visibleColumns }: ClientsTableRowProps) {
    return (
        <TableRow
            className={cn(
                'group cursor-pointer transition-all duration-200 border-b border-slate-100 last:border-0',
                isSelected
                    ? 'bg-indigo-50/60 hover:bg-indigo-50 border-l-2 border-l-indigo-500'
                    : 'hover:bg-slate-50/50'
            )}
            onClick={() => onView(client)}
        >
            {visibleColumns.includes("Client") && (
                <TableCell className="py-4 pl-4 pr-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                        <ClientAvatar name={client.name} />
                        <div className="flex flex-col">
                            <span className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{client.name}</span>
                            <span className="text-[11px] text-slate-400 md:hidden mt-0.5">
                                {client.phone ? formatPhone(client.phone) : 'Aucun tel'}
                            </span>
                        </div>
                    </div>
                </TableCell>
            )}
            {visibleColumns.includes("Contact") && (
                <TableCell className="hidden md:table-cell py-4 px-6 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-slate-700">{client.phone ? formatPhone(client.phone) : '-'}</span>
                        {client.email && <span className="text-[11px] text-slate-400 mt-0.5">{client.email}</span>}
                    </div>
                </TableCell>
            )}
            {visibleColumns.includes("Achats") && (
                <TableCell className="hidden lg:table-cell text-center py-4 px-6 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-slate-100/80 border border-slate-200/50 text-[11px] font-semibold text-slate-600">
                        {client.totalPurchases} {client.totalPurchases > 1 ? 'achats' : 'achat'}
                    </span>
                </TableCell>
            )}
            {visibleColumns.includes("Dépenses") && (
                <TableCell className="font-semibold text-slate-900 tabular-nums text-right md:text-left py-4 px-6 whitespace-nowrap">
                    <span className="text-[13px]">{formatCurrency(client.totalSpent)}</span>
                </TableCell>
            )}
            {visibleColumns.includes("Dernière visite") && (
                <TableCell className="hidden xl:table-cell py-4 px-6 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-[13px] text-slate-700 font-medium">
                            {client.lastPurchaseDate ? formatDate(client.lastPurchaseDate) : '-'}
                        </span>
                        <span className="mt-1.5">
                            <ClientStatusBadge client={client} />
                        </span>
                    </div>
                </TableCell>
            )}
            {visibleColumns.includes("Actions") && (
                <TableCell className="text-right py-4 pr-4 whitespace-nowrap">
                    <div className="flex justify-end gap-1 items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" onClick={e => e.stopPropagation()}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm transition-all hidden sm:flex"
                            onClick={(e) => {
                                e.stopPropagation()
                                onView(client)
                            }}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white text-slate-400 hover:text-slate-800 border border-transparent hover:border-slate-200 transition-all ml-1">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px] shadow-xl border-slate-200/60 rounded-xl p-1.5 backdrop-blur-xl bg-white/95">
                                <DropdownMenuItem className="cursor-pointer font-medium text-slate-600 focus:text-indigo-600 focus:bg-indigo-50/50 rounded-lg py-2" onClick={() => onView(client)}>
                                    Voir le profil
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer font-medium text-slate-600 focus:text-indigo-600 focus:bg-indigo-50/50 rounded-lg py-2" onClick={() => onEdit(client)}>
                                    <Edit2 className="h-4 w-4 mr-2 opacity-70" />
                                    Modifier
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </TableCell>
            )}
        </TableRow>
    )
}
