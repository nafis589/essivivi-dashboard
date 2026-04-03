"use client";

import { Sale } from "@/lib/modules/ventes/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatCurrency, formatDateTime } from "@/lib/modules/ventes/utils";
import { SaleStatusBadge } from "./SaleStatusBadge";
import { Button } from "@/components/ui/button";
import { User, Phone, Receipt, Banknote, CreditCard, Smartphone, Download, Printer, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SaleDetailModalProps {
    sale: Sale | null;
    isOpen: boolean;
    onClose: () => void;
    onRefund: (sale: Sale) => void;
}

export function SaleDetailModal({ sale, isOpen, onClose, onRefund }: SaleDetailModalProps) {
    if (!sale) return null;

    const paymentMethod = sale.payments?.[0]?.method || 'CASH';
    const PaymentIcon = paymentMethod === 'CASH' ? Banknote : paymentMethod === 'CARD' ? CreditCard : Smartphone;
    const paymentLabel = paymentMethod === 'CASH' ? 'Espèces' : paymentMethod === 'CARD' ? 'Carte bancaire' : 'Paiement mobile';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white border-slate-200 shadow-xl rounded-2xl">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <DialogHeader className="p-0 space-y-1">
                        <DialogTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-indigo-600" />
                            Commande {sale.invoiceNumber}
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-500">
                            Passée le {formatDateTime(sale.createdAt)}
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <SaleStatusBadge status={sale.status} />
                    </div>
                </div>

                <div className="p-6 grid grid-cols-2 gap-6 bg-white">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Informations client</h4>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-900">{sale.customer?.name || "Client Anonyme"}</span>
                                </div>
                                {sale.customer?.phone && (
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-sm">{sale.customer.phone}</span>
                                    </div>
                                )}
                                {sale.customer && (
                                    <Button variant="link" className="px-0 h-auto text-xs text-indigo-600 font-medium mt-1">
                                        Voir la fiche client
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Paiement</h4>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200">
                                    <PaymentIcon className="w-4 h-4 text-slate-600" />
                                </div>
                                <span className="text-sm font-medium text-slate-800">{paymentLabel}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col h-full">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Résumé de la commande</h4>

                        <div className="flex-1 space-y-3 overflow-y-auto max-h-[160px] pr-2 custom-scrollbar">
                            {(sale.items || []).map((item) => (
                                <div key={item.id} className="flex justify-between items-start text-sm">
                                    <div>
                                        <p className="font-medium text-slate-800">{item.name}</p>
                                        <p className="text-slate-500 text-xs">{item.quantity} x {formatCurrency(item.price)}</p>
                                        {(item.refundedQuantity ?? 0) > 0 && (
                                            <span className="text-rose-600 text-xs font-medium block mt-0.5">
                                                -{item.refundedQuantity} remboursé(s)
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-semibold text-slate-900">{formatCurrency(item.total)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col gap-1.5">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Sous-total</span>
                                <span>{formatCurrency(sale.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>TVA (10%)</span>
                                <span>{formatCurrency(sale.tax)}</span>
                            </div>
                            <div className="flex justify-between mt-2 pt-2 border-t border-slate-200">
                                <span className="font-semibold text-slate-900">Total payé</span>
                                <span className="font-bold text-slate-900 text-lg">{formatCurrency(sale.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-9 gap-1.5 border-slate-200 text-slate-700 font-medium">
                            <Printer className="w-4 h-4" />
                            Imprimer
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 gap-1.5 border-slate-200 text-slate-700 font-medium">
                            <Mail className="w-4 h-4" />
                            Email
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="h-9 border-slate-200">
                            Fermer
                        </Button>
                        {sale.status === 'COMPLETED' && (
                            <Button
                                variant="destructive"
                                className="h-9 bg-rose-600 hover:bg-rose-700 text-white font-medium"
                                onClick={() => {
                                    onClose();
                                    onRefund(sale);
                                }}
                            >
                                Rembourser
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
