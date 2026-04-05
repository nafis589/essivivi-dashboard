"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import type { PaymentMethod, SaleRecord } from "@/lib/types/pos.types";
import { PaymentMethods } from "./PaymentMethods";
import { CashPayment } from "./CashPayment";
import { Receipt } from "./Receipt";
import { useCartStore } from "@/lib/store/useCartStore";
import { createPOSSale } from "@/lib/modules/pos/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = "method" | "details" | "receipt";

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
    const [method, setMethod] = useState<PaymentMethod>("CASH");
    const [step, setStep] = useState<Step>("method");
    const [sale, setSale] = useState<SaleRecord | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const items = useCartStore((state) => state.items);
    const selectedCustomer = useCartStore((state) => state.selectedCustomer);
    const clearCart = useCartStore((state) => state.clearCart);

    const handleMethodNext = () => setStep("details");

    const handlePaymentConfirm = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const payload = {
                customerId: selectedCustomer?.id ?? null,
                items: items.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
                paymentMethod: method,
            };

            const response = await createPOSSale(payload);

            if (response.success && response.data) {
                const apiSale = response.data;

                // Construire le SaleRecord à partir de la réponse API
                const newSale: SaleRecord = {
                    id: apiSale.id,
                    invoiceNumber: apiSale.invoiceNumber,
                    items: apiSale.items.map((item) => ({
                        id: item.id,
                        productId: item.productId,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total,
                    })),
                    subtotal: apiSale.subtotal,
                    tax: apiSale.tax,
                    total: apiSale.total,
                    customerId: apiSale.customer?.id ?? null,
                    customerName: apiSale.customer?.name ?? null,
                    customerPhone: apiSale.customer?.phone ?? null,
                    paymentMethod: method,
                    createdAt: apiSale.createdAt,
                    status: apiSale.status,
                };

                setSale(newSale);
                setStep("receipt");
                toast.success(response.message || "Vente enregistrée avec succès");
            }
        } catch (err: unknown) {
            const msg = err && typeof err === "object" && "message" in err
                ? String((err as { message: string }).message)
                : "Impossible d'enregistrer la vente";
            toast.error("Erreur", { description: msg });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNewSale = () => {
        clearCart();
        setSale(null);
        setStep("method");
        setMethod("CASH");
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
                <DialogTitle className="sr-only">Paiement</DialogTitle>
                {/* Step indicator header */}
                <div className="shrink-0 px-6 pt-5 pb-4 bg-card">
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
                            {method === "CASH" && (
                                <CashPayment
                                    onConfirm={handlePaymentConfirm}
                                    onBack={handleBack}
                                    isSubmitting={isSubmitting}
                                />
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
