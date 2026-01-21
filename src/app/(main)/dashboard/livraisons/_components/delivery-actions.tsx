"use client";

import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import type { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DeliveryModal from "./delivery-modal";
import type { Delivery } from "./schema";

interface DeliveryActionsProps {
    row: Row<Delivery>;
}

export function DeliveryActions({ row }: DeliveryActionsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const delivery = row.original;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex size-8 text-muted-foreground" size="icon">
                        <EllipsisVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Voir détails</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>Modifier</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Annuler livraison</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeliveryModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={delivery}
            />
        </>
    );
}
