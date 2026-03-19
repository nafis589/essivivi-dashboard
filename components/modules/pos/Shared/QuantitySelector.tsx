"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    min?: number;
    max?: number;
    size?: "sm" | "md" | "lg";
}

export function QuantitySelector({
    quantity,
    onIncrease,
    onDecrease,
    min = 1,
    max,
    size = "md",
}: QuantitySelectorProps) {
    const btnSize = size === "lg" ? "h-9 w-9" : size === "sm" ? "h-6 w-6" : "h-7 w-7";
    const textSize = size === "lg" ? "text-xl w-14 font-bold" : size === "sm" ? "text-xs w-7" : "text-sm w-9";
    const iconSize = size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5";

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                className={cn(btnSize, "rounded-full shrink-0 transition-all")}
                onClick={onDecrease}
                disabled={quantity <= min}
                aria-label="Diminuer la quantité"
            >
                <Minus className={iconSize} />
            </Button>

            <span
                className={cn(
                    "text-center font-semibold tabular-nums transition-all",
                    textSize
                )}
                aria-live="polite"
                aria-label={`Quantité : ${quantity}`}
            >
                {quantity}
            </span>

            <Button
                variant="outline"
                size="icon"
                className={cn(btnSize, "rounded-full shrink-0 transition-all")}
                onClick={onIncrease}
                disabled={max !== undefined && quantity >= max}
                aria-label="Augmenter la quantité"
            >
                <Plus className={iconSize} />
            </Button>
        </div>
    );
}
