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

import { AdminUserDrawer } from "./admin-user-drawer";
import type { AdminUser } from "./schema";
import { adminUserService } from "@/services/admin-user.service";
import { toast } from "sonner";

interface AdminActionsProps {
    row: Row<AdminUser>;
    onRefresh?: () => Promise<void>;
}

export function AdminActions({ row, onRefresh }: AdminActionsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const user = row.original;

    const handleDelete = async () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            try {
                await adminUserService.deleteAdminUser(user.id);
                toast.success("Utilisateur supprimé avec succès.");
                // Refresh the table data if callback is provided
                if (onRefresh) {
                    await onRefresh();
                } else {
                    // Fallback: reload page if no refresh callback
                    window.location.reload();
                }
            } catch (error) {
                console.error("Failed to delete user", error);
                toast.error("Erreur lors de la suppression.");
            }
        }
    };

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
                    <DropdownMenuItem className="text-destructive" onClick={handleDelete}>Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AdminUserDrawer
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                mode="edit"
                initialData={user}
                onSaved={onRefresh || (() => window.location.reload())} // Use callback if provided
            />
        </>
    );
}
