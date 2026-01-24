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
import { adminUserService } from "@/services/admin-user.service";
import { toast } from "sonner";

interface AdminUserDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    initialData?: AdminUser;
    onSaved?: () => void;
}

export function AdminUserDrawer({
    open,
    onOpenChange,
    mode = "create",
    initialData,
    onSaved
}: AdminUserDrawerProps) {
    const isMobile = useIsMobile();
    const title =
        mode === "create" ? "Ajouter un administrateur" : "Modifier l'administrateur";
    const description =
        mode === "create"
            ? "Remplissez les informations ci-dessous pour créer un nouveau compte administrateur."
            : "Modifiez les informations de l'administrateur sélectionné.";

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [role, setRole] = React.useState("Superviseur");
    const [status, setStatus] = React.useState("Actif");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            if (mode === "edit" && initialData) {
                setName(initialData.name);
                setEmail(initialData.email);
                setRole(initialData.role);
                setStatus(initialData.status);
            } else {
                setName("");
                setEmail("");
                setRole("Superviseur");
                setStatus("Actif");
                setPassword("");
                setConfirmPassword("");
            }
        }
    }, [open, mode, initialData]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) {
            toast.error("Le nom est requis.");
            return;
        }
        if (!email.trim()) {
            toast.error("L'email est requis.");
            return;
        }

        if (mode === "create") {
            if (!password || !confirmPassword) {
                toast.error("Les mots de passe sont requis.");
                return;
            }
            if (password !== confirmPassword) {
                toast.error("Les mots de passe ne correspondent pas.");
                return;
            }
            if (password.length < 8) {
                toast.error("Le mot de passe doit contenir au moins 8 caractères.");
                return;
            }
        }

        try {
            setLoading(true);

            // Map frontend role display to backend values
            const roleMap: Record<string, "super_admin" | "gestionnaire" | "superviseur"> = {
                "Super Admin": "super_admin",
                "Gestionnaire": "gestionnaire",
                "Superviseur": "superviseur",
            };

            // Map frontend status display to backend values
            const statusMap: Record<string, "actif" | "inactif"> = {
                "Actif": "actif",
                "Inactif": "inactif",
            };

            const backendRole = roleMap[role] || "superviseur";
            const backendStatus = statusMap[status] || "actif";

            if (mode === "create") {
                await adminUserService.createAdminUser({
                    name,
                    email,
                    role: backendRole,
                    status: backendStatus,
                    password,
                    confirm_password: confirmPassword,
                });
                toast.success("Administrateur créé avec succès !");
            } else {
                if (!initialData?.id) {
                    toast.error("ID utilisateur manquant.");
                    return;
                }
                await adminUserService.updateAdminUser(initialData.id, {
                    name,
                    role: backendRole,
                    status: backendStatus,
                });
                toast.success("Administrateur mis à jour avec succès !");
            }

            if (onSaved) onSaved();
            onOpenChange(false);
        } catch (error: any) {
            console.error("Failed to save admin user", error);
            
            // Handle specific API errors
            if (error.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'object') {
                    const errorMessages = Object.entries(errorData)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ");
                    toast.error(`Erreur: ${errorMessages}`);
                } else {
                    toast.error(errorData.message || "Une erreur est survenue.");
                }
            } else {
                toast.error("Une erreur est survenue lors de l'enregistrement.");
            }
        } finally {
            setLoading(false);
        }
    };

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
                    <form className="flex flex-col gap-4" onSubmit={handleSave}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Nom et Prénom</Label>
                            <Input
                                id="name"
                                placeholder="Jean Dupont"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="jean.dupont@essivivi.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={mode === "edit"} // Often ID/Email is immutable
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="role">Rôle</Label>
                            <Select value={role} onValueChange={setRole}>
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
                            <Select value={status} onValueChange={setStatus}>
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
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <DrawerFooter className="px-0">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Enregistrement..." : (mode === "create" ? "Ajouter" : "Enregistrer")}
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline" disabled={loading}>Annuler</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </form>
                </div>

            </DrawerContent>
        </Drawer>
    );
}
