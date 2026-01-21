"use client";

import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import UserModal from "../../agents/_components/add-user-modal";
import type { clientSchema } from "./schema";

interface ClientActionsProps {
    row: Row<z.infer<typeof clientSchema>>;
}

export function ClientActions({ row }: ClientActionsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const client = row.original;

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
                    <DropdownMenuItem>Voir</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>Modifier</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Désactiver</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <UserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                type="client"
                mode="edit"
                initialData={client}
            />
        </>
    );
}
