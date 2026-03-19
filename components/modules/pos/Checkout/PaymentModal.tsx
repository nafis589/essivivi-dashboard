"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { PaymentMethod } from "@/lib/types/pos";
import { PaymentMethods } from "./PaymentMethods";
import { CashPayment } from "./CashPayment";
import { MobilePayment } from "./MobilePayment";
import { CardPayment } from "./CardPayment";
import { Receipt } from "./Receipt";
import { useCartStore } from "@/lib/store/useCartStore";
import { SaleRecord } from "@/lib/types/pos";
import { cn } from "@/lib/utils";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = "method" | "details" | "receipt";

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
    const [method, setMethod] = useState<PaymentMethod>("cash");
    const [step, setStep] = useState<Step>("method");
    const [sale, setSale] = useState<SaleRecord | null>(null);

    const clearCart = useCartStore((state) => state.clearCart);
    const recordSale = useCartStore((state) => state.recordSale);

    const handleMethodNext = () => setStep("details");

    const handlePaymentConfirm = () => {
        const newSale = recordSale(method);
        setSale(newSale);
        setStep("receipt");
    };

    const handleNewSale = () => {
        clearCart();
        setSale(null);
        setStep("method");
        setMethod("cash");
        onClose();
    };

    const handleClose = () => {
        if (step === "receipt") {
            handleNewSale();
        } else {
            onClose();
        }
    };

    const handleBack = () => {
        if (step === "details") setStep("method");
    };

    // Step indicator
    const steps = [
        { key: "method", label: "Mode" },
        { key: "details", label: "Détails" },
        { key: "receipt", label: "Reçu" },
    ] as const;
    const currentStepIdx = steps.findIndex((s) => s.key === step);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent
                className="sm:max-w-lg max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden"
                aria-label="Modal de paiement"
            >
                {/* Step indicator header */}
                <div className="shrink-0 px-6 pt-5 pb-4 border-b bg-card">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-bold text-lg">
                            {step === "method" && "Mode de paiement"}
                            {step === "details" && "Finaliser le paiement"}
                            {step === "receipt" && "Paiement réussi !"}
                        </h2>
                    </div>

                    {/* Steps bar */}
                    <div className="flex items-center gap-0">
                        {steps.map((s, i) => (
                            <div key={s.key} className="flex items-center flex-1">
                                <div className="flex flex-col items-center gap-1 flex-1">
                                    <div
                                        className={cn(
                                            "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                                            i < currentStepIdx
                                                ? "bg-primary border-primary text-primary-foreground"
                                                : i === currentStepIdx
                                                    ? "bg-primary border-primary text-primary-foreground scale-110 shadow-md shadow-primary/30"
                                                    : "bg-muted border-border text-muted-foreground"
                                        )}
                                    >
                                        {i < currentStepIdx ? "✓" : i + 1}
                                    </div>
                                    <span
                                        className={cn(
                                            "text-[10px] font-medium",
                                            i <= currentStepIdx ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div
                                        className={cn(
                                            "flex-1 h-0.5 mt-[-14px] mx-1 transition-colors",
                                            i < currentStepIdx ? "bg-primary" : "bg-border"
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {step === "method" && (
                        <PaymentMethods
                            method={method}
                            onSelect={setMethod}
                            onNext={handleMethodNext}
                        />
                    )}

                    {step === "details" && (
                        <>
                            {method === "cash" && (
                                <CashPayment onConfirm={handlePaymentConfirm} onBack={handleBack} />
                            )}
                            {method === "mobile" && (
                                <MobilePayment onConfirm={handlePaymentConfirm} onBack={handleBack} />
                            )}
                            {method === "card" && (
                                <CardPayment onConfirm={handlePaymentConfirm} onBack={handleBack} />
                            )}
                        </>
                    )}

                    {step === "receipt" && sale && (
                        <Receipt sale={sale} onNewSale={handleNewSale} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
