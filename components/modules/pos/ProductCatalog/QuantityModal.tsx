"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types/pos";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "../Shared/QuantitySelector";
import Image from "next/image";
import { getStockStatus } from "@/lib/types/pos";
import { cn } from "@/lib/utils";
import { PackagePlus } from "lucide-react";

interface QuantityModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (quantity: number) => void;
}

export function QuantityModal({
    product,
    isOpen,
    onClose,
    onConfirm,
}: QuantityModalProps) {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (isOpen) setQuantity(1);
    }, [isOpen]);

    if (!product) return null;

    const status = getStockStatus(product);
    const total = product.price * quantity;

    const handleConfirm = () => {
        onConfirm(quantity);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <PackagePlus className="h-4 w-4 text-primary" />
                        Choisir la quantité
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Appuyez sur Entrée pour confirmer
                    </DialogDescription>
                </DialogHeader>

                {/* Product preview */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-2 leading-tight">
                            {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {product.price.toLocaleString()} FCFA / {product.unit ?? "pièce"}
                        </p>
                        <p
                            className={cn(
                                "text-xs font-medium mt-1",
                                status === "low" ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                            )}
                        >
                            Stock disponible : {product.stock}
                        </p>
                    </div>
                </div>

                <div className="py-2 flex flex-col items-center gap-4">
                    <QuantitySelector
                        quantity={quantity}
                        onIncrease={() => setQuantity((q) => q + 1)}
                        onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                        max={product.stock}
                        min={1}
                        size="lg"
                    />

                    {/* Total preview */}
                    <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-primary/5 border border-primary/20">
                        <span className="text-sm font-medium text-muted-foreground">
                            Total ({quantity} × {product.price.toLocaleString()})
                        </span>
                        <span className="font-bold text-primary">
                            {total.toLocaleString()} FCFA
                        </span>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Annuler
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="flex-1 bg-primary"
                        disabled={quantity < 1}
                    >
                        Ajouter au panier
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
