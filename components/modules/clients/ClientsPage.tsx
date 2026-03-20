'use client'

import { useState, useMemo } from 'react'
import { Plus, Users, DownloadCloud } from 'lucide-react'
import { Client, ClientFormData } from '@/lib/modules/clients/types'
import { mockClients, mockPurchaseHistory } from '@/lib/modules/clients/mockData'
import { getClientStatus } from '@/lib/modules/clients/utils'
import { ClientsTable } from './ClientsTable'
import { ClientsSearch } from './ClientsSearch'
import { ClientsFilters, ClientFilterType } from './ClientsFilters'
import { ClientDetail } from './ClientDetail'
import { ClientForm } from './ClientForm'
import { ClientDeleteDialog } from './ClientDeleteDialog'
import { ImportExportModal } from './ImportExportModal'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const allColumns = [
    "Client",
    "Contact",
    "Achats",
    "Dépenses",
    "Dernière visite",
    "Actions",
] as const;

export function ClientsPage() {
    const [clients, setClients] = useState<Client[]>(mockClients)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<ClientFilterType>('all')

    // États modales
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isImportExportOpen, setIsImportExportOpen] = useState(false)

    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [visibleColumns, setVisibleColumns] = useState<string[]>([...allColumns]);

    const toggleColumn = (col: string) => {
        setVisibleColumns((prev) =>
            prev.includes(col)
                ? prev.filter((c) => c !== col)
                : [...prev, col]
        );
    };

    // Filtrage et recherche
    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const searchLower = searchQuery.toLowerCase()
            const matchesSearch =
                client.name.toLowerCase().includes(searchLower) ||
                (client.email && client.email.toLowerCase().includes(searchLower)) ||
                (client.phone && client.phone.includes(searchLower))

            if (!matchesSearch) return false

            const status = getClientStatus(client)
            if (filterType === 'recent') return status === 'nouveau'
            if (filterType === 'inactive') return status === 'inactif'
            if (filterType === 'best') return client.totalPurchases >= 10 || client.totalSpent >= 1000

            return true
        })
    }, [clients, searchQuery, filterType])

    // Actions
    const handleViewClient = (client: Client) => {
        setSelectedClient(client)
    }

    const handleEditClient = (client: Client) => {
        setSelectedClient(client)
        setIsFormOpen(true)
    }

    const handleDeleteClient = (client: Client) => {
        setSelectedClient(client)
        setIsDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (selectedClient) {
            setClients(clients.filter(c => c.id !== selectedClient.id))
            toast.success('Client supprimé avec succès')
            setIsDeleteDialogOpen(false)
            setSelectedClient(null)
        }
    }

    const handleSaveClient = (data: ClientFormData) => {
        if (selectedClient && isFormOpen) {
            setClients(clients.map(c => c.id === selectedClient.id ? { ...c, ...data } : c))
            toast.success('Client modifié avec succès')
            setSelectedClient({ ...selectedClient, ...data })
            setIsFormOpen(false)
        } else {
            const newClient: Client = {
                id: Math.max(...clients.map(c => c.id), 0) + 1,
                ...data,
                totalPurchases: 0,
                totalSpent: 0,
                createdAt: new Date()
            }
            setClients([newClient, ...clients])
            toast.success('Client créé avec succès')
            setIsFormOpen(false)
        }
    }

    const handleCreateNew = () => {
        setSelectedClient(null)
        setIsFormOpen(true)
    }

    const handleNewSale = (client: Client) => {
        toast.success(`Redirection vers la caisse pour ${client.name}...`)
    }

    const isDetailOpen = selectedClient !== null

    return (
        <div className="flex flex-col h-full -mt-1">
            {isDetailOpen && selectedClient ? (
                <div className="flex-1 overflow-hidden bg-white">
                    <ClientDetail
                        client={selectedClient}
                        history={mockPurchaseHistory[selectedClient.id] || []}
                        onEdit={() => handleEditClient(selectedClient)}
                        onDelete={() => handleDeleteClient(selectedClient)}
                        onNewSale={() => handleNewSale(selectedClient)}
                        onBack={() => setSelectedClient(null)}
                    />
                </div>
            ) : (
                <>
                    {/* ── Page Header ──────────────────────────────────────── */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 px-1">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Clients</h1>
                            <p className="text-[13px] text-slate-500 font-medium">
                                Gérez votre fichier client et consultez leur historique
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsImportExportOpen(true)}
                                className="h-9 text-sm font-medium"
                            >
                                <DownloadCloud className="mr-2 h-4 w-4" />
                                Importer/Exporter
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleCreateNew}
                                className="h-9 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Nouveau client
                            </Button>
                        </div>
                    </div>

                    {/* ── Main View: List ──────────────────────────────────── */}
                    <div className="container-none space-y-4 p-4 border border-border rounded-lg bg-background shadow-sm overflow-x-auto">
                        {/* Toolbar */}
                        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                            <ClientsSearch value={searchQuery} onChange={setSearchQuery} />

                            <div className="flex gap-2 items-center">
                                <ClientsFilters value={filterType} onChange={setFilterType} />

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            Colonnes
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-48" align="end">
                                        {allColumns.map((col) => (
                                            <DropdownMenuCheckboxItem
                                                key={col}
                                                checked={visibleColumns.includes(col)}
                                                onCheckedChange={() => toggleColumn(col)}
                                            >
                                                {col}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1">
                            <ClientsTable
                                clients={filteredClients}
                                onView={handleViewClient}
                                onEdit={handleEditClient}
                                visibleColumns={visibleColumns}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* ── Drawer: Formulaire Client ────────────────────────── */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent className="w-full sm:max-w-md p-6 overflow-hidden sm:rounded-l-2xl border-l flex flex-col h-full bg-white">
                    <SheetHeader className="mb-6">
                        <SheetTitle>
                            {selectedClient ? 'Modifier le client' : 'Nouveau client'}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-hidden text-sm">
                        <ClientForm
                            initialData={selectedClient || undefined}
                            onSubmit={handleSaveClient}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            {/* ── Modal: Suppression ───────────────────────────────── */}
            <ClientDeleteDialog
                client={selectedClient}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />

            {/* ── Modal: Import/Export ─────────────────────────────── */}
            <ImportExportModal
                open={isImportExportOpen}
                onOpenChange={setIsImportExportOpen}
            />
        </div>
    )
}
