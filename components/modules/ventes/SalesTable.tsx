import { Sale } from "@/lib/modules/ventes/types";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { SalesTableRow } from "./SalesTableRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SalesTableProps {
    sales: Sale[];
    isLoading: boolean;
    onViewDetails: (sale: Sale) => void;
    onRefund: (sale: Sale) => void;
}

export function SalesTable({ sales, isLoading, onViewDetails, onRefund }: SalesTableProps) {
    if (isLoading) {
        return (
            <div className="bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="text-slate-500 font-medium py-3.5 pl-4 pr-6">N° Facture</TableHead>
                            <TableHead className="text-slate-500 font-medium py-3.5">Date / Heure</TableHead>
                            <TableHead className="text-slate-500 font-medium py-3.5">Client</TableHead>
                            <TableHead className="text-slate-500 font-medium py-3.5">Articles</TableHead>
                            <TableHead className="text-slate-500 font-medium py-3.5">Total</TableHead>
                            <TableHead className="text-slate-500 font-medium py-3.5">Paiement</TableHead>
                            <TableHead className="text-slate-500 font-medium py-3.5">Statut</TableHead>
                            <TableHead className="text-right py-3.5 pr-4"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell className="py-4"><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell className="py-4"><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell className="py-4"><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell className="py-4"><Skeleton className="h-4 w-8" /></TableCell>
                                <TableCell className="py-4"><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell className="py-4"><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell className="py-4"><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                <TableCell className="py-4"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (sales.length === 0) {
        return (
            <div className="border border-slate-200 border-dashed rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                    <Receipt className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Aucune vente trouvée</h3>
                <p className="text-slate-500 max-w-sm mb-6">
                    Il n'y a pas d'historique de transaction correspondant à vos critères actuels.
                </p>
                <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors rounded-lg font-medium px-6">
                    Aller à la caisse pour vendre
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50/50 border-b border-slate-200/60">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 pl-4 pr-6">N° Facture</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 px-6">Date / Heure</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 px-6">Client</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 px-6">Articles</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 px-6">Total</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 px-6">Paiement</TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 px-6">Statut</TableHead>
                        <TableHead className="text-right text-[11px] uppercase tracking-wider font-bold text-slate-500 h-10 py-0 pr-4">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sales.map((sale) => (
                        <SalesTableRow
                            key={sale.id}
                            sale={sale}
                            onViewDetails={onViewDetails}
                            onRefund={onRefund}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
