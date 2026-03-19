import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getClientInitials } from '@/lib/modules/clients/utils'

interface ClientAvatarProps {
    name: string
    imageUrl?: string
    className?: string
}

export function ClientAvatar({ name, imageUrl, className }: ClientAvatarProps) {
    const initials = getClientInitials(name)

    return (
        <Avatar className={className}>
            {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials}
            </AvatarFallback>
        </Avatar>
    )
}
