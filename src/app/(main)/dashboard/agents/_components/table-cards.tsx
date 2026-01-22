"use client";
"use no memo";

import { Download, Plus } from "lucide-react";
import React from 'react';

import AddUserModal from "./add-user-modal";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { agentsColumns } from "./columns.crm";
import { agentService } from "@/services/agent.service";
import type { Agent } from "@/services/agent.service";

export function TableCards() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [data, setData] = React.useState<Agent[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchAgents = React.useCallback(async () => {
    setLoading(true);
    try {
      const list = await agentService.getAllAgents();
      setData(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const table = useDataTableInstance({
    data,
    columns: agentsColumns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle>Liste des Agents</CardTitle>
          <CardDescription>Gérez vos agents et suivez leur statut.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline">Ajouter agent</span>
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={agentsColumns} />
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>

      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
