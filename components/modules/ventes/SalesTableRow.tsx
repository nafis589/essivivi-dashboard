import { Sale } from "@/lib/modules/ventes/types";
import { formatCurrency, formatDateTime } from "@/lib/modules/ventes/utils";
import { TableCell, TableRow } from "@/components/ui/table";
import { SaleStatusBadge } from "./SaleStatusBadge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Banknote, CreditCard, Smartphone, Check, FileText, Undo2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface SalesTableRowProps {
    sale: Sale;
    onViewDetails: (sale: Sale) => void;
    onRefund: (sale: Sale) => void;
}

export function SalesTableRow({ sale, onViewDetails, onRefund }: SalesTableRowProps) {
    const PaymentIcon = sale.paymentMethod === 'cash' ? Banknote : sale.paymentMethod === 'card' ? CreditCard : Smartphone;
    const paymentLabel = sale.paymentMethod === 'cash' ? 'Espèces' : sale.paymentMethod === 'card' ? 'Carte' : 'Mobile';

    // Generate initial for avatar
    const nameStr = sale.customer?.name || "Anonyme";
    const initial = nameStr.charAt(0).toUpperCase();

    return (
        <TableRow className="group hover:bg-slate-50/50 transition-all duration-200 border-b border-slate-100 last:border-0">
            <TableCell className="font-semibold text-slate-800 py-5 pl-4 pr-6">
                <div className="flex items-center space-x-2">
                    <span className="text-[13px] font-mono tracking-tight text-slate-700">{sale.invoiceNumber}</span>
                </div>
            </TableCell>
            <TableCell className="text-slate-500 py-5 px-6">
                <div className="flex flex-col">
                    <span className="text-[13px] text-slate-700 font-medium">{formatDateTime(sale.date).split(' ')[0]}</span>
                    <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{formatDateTime(sale.date).split(' ')[1] || sale.date.split('T')[1].substring(0, 5)}</span>
                </div>
            </TableCell>
            <TableCell className="py-5 px-6">
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100/80 border border-slate-200/60 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
                        <span className="text-slate-600 font-semibold text-[10px] group-hover:text-indigo-600 transition-colors">{initial}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{nameStr}</span>
                        {sale.customer?.phone && <span className="text-[11px] text-slate-400">{sale.customer.phone}</span>}
                    </div>
                </div>
            </TableCell>
            <TableCell className="text-slate-600 py-5 px-6">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-slate-100/80 border border-slate-200/50 text-[10px] font-semibold text-slate-600 uppercase tracking-tight">
                    {sale.items.reduce((acc, item) => acc + item.quantity, 0)} {sale.items.reduce((acc, item) => acc + item.quantity, 0) > 1 ? 'articles' : 'article'}
                </span>
            </TableCell>
            <TableCell className="font-semibold text-slate-900 py-5 px-6">
                <span className="text-[13px]">{formatCurrency(sale.total)}</span>
            </TableCell>
            <TableCell className="py-5 px-6">
                <div className="flex items-center text-slate-500 gap-2">
                    <PaymentIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-medium uppercase tracking-wider">{paymentLabel}</span>
                </div>
            </TableCell>
            <TableCell className="py-5 px-6">
                <SaleStatusBadge status={sale.status} />
            </TableCell>
            <TableCell className="text-right py-5 pr-4">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm transition-all" onClick={() => onViewDetails(sale)}>
                        <FileText className="h-3.5 w-3.5" />
                    </Button>
                    {sale.status !== 'refunded' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-white border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm transition-all" onClick={() => onRefund(sale)}>
                            <Undo2 className="h-3.5 w-3.5" />
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white text-slate-400 hover:text-slate-800 border border-transparent hover:border-slate-200 transition-all ml-1">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] shadow-xl border-slate-200/60 rounded-xl p-1.5 backdrop-blur-xl bg-white/95">
                            <DropdownMenuLabel className="font-semibold text-[10px] tracking-widest uppercase text-slate-400 px-2 py-1.5">Options</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-100/80 my-1" />
                            <DropdownMenuItem onClick={() => onViewDetails(sale)} className="cursor-pointer font-medium text-slate-600 focus:text-indigo-600 focus:bg-indigo-50/50 rounded-lg py-2">
                                <FileText className="h-4 w-4 mr-2 opacity-70" />
                                Détails de la vente
                            </DropdownMenuItem>
                            {sale.status !== 'refunded' && (
                                <>
                                    <DropdownMenuItem
                                        className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50/80 font-medium rounded-lg py-2"
                                        onClick={() => onRefund(sale)}
                                    >
                                        <Undo2 className="h-4 w-4 mr-2 opacity-70" />
                                        Effectuer un remboursement
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </TableCell>
        </TableRow>
    );
}
