"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { AdminActions } from "./admin-actions";
import type { AdminUser } from "./schema";

export const createAdminUserColumns = (
  onRefresh?: () => Promise<void>
): ColumnDef<AdminUser>[] => [
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
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom et Prénom" />,
        cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Rôle" />,
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.getValue("role")}
            </Badge>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge
                    variant={status === "Actif" ? "default" : "secondary"}
                    className={status === "Actif" ? "bg-green-500 hover:bg-green-600" : ""}
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "lastConnection",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dernière connexion" />,
    },
    {
        id: "actions",
        cell: ({ row }) => <AdminActions row={row} onRefresh={onRefresh} />,
        enableSorting: false,
        enableHiding: false,
    },
];

// Export default columns for backwards compatibility
export const columns = createAdminUserColumns();
