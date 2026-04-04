"use client";

import Image from "next/image";
import type { POSProduct, StockStatus } from "@/lib/types/pos.types";
import { getStockStatus } from "@/lib/types/pos.types";
import { cn } from "@/lib/utils";
import { PlusCircle, Package } from "lucide-react";
import { useRef } from "react";

interface ProductCardProps {
    product: POSProduct;
    onClick: () => void;
    onLongPress: () => void;
}

const stockConfig: Record<StockStatus, { label: string; className: string }> = {
    ok: {
        label: "En stock",
        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    },
    low: {
        label: "Stock bas",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    },
    out: {
        label: "Rupture",
        className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    },
};

// Récupère la première image disponible (images[] ou imageUrl legacy)
function getProductImage(product: POSProduct): string | null {
    if (product.images && product.images.length > 0) {
        return product.images[0].url;
    }
    if (product.imageUrl) {
        return product.imageUrl;
    }
    return null;
}

export function ProductCard({ product, onClick, onLongPress }: ProductCardProps) {
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const didLongPress = useRef(false);

    const status = getStockStatus(product);
    const isOutOfStock = status === "out";
    const { label, className: stockClass } = stockConfig[status];
    const imageUrl = getProductImage(product);

    const startLongPress = () => {
        didLongPress.current = false;
        longPressTimer.current = setTimeout(() => {
            didLongPress.current = true;
            onLongPress();
        }, 500);
    };

    const cancelLongPress = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleClick = () => {
        if (!didLongPress.current) {
            onClick();
        }
    };

    return (
        <div
            role="button"
            tabIndex={isOutOfStock ? -1 : 0}
            aria-label={`${product.name} – ${product.price.toLocaleString()} FCFA – ${label}`}
            aria-disabled={isOutOfStock}
            className={cn(
                "group relative flex flex-col rounded-xl border bg-card overflow-hidden",
                "cursor-pointer select-none",
                "transition-all duration-200",
                "hover:shadow-md hover:shadow-primary/10 hover:border-primary/40 hover:-translate-y-0.5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isOutOfStock && "opacity-55 grayscale cursor-not-allowed pointer-events-none"
            )}
            onMouseDown={startLongPress}
            onMouseUp={cancelLongPress}
            onMouseLeave={cancelLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={cancelLongPress}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === "Enter") onClick();
                if (e.key === " ") { e.preventDefault(); onLongPress(); }
            }}
        >
            {/* Image area */}
            <div className="relative aspect-square w-full overflow-hidden bg-muted/40">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        unoptimized
                    />
                ) : (
                    /* Fallback quand l'image n'est pas disponible */
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                        <Package className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                )}

                {/* Stock badge */}
                <div className="absolute top-2 left-2">
                    <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full leading-none", stockClass)}>
                        <span className={cn(
                            "h-1.5 w-1.5 rounded-full flex-shrink-0",
                            status === "ok" ? "bg-emerald-500" : status === "low" ? "bg-amber-500" : "bg-red-500"
                        )} />
                        {status === "ok" ? `${product.stock}` : label}
                    </span>
                </div>

                {/* Add overlay on hover */}
                {!isOutOfStock && (
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="bg-primary rounded-full p-1.5 shadow-lg shadow-primary/30">
                                <PlusCircle className="h-5 w-5 text-primary-foreground" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Info area */}
            <div className="flex-1 p-2.5 flex flex-col gap-1">
                {product.category && (
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide leading-none font-medium truncate">
                        {product.category}
                    </p>
                )}
                <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-foreground">
                    {product.name}
                </h3>
                <div className="flex items-center justify-between mt-auto pt-1">
                    <p className="font-bold text-primary text-sm">
                        {product.price.toLocaleString()}
                        <span className="text-[10px] font-medium text-muted-foreground ml-0.5">FCFA</span>
                    </p>
                    {product.barcode && (
                        <span className="text-[10px] text-muted-foreground truncate max-w-[60px]">
                            {product.barcode}
                        </span>
                    )}
                </div>
            </div>

            {/* Long press hint */}
            {!isOutOfStock && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-active:via-primary/50 transition-all duration-300" />
            )}
        </div>
    );
}
