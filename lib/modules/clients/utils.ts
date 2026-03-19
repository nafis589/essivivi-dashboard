import { Client } from './types'

export function formatPhone(phone: string): string {
    // Supprime tous les caractères non numériques
    const cleaned = phone.replace(/\D/g, '')
    // Formate en 0X XX XX XX XX
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/)
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`
    }
    return phone
}

export function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR', // ou XOF/CFA selon le besoin
    }).format(amount)
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date)
}

export function getClientInitials(name: string): string {
    if (!name) return ''
    const parts = name.split(' ')
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
}

export function getClientStatus(client: Client): 'inactif' | 'nouveau' | 'actif' {
    const now = new Date()

    if (!client.lastPurchaseDate) {
        return 'nouveau'
    }

    const diffTime = Math.abs(now.getTime() - client.lastPurchaseDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Inactif si > 90 jours (3 mois)
    if (diffDays > 90) {
        return 'inactif'
    }

    if (client.totalPurchases > 0) {
        return 'actif'
    }

    return 'nouveau'
}
