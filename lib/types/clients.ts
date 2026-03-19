/**
 * Domain types – Clients module
 * 
 * To swap mock data with a real API, update lib/services/clients.service.ts only.
 * These types remain the contract between frontend and backend.
 */

export type ClientStatus = 'actif' | 'inactif' | 'nouveau'

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
    /** Derived from activity, can also be returned by API */
    status?: 'active' | 'inactive' | 'new'
}

export interface ClientFormData {
    name: string
    phone?: string
    email?: string
    address?: string
    notes?: string
}

export type PaymentMethod = 'carte' | 'especes' | 'virement' | 'mobile_money'

export interface PurchaseHistoryItem {
    id: string
    date: Date
    amount: number
    paymentMethod: PaymentMethod
    itemsCount: number
}

export type ClientFilterType = 'all' | 'recent' | 'inactive' | 'best'
