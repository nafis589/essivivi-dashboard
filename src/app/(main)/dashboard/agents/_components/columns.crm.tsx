import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Trash } from "lucide-react";
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
import { agentService } from "@/services/agent.service";

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
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.id}</span>,
    enableSorting: true,
  },
  {
    id: "fullName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom et prénom" />,
    cell: ({ row }) => (
      <span>{row.original.nom} {row.original.prenom}</span>
    ),
    enableSorting: false,
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
    id: "tricycle_assigne",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tricycle assigné" />,
    cell: ({ row }) => {
      const tricycleCode = row.original.tricycle_assigne ?? "N/A";
      return <span className="font-medium">{tricycleCode}</span>;
    },
  },
  {
    accessorKey: "statut",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    cell: ({ row }) => {
      const status = row.original.statut ?? "";
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";

      if (status === "actif" || status === "Actif") variant = "default";
      else if (status === "en_tournee" || status === "En tournée") variant = "secondary";
      else if (status === "inactif" || status === "Inactif") variant = "destructive";

      return <Badge variant={variant}>{status || ""}</Badge>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "date_embauche",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date d'embauche" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.date_embauche ?? ""}</span>,
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
              await agentService.deleteAgent(row.original.id);
              // naive: simple reload to refresh list
              if (typeof window !== 'undefined') window.location.reload();
            } catch (e) { console.error(e); }
          }}>
            <Trash className="mr-2 h-4 w-4" /> Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} mode="edit" type="agent" initialData={row.original} />
    </>
  );
};
