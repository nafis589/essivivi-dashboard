'use client'

import { Client } from '@/lib/modules/clients/types'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClientsTableRow } from './ClientsTableRow'

interface ClientsTableProps {
    clients: Client[]
    onView: (client: Client) => void
    onEdit: (client: Client) => void
    isLoading?: boolean
    selectedClientId?: number
}

export function ClientsTable({ clients, onView, onEdit, isLoading, selectedClientId }: ClientsTableProps) {
    if (isLoading) {
        return (
            <div className="bg-white overflow-hidden flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (clients.length === 0) {
        return (
            <div className="border border-slate-200 border-dashed rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Aucun client trouvé</h3>
                <p className="text-slate-500 max-w-sm mb-6">
                    Essayez de modifier vos filtres ou ajoutez un nouveau client à votre base de données.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50/50 border-b border-slate-200/60">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 pl-4 pr-6">Client</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 px-4 hidden md:table-cell">Contact</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 px-4 text-right">Dépenses</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 pr-4 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <ClientsTableRow
                            key={client.id}
                            client={client}
                            onView={onView}
                            onEdit={onEdit}
                            isSelected={selectedClientId === client.id}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
