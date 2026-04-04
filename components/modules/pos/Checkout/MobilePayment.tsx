"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/store/useCartStore";
import {
    Smartphone,
    ArrowLeft,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobilePaymentProps {
    onConfirm: () => void;
    onBack: () => void;
    isSubmitting?: boolean;
}

type Operator = "orange" | "moov" | "mtn";

const operators: {
    key: Operator;
    label: string;
    color: string;
    bg: string;
    activeBg: string;
    border: string;
}[] = [
        {
            key: "orange",
            label: "🍊 Orange Money",
            color: "text-orange-600",
            bg: "bg-orange-50 dark:bg-orange-950/20",
            activeBg: "bg-orange-500 text-white border-orange-500",
            border: "border-orange-200 dark:border-orange-800",
        },
        {
            key: "moov",
            label: "🔵 Moov Money",
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-950/20",
            activeBg: "bg-blue-600 text-white border-blue-600",
            border: "border-blue-200 dark:border-blue-800",
        },
        {
            key: "mtn",
            label: "🟡 MTN MoMo",
            color: "text-yellow-600",
            bg: "bg-yellow-50 dark:bg-yellow-950/20",
            activeBg: "bg-yellow-400 text-black border-yellow-400",
            border: "border-yellow-200 dark:border-yellow-700",
        },
    ];

export function MobilePayment({ onConfirm, onBack, isSubmitting = false }: MobilePaymentProps) {
    const total = useCartStore((state) => state.total);
    const [operator, setOperator] = useState<Operator | null>(null);
    const [phone, setPhone] = useState("");

    const isValid = !!operator && phone.replace(/\D/g, "").length >= 8;

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <div className="space-y-5">
            {/* Amount summary */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Montant à débiter</p>
                        <p className="font-black text-2xl tabular-nums">
                            {total.toLocaleString()}
                            <span className="text-sm font-medium text-muted-foreground ml-1">FCFA</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Operator selection */}
            <div className="space-y-2">
                <Label className="text-sm font-semibold">Opérateur Mobile Money</Label>
                <div className="grid grid-cols-3 gap-2">
                    {operators.map((op) => {
                        const isActive = operator === op.key;
                        return (
                            <button
                                key={op.key}
                                onClick={() => setOperator(op.key)}
                                aria-pressed={isActive}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1.5 h-16 rounded-xl border-2 text-center font-semibold text-sm",
                                    "transition-all duration-150 cursor-pointer",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                    isActive ? op.activeBg : `${op.bg} ${op.border} hover:opacity-80`
                                )}
                            >
                                <span className="text-base leading-none">
                                    {op.label.split(" ")[0]}
                                </span>
                                <span className={cn("text-xs font-bold", isActive ? "" : op.color)}>
                                    {op.label.split(" ").slice(1).join(" ")}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Phone number */}
            <div className="space-y-2">
                <Label htmlFor="mobile-phone" className="text-sm font-semibold">
                    Numéro de téléphone
                </Label>
                <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        id="mobile-phone"
                        type="tel"
                        placeholder="Ex : 07 07 07 07 07"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-9 h-12 text-base font-medium tracking-widest"
                        disabled={isSubmitting}
                        aria-label="Numéro de téléphone Mobile Money"
                    />
                </div>
                {phone && phone.replace(/\D/g, "").length < 8 && (
                    <p className="text-xs text-red-500">Numéro trop court (8 chiffres minimum)</p>
                )}
            </div>



            {/* Actions */}
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    onClick={onBack}
                    disabled={isSubmitting}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Button>
                <Button
                    className="flex-1 h-12 font-bold cursor-pointer"
                    disabled={!isValid || isSubmitting}
                    onClick={handleConfirm}
                >
                    {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement…</>
                    ) : (
                        <><CheckCircle2 className="mr-2 h-4 w-4" />Envoyer la demande</>
                    )}
                </Button>
            </div>
        </div>
    );
}
