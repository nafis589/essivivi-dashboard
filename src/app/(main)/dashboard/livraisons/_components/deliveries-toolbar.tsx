"use client";

import * as React from "react";
import { Download, Printer, SlidersHorizontal } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { Delivery } from "./schema";

interface DeliveriesToolbarProps {
    table: Table<Delivery>;
}

export function DeliveriesToolbar({ table }: DeliveriesToolbarProps) {
    // Filters state (mocked for UI purposes as we don't have backend filtering yet)
    // In a real app, these would filter the table instance

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        // Generate CSV content
        const rows = table.getFilteredRowModel().rows;
        const csvContent = [
            ["ID", "Agent", "Client", "Montant", "Statut", "Date"].join(","),
            ...rows.map(row => [
                row.original.id,
                row.original.agentName,
                row.original.clientName,
                row.original.amount,
                row.original.statut,
                row.original.date
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "livraisons.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filtres
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Filtres</h4>
                            <p className="text-sm text-muted-foreground">
                                Affinez votre recherche.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="agent">Agent</Label>
                                <Input
                                    id="agent"
                                    placeholder="Nom..."
                                    className="col-span-2 h-8"
                                    onChange={(event) => table.getColumn("agentName")?.setFilterValue(event.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="client">Client</Label>
                                <Input
                                    id="client"
                                    placeholder="Nom..."
                                    className="col-span-2 h-8"
                                    onChange={(event) => table.getColumn("clientName")?.setFilterValue(event.target.value)}
                                />
                            </div>
                            {/* Date Range (Simplified) */}
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="date-start">Date (Du)</Label>
                                <Input id="date-start" type="date" className="col-span-2 h-8" />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="date-end">Date (Au)</Label>
                                <Input id="date-end" type="date" className="col-span-2 h-8" />
                            </div>

                            {/* Amount Range */}
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="amount-min">Montant Min</Label>
                                <Input id="amount-min" type="number" placeholder="0" className="col-span-2 h-8" />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="amount-max">Max</Label>
                                <Input id="amount-max" type="number" placeholder="100000" className="col-span-2 h-8" />
                            </div>

                            {/* Geographic Zone (Mocked as Address for now) */}
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="zone">Zone</Label>
                                <Input
                                    id="zone"
                                    placeholder="Ville/Quartier..."
                                    className="col-span-2 h-8"
                                    onChange={(event) => table.getColumn("clientAddress")?.setFilterValue(event.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="status">Statut</Label>
                                <Select onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)}>
                                    <SelectTrigger className="col-span-2 h-8">
                                        <SelectValue placeholder="Tous" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous</SelectItem>
                                        <SelectItem value="Livré">Livré</SelectItem>
                                        <SelectItem value="En cours">En cours</SelectItem>
                                        <SelectItem value="Annulé">Annulé</SelectItem>
                                        <SelectItem value="Reporté">Reporté</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm" className="h-8" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Exporter
            </Button>

            <Button variant="outline" size="sm" className="h-8" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
            </Button>
        </div>
    );
}
