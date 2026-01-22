"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { columns } from "./columns";
import { commandeService } from "@/services/commande.service";
import type { Commande } from "@/services/commande.service";
import { OrdersToolbar } from "./orders-toolbar";

export function TableCards() {
    const [data, setData] = React.useState<Commande[]>([]);
    const [loading, setLoading] = React.useState(false);

    const fetchCommandes = React.useCallback(async () => {
        setLoading(true);
        try {
            const list = await commandeService.getAllCommandes();
            setData(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchCommandes();
    }, [fetchCommandes]);

    const table = useDataTableInstance({
        data,
        columns,
        getRowId: (row) => row.id,
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-6">
                <div className="flex flex-col gap-1.5">
                    <CardTitle>Liste des Commandes</CardTitle>
                    <CardDescription>Gérez les commandes entrantes des clients.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <OrdersToolbar table={table} />
                    <DataTableViewOptions table={table} />
                </div>
            </CardHeader>
            <CardContent className="flex w-full max-w-full flex-col gap-4">
                <div className="overflow-x-auto rounded-md border w-full max-w-full">
                    <DataTable table={table} columns={columns} />
                </div>
                <DataTablePagination table={table} />
            </CardContent>
        </Card>
    );
}
