'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type ClientFilterType = 'all' | 'recent' | 'best' | 'inactive'

interface ClientsFiltersProps {
    value: ClientFilterType
    onChange: (value: ClientFilterType) => void
}

export function ClientsFilters({ value, onChange }: ClientsFiltersProps) {
    return (
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
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
