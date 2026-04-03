'use client'

import { Client } from '@/lib/modules/clients/types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { ClientsTableRow } from './ClientsTableRow'

interface ClientsTableProps {
    clients: Client[]
    onView: (client: Client) => void
    onEdit: (client: Client) => void
    isLoading?: boolean
    selectedClientId?: number
    visibleColumns: string[]
}

export function ClientsTable({
    clients,
    onView,
    onEdit,
    isLoading,
    selectedClientId,
    visibleColumns
}: ClientsTableProps) {
    const colCount = visibleColumns.length;

    return (
        <div className="bg-white">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-transparent border-0">
                        {visibleColumns.includes("Client") && (
                            <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 pl-4 pr-6">Client</TableHead>
                        )}
                        {visibleColumns.includes("Contact") && (
                            <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 px-4 hidden md:table-cell">Contact</TableHead>
                        )}
                        {visibleColumns.includes("Statut") && (
                            <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 px-4 hidden lg:table-cell">Statut</TableHead>
                        )}
                        {visibleColumns.includes("Achats") && (
                            <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 px-4 text-center">Achats</TableHead>
                        )}
                        {visibleColumns.includes("Dépenses") && (
                            <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 px-4 text-right">Dépenses</TableHead>
                        )}
                        {visibleColumns.includes("Dernière visite") && (
                            <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 px-4 text-right hidden xl:table-cell">Dernière visite</TableHead>
                        )}
                        {visibleColumns.includes("Actions") && (
                            <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 pr-4 text-right">Actions</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={colCount} className="text-center py-10 text-slate-500">
                                Chargement des clients...
                            </TableCell>
                        </TableRow>
                    ) : clients.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={colCount} className="text-center py-10 text-slate-500">
                                Aucun client trouvé.
                            </TableCell>
                        </TableRow>
                    ) : (
                        clients.map((client) => (
                            <ClientsTableRow
                                key={client.id}
                                client={client}
                                onView={onView}
                                onEdit={onEdit}
                                isSelected={selectedClientId === client.id}
                                visibleColumns={visibleColumns}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
