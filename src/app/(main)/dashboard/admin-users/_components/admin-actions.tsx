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
}

export function AdminActions({ row }: AdminActionsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const user = row.original;

    const handleDelete = async () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            try {
                await adminUserService.deleteAdminUser(user.id);
                toast.success("Utilisateur supprimé avec succès.");
                // Since this component is deep in the tree and we don't have a shared context for refresh yet,
                // we might need to rely on the user refreshing or implement a context later.
                // For a better UX without context, we could force reload:
                window.location.reload();
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
                onSaved={() => window.location.reload()} // Fallback refresh
            />
        </>
    );
}
