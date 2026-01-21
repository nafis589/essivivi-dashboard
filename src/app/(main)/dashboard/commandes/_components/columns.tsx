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
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Client" />,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantité" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "Livrée"
              ? "default"
              : status === "Annulée"
                ? "destructive"
                : status === "En cours" || status === "Acceptée"
                  ? "default" // Blue/Primary for success/progress usually
                  : "secondary" // Gray/Secondary for pending
          }
          className={
            status === "En attente" ? "bg-yellow-500 hover:bg-yellow-600" :
              status === "En cours" ? "bg-blue-500 hover:bg-blue-600" :
                ""
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "agentName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Agent Assigné" />,
    cell: ({ row }) => <AssignAgentDrawer order={row.original} />,
  },
];
