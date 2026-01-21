"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DeliveryActions } from "./delivery-actions";
import type { Delivery } from "./schema";

export const columns: ColumnDef<Delivery>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID Livraison" />,
        cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
    },
    {
        accessorKey: "agentId",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID Agent" />,
    },
    {
        accessorKey: "agentName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom Agent" />,
    },
    {
        accessorKey: "clientName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Client / Point de Vente" />,
    },
    {
        accessorKey: "clientPhone",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tél. Client" />,
    },
    {
        accessorKey: "clientAddress",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Adresse Client" />,
    },
    {
        accessorKey: "quantity",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Qté Livrée" />,
        cell: ({ row }) => <span className="font-medium">{row.getValue("quantity")}</span>,
    },
    {
        accessorKey: "amount",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Montant (FCFA)" />,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const formatted = new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "XOF",
            }).format(amount);
            return <span className="font-medium">{formatted}</span>;
        },
    },
    {
        accessorKey: "date",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    },
    {
        accessorKey: "time",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Heure" />,
    },
    {
        accessorKey: "duration",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Durée" />,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge
                    variant={
                        status === "Livré"
                            ? "default"
                            : status === "Annulé"
                                ? "destructive"
                                : status === "En cours"
                                    ? "default"
                                    : "secondary"
                    }
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DeliveryActions row={row} />,
        enableSorting: false,
        enableHiding: false,
    },
];
