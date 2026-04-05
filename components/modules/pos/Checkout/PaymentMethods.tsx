"use client";

import type { PaymentMethod } from "@/lib/types/pos.types";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, Smartphone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const methods: {
    key: PaymentMethod;
    label: string;
    sublabel: string;
    Icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    disabled?: boolean;
}[] = [
        {
            key: "CASH",
            label: "Espèces",
            sublabel: "Paiement en numéraire",
            Icon: Banknote,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
            borderColor: "border-emerald-200 dark:border-emerald-800",
        },
        {
            key: "MOBILE_MONEY",
            label: "Mobile Money",
            sublabel: "Bientôt disponible",
            Icon: Smartphone,
            color: "text-muted-foreground",
            bgColor: "bg-muted/50",
            borderColor: "border-border",
            disabled: true,
        },
        {
            key: "CARD",
            label: "Carte bancaire",
            sublabel: "Bientôt disponible",
            Icon: CreditCard,
            color: "text-muted-foreground",
            bgColor: "bg-muted/50",
            borderColor: "border-border",
            disabled: true,
        },
    ];

interface PaymentMethodsProps {
    method: PaymentMethod;
    onSelect: (method: PaymentMethod) => void;
    onNext: () => void;
}

export function PaymentMethods({ method, onSelect, onNext }: PaymentMethodsProps) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Choisissez comment le client souhaite payer.
            </p>

            <div className="grid gap-3">
                {methods.map(({ key, label, sublabel, Icon, color, bgColor, borderColor, disabled }) => {
                    const isActive = method === key;
                    return (
                        <button
                            key={key}
                            onClick={() => !disabled && onSelect(key)}
                            disabled={disabled}
                            aria-pressed={isActive}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-xl border-2 text-left w-full",
                                "transition-all duration-150",
                                disabled ? "opacity-50 cursor-not-allowed bg-muted/20" : "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                isActive
                                    ? `${bgColor} ${borderColor} shadow-sm`
                                    : disabled
                                        ? "border-muted"
                                        : "border-border hover:border-primary/30 hover:bg-muted/30 bg-card"
                            )}
                        >
                            <div
                                className={cn(
                                    "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
                                    isActive ? bgColor : "bg-muted/50"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "h-5 w-5 transition-colors",
                                        isActive ? color : "text-muted-foreground"
                                    )}
                                />
                            </div>
                            <div className="flex-1">
                                <p
                                    className={cn(
                                        "font-semibold text-sm transition-colors",
                                        isActive ? "text-foreground" : "text-foreground/80"
                                    )}
                                >
                                    {label}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
                            </div>
                            {!disabled && (
                                <div
                                    className={cn(
                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                        isActive
                                            ? "border-primary bg-primary"
                                            : "border-muted-foreground/30 bg-transparent"
                                    )}
                                >
                                    {isActive && (
                                        <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                                    )}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <Button
                className="w-full h-12 font-semibold mt-2"
                onClick={onNext}
            >
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    );
}
