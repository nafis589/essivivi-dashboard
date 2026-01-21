"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { clientsColumns } from "./columns.crm";
import { clientsData } from "./crm.config";
import UserModal from "../../agents/_components/add-user-modal";

export function TableCards() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const table = useDataTableInstance({
    data: clientsData,
    columns: clientsColumns,
    getRowId: (row) => row.clientCode,
  });

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle>Liste des Clients</CardTitle>
          <CardDescription>Gérez vos clients et suivez leur statut.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline">Ajouter client</span>
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={clientsColumns} />
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>

      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type="client" mode="create" />
    </div>
  );
}
