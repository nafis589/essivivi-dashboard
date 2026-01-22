"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { Order } from "./schema";
import { AssignAgentDrawer } from "./assign-agent-drawer";

export const columns: ColumnDef<Order>[] = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID Commande" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "date_creation",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
  },
  {
    accessorKey: "client",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Client ID" />,
  },
  {
    accessorKey: "qt_commandee",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantité" />,
  },
  {
    accessorKey: "statut",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    cell: ({ row }) => {
      const status = (row.getValue("statut") as string) ?? "";
      return (
        <Badge
          variant={
            status === "livre" || status === "Livrée"
              ? "default"
              : status === "annulee" || status === "Annulée"
                ? "destructive"
                : status === "en_cours" || status === "En cours"
                  ? "default"
                  : "secondary"
          }
          className={
            status === "en_attente" || status === "En attente" ? "bg-yellow-500 hover:bg-yellow-600" :
              status === "en_cours" || status === "En cours" ? "bg-blue-500 hover:bg-blue-600" :
                ""
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "agent",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Agent Assigné" />,
    cell: ({ row }) => <AssignAgentDrawer order={row.original} />,
  },
];
