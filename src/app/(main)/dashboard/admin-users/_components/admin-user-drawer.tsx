"use client";

import React from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import type { AdminUser } from "./schema";

interface AdminUserDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    initialData?: AdminUser;
}

export function AdminUserDrawer({
    open,
    onOpenChange,
    mode = "create",
    initialData,
}: AdminUserDrawerProps) {
    const isMobile = useIsMobile();
    const title =
        mode === "create" ? "Ajouter un administrateur" : "Modifier l'administrateur";
    const description =
        mode === "create"
            ? "Remplissez les informations ci-dessous pour créer un nouveau compte administrateur."
            : "Modifiez les informations de l'administrateur sélectionné.";

    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
            direction={isMobile ? "bottom" : "right"}
        >
            <DrawerContent className="h-full max-h-[90vh] sm:max-h-full sm:w-[400px] sm:max-w-md">
                <DrawerHeader>
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Nom et Prénom</Label>
                            <Input
                                id="name"
                                placeholder="Jean Dupont"
                                defaultValue={initialData?.name}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="jean.dupont@essivivi.com"
                                defaultValue={initialData?.email}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="role">Rôle</Label>
                            <Select defaultValue={initialData?.role || "Superviseur"}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Sélectionner un rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                                    <SelectItem value="Gestionnaire">Gestionnaire</SelectItem>
                                    <SelectItem value="Superviseur">Superviseur</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="status">Statut</Label>
                            <Select defaultValue={initialData?.status || "Actif"}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Sélectionner un statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Actif">Actif</SelectItem>
                                    <SelectItem value="Inactif">Inactif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {mode === "create" && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <Input id="password" type="password" placeholder="••••••••" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </>
                        )}
                    </form>
                </div>
                <DrawerFooter>
                    <Button type="submit">
                        {mode === "create" ? "Ajouter" : "Enregistrer"}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
