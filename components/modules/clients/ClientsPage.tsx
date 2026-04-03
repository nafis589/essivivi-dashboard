'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, DownloadCloud, RefreshCw } from 'lucide-react'
import { Client, ClientFormData, ClientsListParams, PaginationInfo } from '@/lib/modules/clients/types'
import { ClientsFilters, ClientFilterType } from './ClientsFilters'
import { fetchClients, createClient, updateClient, deleteClient } from '@/lib/modules/clients/api'
import { ClientsTable } from './ClientsTable'
import { ClientsSearch } from './ClientsSearch'
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
    "Statut",
    "Achats",
    "Dépenses",
    "Dernière visite",
    "Actions",
] as const;

export function ClientsPage() {
    // ── Data state ──────────────────────────────────────────────
    const [clients, setClients] = useState<Client[]>([])
    const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 20, total: 0, totalPages: 0 })
    const [isLoading, setIsLoading] = useState(true)

    // ── Filter / Search state ───────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<ClientFilterType>('all')
    const [sortBy, setSortBy] = useState<ClientsListParams['sortBy']>('createdAt')
    const [sortOrder, setSortOrder] = useState<ClientsListParams['sortOrder']>('desc')

    // ── Modal state ─────────────────────────────────────────────
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isImportExportOpen, setIsImportExportOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [visibleColumns, setVisibleColumns] = useState<string[]>([...allColumns]);

    const toggleColumn = (col: string) => {
        setVisibleColumns((prev) =>
            prev.includes(col)
                ? prev.filter((c) => c !== col)
                : [...prev, col]
        );
    };

    // ── Fetch clients from API ──────────────────────────────────
    const loadClients = useCallback(async (page = 1) => {
        setIsLoading(true)
        try {
            const params: ClientsListParams = {
                page,
                limit: 20,
                sortBy,
                sortOrder,
            }
            if (searchQuery.trim()) {
                params.search = searchQuery.trim()
            }

            const response = await fetchClients(params)

            if (response.success) {
                setClients(response.data.customers)
                setPagination(response.data.pagination)
            }
        } catch (error) {
            console.error('Erreur chargement clients:', error)
            toast.error('Impossible de charger les clients')
        } finally {
            setIsLoading(false)
        }
    }, [searchQuery, sortBy, sortOrder])

    // Charger au montage et quand les filtres changent
    useEffect(() => {
        const debounce = setTimeout(() => {
            loadClients(1)
        }, searchQuery ? 400 : 0)
        return () => clearTimeout(debounce)
    }, [loadClients, searchQuery])

    // ── Filtrage local ──────────────────────────────────────────
    const filteredClients = (() => {
        if (filterType === 'all') return clients
        if (filterType === 'best') {
            return clients.filter(c => c.totalPurchases >= 10 || c.totalSpent >= 50000)
        }
        if (filterType === 'recent') {
            return clients.filter(c => c.totalPurchases === 0)
        }
        if (filterType === 'inactive') {
            if (!clients.length) return clients
            return clients.filter(c => {
                if (!c.lastPurchaseAt || c.totalPurchases === 0) return false
                const diffDays = Math.floor(
                    (Date.now() - new Date(c.lastPurchaseAt).getTime()) / (1000 * 60 * 60 * 24)
                )
                return diffDays > 60
            })
        }
        return clients
    })()

    // ── Actions ─────────────────────────────────────────────────
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

    const handleConfirmDelete = async () => {
        if (!selectedClient) return
        setIsSubmitting(true)
        try {
            await deleteClient(selectedClient.id)
            toast.success('Client supprimé avec succès')
            setIsDeleteDialogOpen(false)
            setSelectedClient(null)
            loadClients(pagination.page)
        } catch (error: any) {
            toast.error(error?.message || 'Erreur lors de la suppression')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSaveClient = async (data: ClientFormData) => {
        setIsSubmitting(true)
        try {
            if (selectedClient && isFormOpen) {
                await updateClient(selectedClient.id, data)
                toast.success('Client modifié avec succès')
            } else {
                await createClient(data)
                toast.success('Client créé avec succès')
            }
            setIsFormOpen(false)
            setSelectedClient(null)
            loadClients(pagination.page)
        } catch (error: any) {
            toast.error(error?.message || 'Erreur lors de l\'enregistrement')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCreateNew = () => {
        setSelectedClient(null)
        setIsFormOpen(true)
    }

    const handleNewSale = (client: Client) => {
        toast.success(`Redirection vers la caisse pour ${client.name}...`)
    }

    const handlePageChange = (page: number) => {
        loadClients(page)
    }

    const isDetailOpen = selectedClient !== null && !isFormOpen && !isDeleteDialogOpen

    return (
        <div className="flex flex-col h-full -mt-1">
            {isDetailOpen && selectedClient ? (
                <div className="flex-1 overflow-hidden bg-white">
                    <ClientDetail
                        client={selectedClient}
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
                                {pagination.total > 0 && (
                                    <span className="ml-2 text-slate-400">
                                        · {pagination.total} client{pagination.total > 1 ? 's' : ''}
                                    </span>
                                )}
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
                    <div className="container-none space-y-4 p-4 border border-border rounded-lg bg-white shadow-sm overflow-x-auto">
                        {/* Toolbar */}
                        <div className="flex flex-wrap gap-4 items-center justify-between p-3 mb-4 bg-slate-50 rounded-lg border border-slate-200/60">
                            <ClientsSearch value={searchQuery} onChange={setSearchQuery} />

                            <div className="flex gap-2 items-center">
                                <ClientsFilters value={filterType} onChange={setFilterType} />

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="bg-white">
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

                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => loadClients(pagination.page)} 
                                    className="bg-white h-9 w-9"
                                >
                                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                                </Button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1">
                            <ClientsTable
                                clients={filteredClients}
                                onView={handleViewClient}
                                onEdit={handleEditClient}
                                isLoading={isLoading}
                                visibleColumns={visibleColumns}
                            />
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <p className="text-sm text-slate-500">
                                    Page {pagination.page} sur {pagination.totalPages}
                                    <span className="text-slate-400 ml-1">({pagination.total} résultats)</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.page <= 1}
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        className="h-8 text-xs"
                                    >
                                        Précédent
                                    </Button>
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        const startPage = Math.max(1, pagination.page - 2)
                                        const pageNum = startPage + i
                                        if (pageNum > pagination.totalPages) return null
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={pageNum === pagination.page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`h-8 w-8 p-0 text-xs ${pageNum === pagination.page ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
                                            >
                                                {pageNum}
                                            </Button>
                                        )
                                    })}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.page >= pagination.totalPages}
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        className="h-8 text-xs"
                                    >
                                        Suivant
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

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
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            <ClientDeleteDialog
                client={selectedClient}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />

            <ImportExportModal
                open={isImportExportOpen}
                onOpenChange={setIsImportExportOpen}
            />
        </div>
    )
}
