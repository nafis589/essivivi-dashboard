'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter } from 'lucide-react'

export type ClientFilterType = 'all' | 'recent' | 'best' | 'inactive'

interface ClientsFiltersProps {
    value: ClientFilterType
    onChange: (value: ClientFilterType) => void
}

export function ClientsFilters({ value, onChange }: ClientsFiltersProps) {
    return (
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <div className="flex items-center px-3 py-1.5 border border-slate-200 bg-white rounded-md shadow-sm h-9 flex-shrink-0">
                <Filter className="h-4 w-4 text-slate-500 mr-2" />
                <span className="text-sm font-medium text-slate-700">Filtres</span>
            </div>

            <Select value={value} onValueChange={(v) => onChange(v as ClientFilterType)}>
                <SelectTrigger className="w-[180px] h-9 bg-white border-slate-200">
                    <SelectValue placeholder="Filtrer" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les clients</SelectItem>
                    <SelectItem value="recent">Nouveaux clients</SelectItem>
                    <SelectItem value="best">Meilleurs clients</SelectItem>
                    <SelectItem value="inactive">Inactifs (&gt;3 mois)</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
