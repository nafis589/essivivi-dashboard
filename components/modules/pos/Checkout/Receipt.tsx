"use client";

import { SaleRecord } from "@/lib/types/pos";
import { MOCK_CUSTOMERS } from "@/lib/mock-data/pos";
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
    cash: { label: "Espèces", Icon: Banknote },
    mobile: { label: "Mobile Money", Icon: Smartphone },
    card: { label: "Carte bancaire", Icon: CreditCard },
};

interface ReceiptProps {
    sale: SaleRecord;
    onNewSale: () => void;
}

export function Receipt({ sale, onNewSale }: ReceiptProps) {
    const customer = sale.customerId
        ? MOCK_CUSTOMERS.find((c) => c.id === sale.customerId)
        : null;

    const { label: methodLabel, Icon: MethodIcon } = methodLabels[sale.paymentMethod] ?? {
        label: sale.paymentMethod,
        Icon: Banknote,
    };

    const formattedDate = new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(sale.createdAt instanceof Date ? sale.createdAt : new Date(sale.createdAt));

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
                    <span className="text-xs font-medium text-muted-foreground">{methodLabel}</span>
                </div>
            </div>

            {/* Ticket */}
            <div className="border rounded-xl overflow-hidden bg-card font-mono text-sm">
                {/* Ticket header */}
                <div className="bg-muted/40 px-4 py-3 text-center border-b">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Store className="h-4 w-4 text-primary" />
                        <p className="font-bold text-base not-italic font-sans">FLOWCOMMERCE</p>
                    </div>
                    <p className="text-muted-foreground text-xs">Abidjan, Côte d&apos;Ivoire</p>

                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <ReceiptIcon className="h-3 w-3" />
                            <span className="font-bold text-foreground">{sale.receiptNumber}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formattedDate}</span>
                        </div>
                    </div>

                    {customer && (
                        <div className="mt-1.5 text-xs font-medium">
                            Client : {customer.name}
                            {customer.phone && ` (${customer.phone})`}
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="px-4 py-3 space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground font-semibold pb-1 border-b">
                        <span>Article</span>
                        <span>Montant</span>
                    </div>
                    {sale.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-xs">
                            <span className="truncate max-w-[60%]">
                                {item.quantity}× {item.product.name}
                            </span>
                            <span className="tabular-nums font-medium">
                                {(item.product.price * item.quantity).toLocaleString()} F
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
                        <span>TVA 10%</span>
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
                    {sale.isOffline && (
                        <p className="text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                            ⚠ Vendu en mode hors-ligne — synchronisé ultérieurement
                        </p>
                    )}
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
