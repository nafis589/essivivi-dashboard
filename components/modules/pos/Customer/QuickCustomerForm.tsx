"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, ArrowLeft, Loader2 } from "lucide-react";
import { createPOSCustomer } from "@/lib/modules/pos/api";
import type { POSCustomer } from "@/lib/types/pos.types";
import { toast } from "sonner";

interface QuickCustomerFormProps {
    onCancel: () => void;
    onCreated: (customer: POSCustomer) => void;
}

export function QuickCustomerForm({ onCancel, onCreated }: QuickCustomerFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await createPOSCustomer({
                name: name.trim(),
                phone: phone.trim() || undefined,
                email: email.trim() || undefined,
            });

            if (response.success && response.data) {
                toast.success(`Client "${response.data.name}" créé avec succès`);
                onCreated(response.data);
            }
        } catch (err: unknown) {
            const msg = err && typeof err === "object" && "message" in err
                ? String((err as { message: string }).message)
                : "Impossible de créer le client";
            toast.error("Erreur", { description: msg });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
                <Label htmlFor="qcf-name" className="text-sm font-semibold">
                    Nom complet <span className="text-destructive" aria-hidden>*</span>
                </Label>
                <Input
                    id="qcf-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Entrez le nom du client"
                    required
                    autoFocus
                    aria-required="true"
                    className="h-10"
                    disabled={isSubmitting}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="qcf-phone" className="text-sm font-semibold">
                    Téléphone
                    <span className="text-xs text-muted-foreground font-normal ml-1">(optionnel)</span>
                </Label>
                <Input
                    id="qcf-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Entrez le numéro de téléphone"
                    className="h-10"
                    disabled={isSubmitting}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="qcf-email" className="text-sm font-semibold">
                    Email
                    <span className="text-xs text-muted-foreground font-normal ml-1">(optionnel)</span>
                </Label>
                <Input
                    id="qcf-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez l'email du client"
                    className="h-10"
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex gap-2 pt-1">
                <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 cursor-pointer"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Button>
                <Button
                    type="submit"
                    className="flex-1 cursor-pointer"
                    disabled={!name.trim() || isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Création…
                        </>
                    ) : (
                        <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Créer le client
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
