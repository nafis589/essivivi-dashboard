"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer } from "@/lib/types/pos";
import { UserPlus, ArrowLeft } from "lucide-react";

interface QuickCustomerFormProps {
    onCancel: () => void;
    onSubmit: (customer: Omit<Customer, "id">) => void;
}

export function QuickCustomerForm({ onCancel, onSubmit }: QuickCustomerFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit({
            name: name.trim(),
            phone: phone.trim() || undefined,
            email: email.trim() || undefined,
            points: 0,
        });
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
                    placeholder="Ex : Amadou Koné"
                    required
                    autoFocus
                    aria-required="true"
                    className="h-10"
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
                    placeholder="Ex : 07 07 07 07 07"
                    className="h-10"
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
                    placeholder="Ex : amadou@email.com"
                    className="h-10"
                />
            </div>

            <div className="flex gap-2 pt-1">
                <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 cursor-pointer"
                    onClick={onCancel}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Button>
                <Button
                    type="submit"
                    className="flex-1 cursor-pointer"
                    disabled={!name.trim()}
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Créer le client
                </Button>
            </div>
        </form>
    );
}
