"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SalesSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function SalesSearch({ value, onChange }: SalesSearchProps) {
    return (
        <div className="relative max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
                type="text"
                placeholder="Rechercher par n° facture, client..."
                className="pl-10 h-9 border-slate-200 focus-visible:ring-indigo-500 shadow-sm rounded-md placeholder:text-slate-400"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
