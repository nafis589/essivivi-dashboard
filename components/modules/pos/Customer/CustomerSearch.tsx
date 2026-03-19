"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus2, User, Phone, Star } from "lucide-react";
import { useState, useMemo } from "react";
import { MOCK_CUSTOMERS } from "@/lib/mock-data/pos";
import { Customer } from "@/lib/types/pos";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuickCustomerForm } from "./QuickCustomerForm";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CustomerSearchProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (customer: Customer) => void;
}

export function CustomerSearch({ isOpen, onClose, onSelect }: CustomerSearchProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const filteredCustomers = useMemo(() => {
        if (!searchTerm) return MOCK_CUSTOMERS;
        const lower = searchTerm.toLowerCase();
        return MOCK_CUSTOMERS.filter(
            (c) =>
                c.name.toLowerCase().includes(lower) ||
                c.phone?.includes(searchTerm) ||
                c.email?.toLowerCase().includes(lower)
        );
    }, [searchTerm]);

    const handleCreateCustomer = (data: Omit<Customer, "id">) => {
        const customer: Customer = { ...data, id: Date.now() };
        MOCK_CUSTOMERS.push(customer);
        onSelect(customer);
        setIsCreating(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
            setSearchTerm("");
            setIsCreating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-5 pt-5 pb-3 border-b">
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <User className="h-4 w-4 text-primary" />
                        {isCreating ? "Nouveau client" : "Rechercher un client"}
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        {isCreating
                            ? "Remplissez le formulaire pour créer un nouveau client."
                            : "Recherchez par nom ou téléphone, ou créez un nouveau client."}
                    </DialogDescription>
                </DialogHeader>

                {isCreating ? (
                    <div className="px-5 py-4">
                        <QuickCustomerForm
                            onCancel={() => setIsCreating(false)}
                            onSubmit={handleCreateCustomer}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {/* Search input */}
                        <div className="px-4 py-3 border-b">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    placeholder="Nom, téléphone, email…"
                                    className="pl-9 h-10 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                    aria-label="Rechercher un client"
                                />
                            </div>
                        </div>

                        {/* Create new customer */}
                        <div className="px-4 py-2 border-b bg-muted/20">
                            <Button
                                variant="ghost"
                                className="w-full justify-start h-9 text-primary hover:text-primary hover:bg-primary/5 text-sm cursor-pointer"
                                onClick={() => setIsCreating(true)}
                            >
                                <UserPlus2 className="mr-2 h-4 w-4" />
                                Créer un nouveau client
                            </Button>
                        </div>

                        {/* Customers list */}
                        <ScrollArea className="h-60">
                            <div className="p-2 space-y-0.5">
                                {filteredCustomers.length === 0 ? (
                                    <div className="py-10 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                        <User className="h-8 w-8 text-muted-foreground/30" />
                                        <p className="text-sm">Aucun client trouvé</p>
                                    </div>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <button
                                            key={customer.id}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left",
                                                "hover:bg-muted/60 transition-colors cursor-pointer",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                            )}
                                            onClick={() => onSelect(customer)}
                                        >
                                            {/* Avatar initials */}
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <span className="text-xs font-bold text-primary">
                                                    {customer.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm leading-none">{customer.name}</p>
                                                {customer.phone && (
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <Phone className="h-2.5 w-2.5 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">{customer.phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {customer.points !== undefined && customer.points > 0 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px] font-bold gap-1 shrink-0"
                                                >
                                                    <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                                                    {customer.points}
                                                </Badge>
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
