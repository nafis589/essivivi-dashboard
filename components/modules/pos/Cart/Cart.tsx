"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { CustomerSelector } from "./CustomerSelector";
import { CartActions } from "./CartActions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CartProps {
    onPaymentOpen: () => void;
    onBackToCatalog?: () => void;
}

export function Cart({ onPaymentOpen, onBackToCatalog }: CartProps) {
    const items = useCartStore((state) => state.items);
    const itemCount = useCartStore((state) => state.itemCount);

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Cart header */}
            <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-card/50">
                <div className="flex items-center gap-2">
                    {/* Mobile back button */}
                    {onBackToCatalog && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 md:hidden mr-1 cursor-pointer"
                            onClick={onBackToCatalog}
                            aria-label="Retour au catalogue"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    <h2 className="font-bold text-sm">Panier</h2>
                    {itemCount > 0 && (
                        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                            {itemCount}
                        </span>
                    )}
                </div>
            </div>

            {/* Customer selector */}
            <div className="shrink-0 px-3 py-2.5 bg-card/20">
                <CustomerSelector />
            </div>

            {/* Items list */}
            <ScrollArea className="flex-1 min-h-0">
                {items.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-3 px-4">
                        <div
                            className={cn(
                                "h-16 w-16 rounded-full flex items-center justify-center",
                                "bg-muted/50"
                            )}
                        >
                            <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-sm text-foreground">Panier vide</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Cliquez sur un produit pour l'ajouter
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {items.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Footer: summary + actions */}
            <div className="shrink-0 border-t bg-card/50 px-3 pt-2 pb-3 space-y-2">
                <CartSummary />
                <CartActions onPaymentOpen={onPaymentOpen} />
            </div>
        </div>
    );
}
