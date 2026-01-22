import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Trash } from "lucide-react";
import { useState } from "react";
import type z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { clientSchema } from "./schema";
import { clientService } from "@/services/client.service";
import ClientModal from "./client-modal";

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
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.id}</span>,
    enableSorting: true,
  },
  {
    accessorKey: "nom_point_vente",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom du point de vente" />,
    enableSorting: true,
  },
  {
    accessorKey: "responsable",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Responsable" />,
    enableSorting: true,
  },
  {
    accessorKey: "telephone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Numéro de téléphone" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.telephone}</span>,
  },
  {
    id: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      const email = row.original.user_details?.email ?? row.original.email ?? "";
      return <span>{email}</span>;
    },
  },
  {
    accessorKey: "adresse",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Adresse" />,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} />,
    enableSorting: false,
  },
];

const ActionCell = ({ row }: { row: any }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground" size="icon">
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsEditModalOpen(true)}>Modifier</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onSelect={async () => {
            try {
              await clientService.deleteClient(row.original.id);
              if (typeof window !== 'undefined') window.location.reload();
            } catch (e) { console.error(e); }
          }}>
            <Trash className="mr-2 h-4 w-4" /> Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ClientModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} mode="edit" type="client" initialData={row.original} />
    </>
  );
};
