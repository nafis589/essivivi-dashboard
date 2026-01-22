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
        accessorKey: "agent",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID Agent" />,
    },
    {
        accessorKey: "commande",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID Commande" />,
    },
    {
        accessorKey: "date_livraison",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date Livraison" />,
    },
    {
        accessorKey: "statut",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => {
            const status = (row.getValue("statut") as string) ?? "";
            return (
                <Badge
                    variant={
                        status === "livre" || status === "Livré"
                            ? "default"
                            : status === "annule" || status === "Annulé"
                                ? "destructive"
                                : status === "en_cours" || status === "En cours"
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
        accessorKey: "is_validated",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Validée" />,
        cell: ({ row }) => {
            const isValidated = row.getValue("is_validated") as boolean;
            return <Badge variant={isValidated ? "default" : "secondary"}>{isValidated ? "Oui" : "Non"}</Badge>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DeliveryActions row={row} />,
        enableSorting: false,
        enableHiding: false,
    },
];
