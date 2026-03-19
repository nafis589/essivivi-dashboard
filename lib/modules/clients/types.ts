export interface Client {
    id: number
    name: string
    phone?: string
    email?: string
    address?: string
    notes?: string
    totalPurchases: number
    totalSpent: number
    lastPurchaseDate?: Date
    createdAt: Date
    status?: 'active' | 'inactive' | 'new' // Derived potentially, but useful
}

export interface ClientFormData {
    name: string
    phone?: string
    email?: string
    address?: string
    notes?: string
}

export interface PurchaseHistoryItem {
    id: string
    date: Date
    amount: number
    paymentMethod: 'carte' | 'especes' | 'virement' | 'mobile_money'
    itemsCount: number
}
