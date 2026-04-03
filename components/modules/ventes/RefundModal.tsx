"use client";

import { Sale } from "@/lib/modules/ventes/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/modules/ventes/utils";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface RefundModalProps {
    sale: Sale | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirmRefund: (saleId: number, reason: string) => void;
}

export function RefundModal({ sale, isOpen, onClose, onConfirmRefund }: RefundModalProps) {
    const [reason, setReason] = useState("");

    if (!sale) return null;

    const handleConfirm = () => {
        onConfirmRefund(sale.id, reason);
        onClose();
        setReason("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white border-slate-200 rounded-2xl shadow-xl overflow-hidden p-0">
                <div className="bg-rose-50/50 p-6 border-b border-rose-100 flex flex-col gap-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/50 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
                    <DialogTitle className="text-xl font-semibold text-rose-900 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-rose-600" />
                        Annuler / Rembourser
                    </DialogTitle>
                    <DialogDescription className="text-rose-700/80 font-medium">
                        Facture {sale.invoiceNumber}
                    </DialogDescription>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-sm text-slate-600">
                        Voulez-vous vraiment annuler cette vente ? L'inventaire sera mis à jour et les statistiques décrémentées.
                    </p>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-inner">
                        <span className="text-sm font-medium text-slate-600">Montant total</span>
                        <span className="text-xl font-bold text-rose-600">{formatCurrency(sale.total)}</span>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3 sm:gap-2">
                    <Button variant="outline" onClick={onClose} className="h-10 border-slate-200 font-medium">
                        Retour
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        className="h-10 bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm"
                    >
                        Confirmer l'annulation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
