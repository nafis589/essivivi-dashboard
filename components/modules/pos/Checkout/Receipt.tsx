"use client";

import type { SaleRecord } from "@/lib/types/pos.types";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    Printer,
    Share2,
    PlusCircle,
    Store,
    Calendar,
    Receipt as ReceiptIcon,
    Banknote,
    Smartphone,
    CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const methodLabels: Record<string, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
    CASH: { label: "Espèces", Icon: Banknote },
    MOBILE_MONEY: { label: "Mobile Money", Icon: Smartphone },
    CARD: { label: "Carte bancaire", Icon: CreditCard },
};

interface ReceiptProps {
    sale: SaleRecord;
    onNewSale: () => void;
}

export function Receipt({ sale, onNewSale }: ReceiptProps) {
    const { label: methodLabel, Icon: MethodIcon } = methodLabels[sale.paymentMethod] ?? {
        label: sale.paymentMethod,
        Icon: Banknote,
    };

    const formattedDate = new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(sale.createdAt));

    return (
        <div className="space-y-5">
            {/* Success banner */}
            <div className="flex flex-col items-center py-5 rounded-2xl bg-gradient-to-b from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <div className="h-14 w-14 bg-emerald-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <p className="text-base font-bold text-emerald-700 dark:text-emerald-400">Paiement réussi</p>
                <p className="text-3xl font-black text-foreground tabular-nums mt-1">
                    {sale.total.toLocaleString()}
                    <span className="text-base font-medium text-muted-foreground ml-1">FCFA</span>
                </p>
                <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-white/60 dark:bg-black/20 rounded-full">
                    <MethodIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {methodLabel}
                    </span>
                </div>
            </div>

            {/* Receipt ticket */}
            <div className="relative bg-card rounded-xl border shadow-sm overflow-hidden font-mono">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjMiPgo8cGF0aCBkPSJNMCAzdjBMMCAwaDEuNWwxIDJoM2wxLTJoMS41djNsLTQgM3oiIGZpbGw9IiNlN2U1ZTQiLz4KPC9zdmc+')] bg-repeat-x dark:opacity-20" />

                {/* Header */}
                <div className="pt-6 pb-4 px-4 text-center space-y-1">
                    <div className="flex items-center justify-center gap-2 mb-2 text-foreground">
                        <Store className="h-5 w-5" />
                        <span className="font-bold text-sm tracking-wide uppercase">FlowPOS HQ</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-4">
                        <span className="flex items-center gap-1">
                            <ReceiptIcon className="h-3.5 w-3.5" />
                            {sale.invoiceNumber}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formattedDate}
                        </span>
                    </div>
                    {sale.customerName && (
                        <div className="text-left mt-3 pt-3 border-t border-dashed text-xs text-muted-foreground">
                            <p>Client : <span className="font-semibold text-foreground">{sale.customerName}</span></p>
                            {sale.customerPhone && <p>Tél : {sale.customerPhone}</p>}
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="px-4 py-2 bg-muted/20 border-t border-b border-dashed space-y-3">
                    {sale.items.map((item) => (
                        <div key={item.productId} className="flex justify-between text-xs">
                            <div className="flex-1 pr-4">
                                <p className="font-medium text-foreground">{item.name}</p>
                                <p className="text-muted-foreground text-[10px] mt-0.5">
                                    {item.quantity} × {item.price.toLocaleString()} F
                                </p>
                            </div>
                            <span className="font-medium text-foreground tabular-nums">
                                {(item.quantity * item.price).toLocaleString()} F
                            </span>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t px-4 py-3 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Sous-total HT</span>
                        <span className="tabular-nums">{sale.subtotal.toLocaleString()} F</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Taxe</span>
                        <span className="tabular-nums">{sale.tax.toLocaleString()} F</span>
                    </div>
                    <Separator className="my-1.5" />
                    <div className="flex justify-between font-bold text-sm">
                        <span>TOTAL TTC</span>
                        <span className="tabular-nums">{sale.total.toLocaleString()} F</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-muted/30 px-4 py-2.5 text-center text-xs text-muted-foreground border-t">
                    Merci de votre confiance ! 🙏
                </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
                <Button
                    variant="outline"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => window.print()}
                >
                    <Printer className="h-4 w-4" />
                    Imprimer
                </Button>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => { }}
                >
                    <Share2 className="h-4 w-4" />
                    Envoyer SMS
                </Button>
            </div>

            <Button
                className="w-full h-12 font-bold cursor-pointer"
                onClick={onNewSale}
            >
                <PlusCircle className="mr-2 h-5 w-5" />
                Nouvelle vente
            </Button>
        </div>
    );
}
