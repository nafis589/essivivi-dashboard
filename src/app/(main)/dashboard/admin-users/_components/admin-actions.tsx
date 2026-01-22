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

import AdminUserModal from "./admin-user-modal";
import type { AdminUser } from "./schema";

interface AdminActionsProps {
    row: Row<AdminUser>;
}

export function AdminActions({ row }: AdminActionsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const user = row.original;

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
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>Modifier</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Désactiver</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AdminUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={user}
            />
        </>
    );
}
