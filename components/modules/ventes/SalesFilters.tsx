"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface SalesFiltersProps {
    dateFilter: string;
    onDateFilterChange: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
}

export function SalesFilters({ dateFilter, onDateFilterChange, statusFilter, onStatusFilterChange }: SalesFiltersProps) {
    return (
        <div className="flex items-center space-x-2">
            <div className="flex items-center px-3 py-1.5 border border-slate-200 bg-white rounded-md shadow-sm h-9">
                <Filter className="h-4 w-4 text-slate-500 mr-2" />
                <span className="text-sm font-medium text-slate-700">Filtres</span>
            </div>

            <Select value={dateFilter} onValueChange={onDateFilterChange}>
                <SelectTrigger className="w-[160px] h-9 bg-white border-slate-200">
                    <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Toutes périodes</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="this_week">Cette semaine</SelectItem>
                    <SelectItem value="this_month">Ce mois-ci</SelectItem>
                    <SelectItem value="last_month">Mois dernier</SelectItem>
                </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-[160px] h-9 bg-white border-slate-200">
                    <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="paid">Payés</SelectItem>
                    <SelectItem value="refunded">Remboursés</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
