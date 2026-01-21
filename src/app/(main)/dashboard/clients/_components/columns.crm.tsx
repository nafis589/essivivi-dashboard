import type { ColumnDef } from "@tanstack/react-table";
import type z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import type { clientSchema } from "./schema";

import { ClientActions } from "./client-actions";

export const clientsColumns: ColumnDef<z.infer<typeof clientSchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "clientCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code client" />,
    cell: ({ row }) => <span className="font-medium">{row.original.clientCode}</span>,
    enableSorting: true,
  },
  {
    accessorKey: "posName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom du point de vente" />,
    enableSorting: true,
  },
  {
    accessorKey: "manager",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Responsable" />,
    enableSorting: true,
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Numéro de téléphone" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.phoneNumber}</span>,
  },
  {
    accessorKey: "address",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Adresse" />,
  },
  {
    accessorKey: "gpsCoordinates",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Coordonnées GPS" />,
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.gpsCoordinates}</span>,
  },
  {
    accessorKey: "registrationDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date d'inscription" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.registrationDate}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge variant={status === "Actif" ? "default" : "secondary"}>{status}</Badge>;
    },
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <ClientActions row={row} />,
    enableSorting: false,
  },
];
