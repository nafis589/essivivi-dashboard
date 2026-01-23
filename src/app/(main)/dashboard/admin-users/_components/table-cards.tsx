"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { columns } from "./columns";
import { AdminUserDrawer } from "./admin-user-drawer";
import { adminUserService, type AdminUser as BackendAdminUser } from "@/services/admin-user.service";
import { type AdminUser } from "./schema";
import { toast } from "sonner";

export function TableCards() {
  const [data, setData] = React.useState<AdminUser[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const results = await adminUserService.getAllAdminUsers();

      // Transform backend data to match frontend schema
      // Backend: role: "super_admin" | "gestionnaire" | "superviseur", status: "actif" | "inactif"
      // Frontend: role: "Super Admin" | "Gestionnaire" | "Superviseur", status: "Actif" | "Inactif"

      const transformedData: AdminUser[] = (Array.isArray(results) ? results : []).map((user: any) => ({
        id: user.id || "",
        name: user.name || "Inconnu",
        email: user.email || "",
        role: mapRole(user.role),
        status: mapStatus(user.status),
        lastConnection: user.lastConnection || "Jamais",
      }));

      setData(transformedData);
    } catch (error) {
      console.error("Failed to fetch admin users", error);
      toast.error("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mapRole = (role: string): any => {
    switch (role) {
      case "super_admin": return "Super Admin";
      case "gestionnaire": return "Gestionnaire";
      case "superviseur": return "Superviseur";
      default: return "Superviseur"; // Fallback
    }
  };

  const mapStatus = (status: string): any => {
    switch (status) {
      case "actif": return "Actif";
      case "inactif": return "Inactif";
      default: return "Actif";
    }
  }

  const table = useDataTableInstance({
    data,
    columns,
    getRowId: (row) => row.id,
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-6">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Utilisateurs Admin</CardTitle>
          <CardDescription>Gérez les administrateurs et leurs rôles.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus size={16} />
            Ajouter admin
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </CardHeader>
      <CardContent className="flex w-full max-w-full flex-col gap-4">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Chargement des utilisateurs...</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-md border w-full max-w-full">
              <DataTable table={table} columns={columns} />
            </div>
            <DataTablePagination table={table} />
          </>
        )}
      </CardContent>

      <AdminUserDrawer
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) fetchData(); // Refresh on close if something changed
        }}
        mode="create"
        onSaved={fetchData}
      />
    </Card>
  );
}
