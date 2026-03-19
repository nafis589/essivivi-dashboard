"use client";

import { Sale, SaleItem } from "@/lib/modules/ventes/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/modules/ventes/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";

interface RefundModalProps {
    sale: Sale | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirmRefund: (saleId: string, refundedItemIds: string[], reason: string) => void;
}

export function RefundModal({ sale, isOpen, onClose, onConfirmRefund }: RefundModalProps) {
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
    const [reason, setReason] = useState("");

    // Reset state when sale changes
    useMemo(() => {
        if (sale) {
            setSelectedItemIds(sale.items.map(item => item.id)); // Select all by default
            setReason("");
        }
    }, [sale]);

    if (!sale) return null;

    const handleToggleItem = (itemId: string) => {
        setSelectedItemIds(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    const refundTotal = sale.items
        .filter(item => selectedItemIds.includes(item.id))
        .reduce((acc, item) => acc + item.total, 0);

    const handleConfirm = () => {
        onConfirmRefund(sale.id, selectedItemIds, reason);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white border-slate-200 rounded-2xl shadow-xl overflow-hidden p-0">
                <div className="bg-rose-50/50 p-6 border-b border-rose-100 flex flex-col gap-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/50 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
                    <DialogTitle className="text-xl font-semibold text-rose-900 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-rose-600" />
                        Remboursement
                    </DialogTitle>
                    <DialogDescription className="text-rose-700/80 font-medium">
                        Facture {sale.invoiceNumber}
                    </DialogDescription>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center justify-between">
                            Sélectionnez les articles à rembourser
                            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                {selectedItemIds.length}/{sale.items.length}
                            </span>
                        </h4>
                        <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                            {sale.items.map(item => (
                                <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer" onClick={() => handleToggleItem(item.id)}>
                                    <Checkbox
                                        id={item.id}
                                        checked={selectedItemIds.includes(item.id)}
                                        className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                        onCheckedChange={() => handleToggleItem(item.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="flex-1">
                                        <label htmlFor={item.id} className="text-sm font-medium text-slate-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                            {item.name}
                                        </label>
                                        <p className="text-xs text-slate-500 mt-1">Quantité: {item.quantity}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-900">
                                        {formatCurrency(item.total)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-inner">
                        <span className="text-sm font-medium text-slate-600">Montant total à rembourser</span>
                        <span className="text-xl font-bold text-rose-600">{formatCurrency(refundTotal)}</span>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="reason" className="text-sm font-medium text-slate-700">Raison du remboursement</label>
                        <Textarea
                            id="reason"
                            placeholder="Veuillez indiquer la raison du remboursement..."
                            className="resize-none h-24 border-slate-200 focus-visible:ring-rose-500 shadow-sm rounded-xl placeholder:text-slate-400"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3 sm:gap-2">
                    <Button variant="outline" onClick={onClose} className="h-10 border-slate-200 font-medium">
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={selectedItemIds.length === 0}
                        className="h-10 bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm"
                    >
                        Confirmer {formatCurrency(refundTotal)}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
