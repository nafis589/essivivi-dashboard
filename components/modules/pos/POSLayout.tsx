"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useCartStore } from "@/lib/store/useCartStore";
import { ProductGrid } from "./ProductCatalog/ProductGrid";
import { Cart } from "./Cart/Cart";
import { OfflineIndicator } from "./Shared/OfflineIndicator";
import { PaymentModal } from "./Checkout/PaymentModal";
import { MOCK_PRODUCTS } from "@/lib/mock-data/pos";
import { Store, ShoppingCart, Keyboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function POSLayout() {
    const itemCount = useCartStore((state) => state.itemCount);
    const clearCart = useCartStore((state) => state.clearCart);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    // Global keyboard shortcuts
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // / → focus search
            if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
                e.preventDefault();
                searchRef.current?.focus();
                return;
            }
            // F8 → open payment
            if (e.key === "F8") {
                e.preventDefault();
                if (itemCount > 0) setIsPaymentOpen(true);
                return;
            }
            // Ctrl+Space → clear cart
            if (e.key === " " && e.ctrlKey) {
                e.preventDefault();
                if (itemCount > 0 && confirm("Vider le panier ?")) clearCart();
                return;
            }
            // Escape → close modal (handled by Dialog)
        },
        [itemCount, clearCart]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className={cn(
            "flex flex-col w-full bg-muted/20 overflow-hidden relative",
            "h-[calc(100vh-3.5rem)] -m-4 md:-m-6 lg:-m-8" // Annule le padding du AppShell (p-4, p-6, p-8)
        )}>
            {/* ── MAIN LAYOUT ───────────────────────────────────── */}
            <main className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden relative">
                {/* Catalog — 70% */}
                <div
                    className={cn(
                        "w-full md:w-[65%] lg:w-[70%] xl:w-[72%] h-full transition-all relative",
                        isCartVisible ? "hidden md:block" : "block"
                    )}
                >
                    <ProductGrid products={MOCK_PRODUCTS} searchRef={searchRef} />
                </div>

                {/* Cart — 30% */}
                <div
                    className={cn(
                        "w-full md:w-[35%] lg:w-[30%] xl:w-[28%] md:h-full z-20",
                        "border-t md:border-t-0 md:border-l border-border",
                        "bg-background shadow-xl md:shadow-none transition-transform",
                        // Mobile: always visible when toggled, or when viewing cart
                        isCartVisible ? "flex flex-col h-[calc(100vh-7rem)]" : "hidden md:flex md:flex-col"
                    )}
                >
                    <Cart
                        onPaymentOpen={() => setIsPaymentOpen(true)}
                        onBackToCatalog={() => setIsCartVisible(false)}
                    />
                </div>
            </main>

            {/* Mobile cart toggle (Floating Button) */}
            {!isCartVisible && (
                <button
                    onClick={() => setIsCartVisible(true)}
                    className="md:hidden fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center animate-in fade-in zoom-in duration-200"
                    aria-label="Afficher le panier"
                >
                    <ShoppingCart className="h-6 w-6" />
                    {itemCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-2 border-background">
                            {itemCount}
                        </Badge>
                    )}
                </button>
            )}

            {/* Payment Modal */}
            <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />
        </div>
    );
}
