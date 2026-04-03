'use client'

import { Badge } from '@/components/ui/badge'
import { ClientStatus } from '@/lib/modules/clients/types'
import { getStatusLabel } from '@/lib/modules/clients/utils'
import { cn } from '@/lib/utils'

interface ClientStatusBadgeProps {
    status: ClientStatus
    className?: string
}

const STATUS_STYLES: Record<ClientStatus, string> = {
    new: 'text-blue-600 bg-blue-50 border-blue-200',
    active: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    inactive: 'text-orange-600 bg-orange-50 border-orange-200',
}

export function ClientStatusBadge({ status, className }: ClientStatusBadgeProps) {
    return (
        <Badge variant="outline" className={cn(STATUS_STYLES[status], className)}>
            {getStatusLabel(status)}
        </Badge>
    )
}
