"use client";

import Image from "next/image";
import { CartItem as CartItemType } from "@/lib/types/pos";
import { useCartStore } from "@/lib/store/useCartStore";
import { QuantitySelector } from "../Shared/QuantitySelector";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    const lineTotal = item.product.price * item.quantity;
    const isMaxStock = item.quantity >= item.product.stock;

    return (
        <div className={cn(
            "group flex items-start gap-2.5 px-3 py-2.5 border-b border-border/50",
            "hover:bg-muted/30 transition-colors",
            "last:border-b-0"
        )}>
            {/* Product image */}
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                    <h4 className="font-medium text-sm leading-tight line-clamp-2 text-foreground flex-1">
                        {item.product.name}
                    </h4>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded shrink-0 -mt-0.5 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Supprimer ${item.product.name}`}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-0.5">
                    {item.product.price.toLocaleString()} FCFA / {item.product.unit ?? "u"}
                </p>

                {/* Bottom row: qty selector + total */}
                <div className="flex items-center justify-between mt-2">
                    <QuantitySelector
                        quantity={item.quantity}
                        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                        max={item.product.stock}
                        min={0}
                        size="sm"
                    />

                    <div className="text-right">
                        <p className="font-semibold text-sm tabular-nums">
                            {lineTotal.toLocaleString()}
                            <span className="text-[10px] font-normal text-muted-foreground ml-0.5">F</span>
                        </p>
                        {isMaxStock && (
                            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                Max. stock
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
