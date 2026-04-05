"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/store/useCartStore";
import { Banknote, Coins, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CashPaymentProps {
    onConfirm: () => void;
    onBack: () => void;
    isSubmitting?: boolean;
}

const ROUND_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000, 50000];

export function CashPayment({ onConfirm, onBack, isSubmitting = false }: CashPaymentProps) {
    const total = useCartStore((state) => state.total);
    const [received, setReceived] = useState<string>(total.toString());

    const receivedNum = parseFloat(received.replace(/\s/g, "")) || 0;
    const change = Math.max(0, receivedNum - total);
    const isValid = receivedNum >= total;

    // Quick amounts: exact + rounded up amounts
    const quickAmounts = Array.from(
        new Set([
            total,
            ...ROUND_AMOUNTS.filter((a) => a >= total),
        ])
    )
        .sort((a, b) => a - b)
        .slice(0, 5);

    return (
        <div className="space-y-5">
            {/* Amount to pay */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                        <Banknote className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Montant total</p>
                        <p className="font-black text-2xl text-foreground tabular-nums">
                            {total.toLocaleString()}
                            <span className="text-sm font-medium text-muted-foreground ml-1">FCFA</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Received amount */}
            <div className="space-y-2">
                <Label htmlFor="cash-received" className="text-sm font-semibold">
                    Montant reçu
                </Label>
                <div className="relative">
                    <Input
                        id="cash-received"
                        type="number"
                        value={received}
                        onChange={(e) => setReceived(e.target.value)}
                        className={cn(
                            "text-right text-2xl font-bold h-14 pr-16 tabular-nums",
                            "transition-colors",
                            !isValid && receivedNum > 0
                                ? "border-red-400 focus-visible:ring-red-400"
                                : isValid
                                    ? "border-emerald-400 focus-visible:ring-emerald-400"
                                    : ""
                        )}
                        min={0}
                        autoFocus
                        aria-label="Montant reçu du client"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none">
                        FCFA
                    </span>
                </div>
            </div>

            {/* Change display */}
            <div
                className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                    isValid
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                        : "bg-muted/30 border-border"
                )}
            >
                <div className="flex items-center gap-2">
                    <Coins
                        className={cn(
                            "h-5 w-5 transition-colors",
                            isValid ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                        )}
                    />
                    <span className="font-semibold text-sm">Monnaie à rendre</span>
                </div>
                <span
                    className={cn(
                        "text-2xl font-black tabular-nums transition-all",
                        isValid ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                    )}
                >
                    {change.toLocaleString()}
                    <span className="text-sm font-medium ml-1">F</span>
                </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
                <Button
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    onClick={onBack}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Button>
                <Button
                    className="flex-2 h-12 font-bold flex-1 cursor-pointer"
                    disabled={!isValid || isSubmitting}
                    onClick={onConfirm}
                >
                    {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement…</>
                    ) : (
                        <><CheckCircle2 className="mr-2 h-4 w-4" />Valider le paiement</>
                    )}
                </Button>
            </div>
        </div>
    );
}
