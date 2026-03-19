"use client";

import { useState } from "react";
import { UserPlus, UserCircle2, X, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/lib/types/pos";
import { useCartStore } from "@/lib/store/useCartStore";
import { CustomerSearch } from "../Customer/CustomerSearch";
import { cn } from "@/lib/utils";

export function CustomerSelector() {
    const customerId = useCartStore((state) => state.customerId);
    const customer = useCartStore((state) => state.customer);
    const setCustomer = useCartStore((state) => state.setCustomer);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    if (customer) {
        return (
            <>
                <div
                    className={cn(
                        "flex items-center justify-between p-2.5 rounded-lg",
                        "bg-primary/5 border border-primary/20",
                        "cursor-pointer hover:bg-primary/10 transition-colors",
                        "group"
                    )}
                    onClick={() => setIsSearchOpen(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setIsSearchOpen(true)}
                    aria-label="Changer de client"
                >
                    <div className="flex items-center gap-2.5">
                        {/* Avatar */}
                        <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                            <UserCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-sm leading-none truncate">{customer.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                {customer.phone && (
                                    <p className="text-[11px] text-muted-foreground">{customer.phone}</p>
                                )}
                                {customer.points !== undefined && customer.points > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className="text-[9px] h-4 px-1 font-bold gap-0.5"
                                    >
                                        <Star className="h-2 w-2 fill-current text-amber-500" />
                                        {customer.points} pts
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                            onClick={(e) => {
                                e.stopPropagation();
                                setCustomer(undefined);
                            }}
                            aria-label="Retirer le client"
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                <CustomerSearch
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                    onSelect={(c: Customer) => {
                        setCustomer(c.id);
                        setIsSearchOpen(false);
                    }}
                />
            </>
        );
    }

    return (
        <>
            <Button
                variant="outline"
                className={cn(
                    "w-full justify-start h-10 text-muted-foreground",
                    "border-dashed hover:border-primary/50 hover:text-primary hover:bg-primary/5",
                    "transition-all duration-150 cursor-pointer"
                )}
                onClick={() => setIsSearchOpen(true)}
                aria-label="Associer un client à la vente"
            >
                <UserPlus className="mr-2 h-4 w-4" />
                <span className="text-sm">Associer un client…</span>
            </Button>

            <CustomerSearch
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelect={(customer: Customer) => {
                    setCustomer(customer.id);
                    setIsSearchOpen(false);
                }}
            />
        </>
    );
}
