import { Client, ClientStatus } from './types'

/**
 * Formate un numéro de téléphone.
 */
export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/)
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`
    }
    return phone
}

/**
 * Valide un email.
 */
export function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

/**
 * Formate un montant en FCFA (monnaie utilisée par l'API).
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',     // FCFA
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Formate une date ISO string en format lisible français.
 */
export function formatDate(date: string | Date | null | undefined): string {
    if (!date) return '-'
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return '-'
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(d)
}

/**
 * Formate une date relative (ex: "il y a 2 jours").
 */
export function formatRelativeDate(date: string | null | undefined): string {
    if (!date) return '-'
    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'

    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
    return `Il y a ${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? 's' : ''}`
}

/**
 * Extrait les initiales d'un nom.
 */
export function getClientInitials(name: string): string {
    if (!name) return ''
    const parts = name.split(' ')
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
}

/**
 * Détermine le statut d'un client côté frontend.
 * Règles (identiques au backend doc) :
 *  - "new"      : totalPurchases === 0
 *  - "active"   : dernière commande ≤ 60 jours
 *  - "inactive" : dernière commande > 60 jours
 */
export function getClientStatus(client: Client): ClientStatus {
    if (client.totalPurchases === 0) {
        return 'new'
    }

    if (!client.lastPurchaseAt) {
        return 'inactive'
    }

    const now = new Date()
    const lastPurchase = new Date(client.lastPurchaseAt)
    const diffMs = now.getTime() - lastPurchase.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 60) {
        return 'inactive'
    }

    return 'active'
}

/**
 * Label français pour un statut client.
 */
export function getStatusLabel(status: ClientStatus): string {
    switch (status) {
        case 'new': return 'Nouveau'
        case 'active': return 'Actif'
        case 'inactive': return 'Inactif'
    }
}
