"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function CartSummary() {
    const subtotal = useCartStore((state) => state.subtotal);
    const tax = useCartStore((state) => state.tax);
    const total = useCartStore((state) => state.total);
    const itemCount = useCartStore((state) => state.itemCount);

    return (
        <div className="space-y-1.5 py-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                    Sous-total
                    <span className="ml-1 text-xs">({itemCount} article{itemCount > 1 ? "s" : ""})</span>
                </span>
                <span className="tabular-nums font-medium">{subtotal.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">TVA (10%)</span>
                <span className="tabular-nums text-muted-foreground">+{tax.toLocaleString()} FCFA</span>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between items-center">
                <span className="font-bold text-base">Total TTC</span>
                <div className="text-right">
                    <span className={cn(
                        "font-black text-xl tabular-nums text-primary",
                    )}>
                        {total.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground ml-1">FCFA</span>
                </div>
            </div>
        </div>
    );
}
