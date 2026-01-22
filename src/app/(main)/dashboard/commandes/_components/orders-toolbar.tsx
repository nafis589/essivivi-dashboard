"use client";

import * as React from "react";
import { Download, Printer, SlidersHorizontal } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import type { Order } from "./schema";

interface OrdersToolbarProps {
    table: Table<Order>;
}

export function OrdersToolbar({ table }: OrdersToolbarProps) {
    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        // Simple CSV export logic
        const rows = table.getFilteredRowModel().rows;
        const csvContent = [
            ["ID", "Date", "Client", "Quantité", "Statut", "Agent"].join(","),
            ...rows.map(row => [
                row.original.id,
                row.original.date_creation || "",
                row.original.client,
                row.original.qt_commandee,
                row.original.statut || "",
                row.original.agent || ""
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "commandes.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
                <Input
                    placeholder="Filtrer par client..."
                    value={(table.getColumn("client")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("client")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
            </div>
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
