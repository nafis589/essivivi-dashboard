import { Badge } from '@/components/ui/badge'
import { Client } from '@/lib/modules/clients/types'
import { getClientStatus } from '@/lib/modules/clients/utils'

interface ClientStatusBadgeProps {
    client: Client
}

export function ClientStatusBadge({ client }: ClientStatusBadgeProps) {
    const status = getClientStatus(client)

    switch (status) {
        case 'nouveau':
            return <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">Nouveau</Badge>
        case 'inactif':
            return <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">Inactif</Badge>
        case 'actif':
            return <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">Actif</Badge>
        default:
            return null
    }
}
