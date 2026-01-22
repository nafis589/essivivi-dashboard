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
import { adminUsersData } from "./data";
import AdminUserModal from "./admin-user-modal";

export function TableCards() {
  const table = useDataTableInstance({
    data: adminUsersData,
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
        <div className="overflow-x-auto rounded-md border w-full max-w-full">
          <DataTable table={table} columns={columns} />
        </div>
        <DataTablePagination table={table} />
      </CardContent>

      <AdminUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
      />
    </Card>
  );
}
