import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import type z from "zod";

import UserModal from "./add-user-modal";

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

import type { agentSchema } from "./schema";

export const agentsColumns: ColumnDef<z.infer<typeof agentSchema>>[] = [
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
    accessorKey: "identificationNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Numéro d'identification" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.identificationNumber}</span>,
    enableSorting: true,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom et prénom" />,
    enableSorting: true,
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Numéro de téléphone" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.phoneNumber}</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "assignedTricycle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tricycle assigné" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";

      if (status === "Actif") variant = "default";
      else if (status === "En tournée") variant = "secondary";
      else if (status === "Inactif") variant = "destructive";

      return <Badge variant={variant}>{status}</Badge>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "hireDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date d'embauche" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.hireDate}</span>,
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
          <DropdownMenuItem>Voir</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsEditModalOpen(true)}>Modifier</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Désactiver</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </>
  );
};
