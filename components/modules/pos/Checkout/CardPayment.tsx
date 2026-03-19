"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/store/useCartStore";
import { CreditCard, Nfc, CheckCircle2, ArrowLeft, Loader2, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardPaymentProps {
    onConfirm: () => void;
    onBack: () => void;
}

type CardStatus = "waiting" | "processing" | "success";

export function CardPayment({ onConfirm, onBack }: CardPaymentProps) {
    const total = useCartStore((state) => state.total);
    const [status, setStatus] = useState<CardStatus>("waiting");
    const [transactionRef, setTransactionRef] = useState("");
    const [hasRef, setHasRef] = useState(false);

    const handleSimulateTPE = () => {
        setStatus("processing");
        setTimeout(() => {
            setStatus("success");
            setTimeout(() => {
                onConfirm();
            }, 1500);
        }, 2500);
    };

    return (
        <div className="space-y-5">
            {/* Amount */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Montant à payer par carte</p>
                        <p className="font-black text-2xl tabular-nums">
                            {total.toLocaleString()}
                            <span className="text-sm font-medium text-muted-foreground ml-1">FCFA</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* TPE zone */}
            <div
                className={cn(
                    "h-44 w-full rounded-2xl border-2 transition-all duration-500 flex flex-col items-center justify-center gap-3 relative overflow-hidden",
                    status === "waiting" &&
                    "border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20",
                    status === "processing" &&
                    "border-blue-400 bg-blue-50 dark:bg-blue-950/30",
                    status === "success" &&
                    "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                )}
            >
                {status === "waiting" && (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/0 via-blue-100/20 to-blue-100/0 dark:from-blue-900/0 dark:via-blue-900/10 dark:to-blue-900/0 animate-pulse" />
                        <Nfc className="h-12 w-12 text-blue-500 animate-bounce" style={{ animationDuration: "2s" }} />
                        <div className="text-center">
                            <p className="font-semibold text-sm text-blue-700 dark:text-blue-400">
                                En attente du terminal de paiement
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Approchez ou insérez la carte
                            </p>
                        </div>
                    </>
                )}

                {status === "processing" && (
                    <>
                        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                        <div className="text-center">
                            <p className="font-semibold text-sm text-blue-700 dark:text-blue-400">
                                Traitement en cours…
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Ne retirez pas la carte
                            </p>
                        </div>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                        <div className="text-center">
                            <p className="font-bold text-lg text-emerald-700 dark:text-emerald-400">
                                Paiement accepté !
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Transaction approuvée
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Optional transaction reference */}
            {status === "waiting" && (
                <div className="space-y-2">
                    <button
                        onClick={() => setHasRef(!hasRef)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        <Hash className="h-3.5 w-3.5" />
                        {hasRef ? "Masquer" : "Ajouter un numéro de transaction (optionnel)"}
                    </button>
                    {hasRef && (
                        <div className="space-y-1.5">
                            <Label htmlFor="card-txn" className="text-xs">
                                Référence de transaction
                            </Label>
                            <Input
                                id="card-txn"
                                placeholder="Ex : TPE-2026-001234"
                                value={transactionRef}
                                onChange={(e) => setTransactionRef(e.target.value)}
                                className="h-10 text-sm font-mono"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Demo button */}
            {status === "waiting" && (
                <div className="p-3 rounded-lg bg-muted/40 border border-dashed text-center space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Mode démonstration</p>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="cursor-pointer"
                        onClick={handleSimulateTPE}
                    >
                        Simuler une carte (démo) →
                    </Button>
                </div>
            )}

            {/* Actions */}
            {status === "waiting" && (
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 cursor-pointer"
                        onClick={onBack}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                </div>
            )}
        </div>
    );
}
