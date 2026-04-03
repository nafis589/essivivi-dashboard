"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Sale, SalesStats } from "@/lib/modules/ventes/types";
import { fetchSales, getSalesStats, deleteSale, getSaleDetails } from "@/lib/modules/ventes/api";
import { exportToCSV } from "@/lib/modules/ventes/utils";
import { SaleStats } from "./SaleStats";
import { SalesSearch } from "./SalesSearch";
import { ExportButton } from "./ExportButton";
import { SalesTable } from "./SalesTable";
import { SaleDetailModal } from "./SaleDetailModal";
import { RefundModal } from "./RefundModal";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

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
    const [sales, setSales] = useState<Sale[]>([]);
    const [stats, setStats] = useState<SalesStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Filters state
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;

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

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Setup filter params matching API documentation
            const params: any = {
                page: currentPage,
                limit: itemsPerPage,
            };

            if (searchQuery) params.search = searchQuery;
            if (statusFilter !== "all" && statusFilter !== "") params.status = statusFilter;
            
            if (dateFilter !== "all") {
                const today = new Date().toISOString().split('T')[0];
                if (dateFilter === "today") {
                    params.startDate = today;
                    params.endDate = today;
                }
                // Handle a full custom date strategy here if need be...
            }

            const [salesRes, statsRes] = await Promise.all([
                fetchSales(params),
                getSalesStats()
            ]);

            setSales(salesRes.data || []);
            setTotalItems(salesRes.pagination?.total || 0);
            setTotalPages(Math.ceil((salesRes.pagination?.total || 0) / itemsPerPage));
            setStats(statsRes);
        } catch (error) {
            console.error("Failed to fetch sales data", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, itemsPerPage, searchQuery, statusFilter, dateFilter]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            // Export the current loaded sales for now. In real-world, might fetch ALL and export.
            exportToCSV(sales);
            setIsExporting(false);
        }, 600);
    };

    const handleViewDetails = async (sale: Sale) => {
        try {
            // The list view doesn't have details like `items`. We hit the detail endpoint.
            const fullSale = await getSaleDetails(sale.id);
            setSelectedSaleDetail(fullSale);
        } catch (error) {
            console.error(error);
            // Fallback to what we have or show error toast
            setSelectedSaleDetail(sale);
        }
    }

    const handleConfirmRefund = async (saleId: number, reason: string) => {
        try {
            await deleteSale(saleId);
            // Reload the list & stats
            loadData();
        } catch (error) {
            console.error("Failed to delete/refund sale", error);
        }
    };

    return (
        <div className="space-y-6 w-full pb-8">
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
                totalRevenue={stats?.totalRevenue || 0}
                totalSalesCount={stats?.totalSales || 0}
                todayRevenue={stats?.todayRevenue || 0}
                averageSaleAmount={stats?.averageOrder || 0}
            />

            <div className="container-none space-y-4 p-4 border border-border rounded-lg bg-white shadow-sm overflow-x-auto">
                <div className="flex flex-wrap gap-4 items-center justify-between p-3 mb-4 bg-slate-50 rounded-lg border border-slate-200/60">
                    <SalesSearch value={searchQuery} onChange={setSearchQuery} />

                    <div className="flex gap-2 items-center">
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
                            onClick={loadData} 
                            className="bg-white h-9 w-9"
                        >
                            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-hidden">
                    <SalesTable
                        sales={sales}
                        isLoading={isLoading}
                        onViewDetails={handleViewDetails}
                        onRefund={setSelectedSaleRefund}
                        visibleColumns={visibleColumns}
                    />
                </div>
            </div>

            {totalPages > 1 && (
                <div className="pt-4 flex justify-between items-center text-sm text-slate-500 font-medium px-4">
                    <div>
                        Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, totalItems)} sur {totalItems} ventes
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
