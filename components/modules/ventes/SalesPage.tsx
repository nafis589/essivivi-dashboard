"use client";

import { useState, useMemo, useEffect } from "react";
import { Sale } from "@/lib/modules/ventes/types";
import { MOCK_SALES } from "@/lib/modules/ventes/mockData";
import { calculateStats, exportToCSV } from "@/lib/modules/ventes/utils";
import { SaleStats } from "./SaleStats";
import { SalesFilters } from "./SalesFilters";
import { SalesSearch } from "./SalesSearch";
import { ExportButton } from "./ExportButton";
import { SalesTable } from "./SalesTable";
import { SaleDetailModal } from "./SaleDetailModal";
import { RefundModal } from "./RefundModal";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const allColumns = [
    "N° Facture",
    "Date / Heure",
    "Client",
    "Articles",
    "Total",
    "Paiement",
    "Statut",
    "Actions",
] as const;

export function SalesPage() {
    const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
    const [isLoading, setIsLoading] = useState(true);

    // Filters state
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Changed to 10 for demo, user wants 20

    // Modals state
    const [selectedSaleDetail, setSelectedSaleDetail] = useState<Sale | null>(null);
    const [selectedSaleRefund, setSelectedSaleRefund] = useState<Sale | null>(null);

    const [visibleColumns, setVisibleColumns] = useState<string[]>([...allColumns]);

    const toggleColumn = (col: string) => {
        setVisibleColumns((prev) =>
            prev.includes(col)
                ? prev.filter((c) => c !== col)
                : [...prev, col]
        );
    };

    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        // Simulate initial loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Filter Logic
    const filteredSales = useMemo(() => {
        return sales.filter(sale => {
            // Status filter
            if (statusFilter !== "all" && sale.status !== statusFilter) return false;

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchInvoice = sale.invoiceNumber.toLowerCase().includes(query);
                const matchCustomer = sale.customer?.name.toLowerCase().includes(query) || false;
                if (!matchInvoice && !matchCustomer) return false;
            }

            // Date filter (Simplified for mock purposes)
            if (dateFilter !== "all") {
                const saleDate = new Date(sale.date);
                const today = new Date();
                if (dateFilter === "today") {
                    if (saleDate.toDateString() !== today.toDateString()) return false;
                }
            }

            return true;
        });
    }, [sales, searchQuery, dateFilter, statusFilter]);

    // Stats
    const stats = useMemo(() => calculateStats(filteredSales), [filteredSales]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
    const paginatedSales = filteredSales.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            exportToCSV(filteredSales);
            setIsExporting(false);
        }, 600);
    };

    const handleConfirmRefund = (saleId: string, refundedItemIds: string[], reason: string) => {
        // Mock refund logic
        setSales(prev => prev.map(s => {
            if (s.id === saleId) {
                return {
                    ...s,
                    status: refundedItemIds.length === s.items.length ? 'refunded' : 'partially_refunded',
                    refundReason: reason
                };
            }
            return s;
        }));
    };

    return (
        <div className="space-y-6 w-full pb-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1.5">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Ventes</h1>
                    <p className="text-[13px] text-slate-500 font-medium">
                        Suivi détaillé et gestion de votre historique transactionnel.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportButton onExport={handleExport} isLoading={isExporting} />
                </div>
            </div>

            <SaleStats
                totalRevenue={stats.totalRevenue}
                totalSalesCount={stats.totalSalesCount}
                todayRevenue={stats.todaySalesCount}
                averageSaleAmount={stats.averageSaleAmount}
            />

            <div className="container-none space-y-4 p-4 border border-border rounded-lg bg-background shadow-sm overflow-x-auto">
                <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                    <SalesSearch value={searchQuery} onChange={setSearchQuery} />

                    <div className="flex gap-2 items-center">
                        <SalesFilters
                            dateFilter={dateFilter}
                            onDateFilterChange={setDateFilter}
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                        />

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

                <div className="overflow-x-auto overflow-y-hidden">
                    <SalesTable
                        sales={paginatedSales}
                        isLoading={isLoading}
                        onViewDetails={setSelectedSaleDetail}
                        onRefund={setSelectedSaleRefund}
                        visibleColumns={visibleColumns}
                    />
                </div>
            </div>

            {totalPages > 1 && (
                <div className="pt-4 flex justify-between items-center text-sm text-slate-500 font-medium px-4">
                    <div>
                        Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredSales.length)} sur {filteredSales.length} ventes
                    </div>
                        <Pagination className="justify-end cursor-pointer">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    />
                                </PaginationItem>
                                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            isActive={currentPage === i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                {totalPages > 5 && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}
                                <PaginationItem>
                                    <PaginationNext
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

            <SaleDetailModal
                sale={selectedSaleDetail}
                isOpen={!!selectedSaleDetail}
                onClose={() => setSelectedSaleDetail(null)}
                onRefund={(s) => {
                    setSelectedSaleDetail(null);
                    setSelectedSaleRefund(s);
                }}
            />

            <RefundModal
                sale={selectedSaleRefund}
                isOpen={!!selectedSaleRefund}
                onClose={() => setSelectedSaleRefund(null)}
                onConfirmRefund={handleConfirmRefund}
            />
        </div>
    );
}
