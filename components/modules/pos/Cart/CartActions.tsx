"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Trash2, CreditCard } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CartActionsProps {
    onPaymentOpen: () => void;
}

export function CartActions({ onPaymentOpen }: CartActionsProps) {
    const itemCount = useCartStore((state) => state.itemCount);
    const total = useCartStore((state) => state.total);
    const clearCart = useCartStore((state) => state.clearCart);

    const disabled = itemCount === 0;

    return (
        <div className="flex gap-2">
            {/* Clear cart with confirmation */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors cursor-pointer"
                        disabled={disabled}
                        aria-label="Vider le panier"
                        title="Vider le panier (Ctrl+Espace)"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Vider le panier ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action supprimera tous les {itemCount} article{itemCount > 1 ? "s" : ""} du
                            panier. Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={clearCart}
                        >
                            Vider le panier
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Payment button */}
            <Button
                className="flex-1 h-11 text-sm font-bold shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 transition-all cursor-pointer"
                disabled={disabled}
                onClick={onPaymentOpen}
                aria-label={`Procéder au paiement – ${total.toLocaleString()} FCFA`}
                title="Ouvrir le paiement (F8)"
            >
                <CreditCard className="h-4 w-4 mr-2" />
                Payer {disabled ? "" : `${total.toLocaleString()} FCFA`}
            </Button>
        </div>
    );
}
