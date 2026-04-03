/**
 * Service API — Module Clients
 *
 * Connecte le frontend aux endpoints documentés dans customers_api_documentation.md
 * Utilise le apiClient singleton (lib/api/client.ts) qui gère auth + cookies.
 */

import { apiClient } from '@/lib/api/client'
import type {
  ClientsListResponse,
  ClientsListParams,
  ClientResponse,
  ClientFormData,
  ClientStatsResponse,
  ClientSalesResponse,
  ClientFullResponse,
  ClientSegmentResponse,
} from './types'

// ─── CRUD de base (Phase 1) ──────────────────────────────────────────────────

/**
 * Liste paginée des clients avec recherche et tri.
 * GET /api/customers
 */
export async function fetchClients(params?: ClientsListParams): Promise<ClientsListResponse> {
  return apiClient.get<ClientsListResponse>('/customers', {
    params: params as Record<string, string | number | boolean | undefined>,
  })
}

/**
 * Créer un nouveau client.
 * POST /api/customers
 */
export async function createClient(data: ClientFormData): Promise<ClientResponse> {
  return apiClient.post<ClientResponse>('/customers', data)
}

/**
 * Récupérer un client par son ID.
 * GET /api/customers/:id
 */
export async function getClient(id: number): Promise<ClientResponse> {
  return apiClient.get<ClientResponse>(`/customers/${id}`)
}

/**
 * Modifier un client.
 * PUT /api/customers/:id
 */
export async function updateClient(id: number, data: Partial<ClientFormData>): Promise<ClientResponse> {
  return apiClient.put<ClientResponse>(`/customers/${id}`, data)
}

/**
 * Supprimer un client (hard delete).
 * DELETE /api/customers/:id
 */
export async function deleteClient(id: number): Promise<{ success: boolean; message: string }> {
  return apiClient.delete<{ success: boolean; message: string }>(`/customers/${id}`)
}

// ─── Historique des ventes (Phase 2) ─────────────────────────────────────────

/**
 * Récupérer les ventes d'un client (triées par date DESC).
 * GET /api/customers/:id/sales
 */
export async function getClientSales(id: number): Promise<ClientSalesResponse> {
  return apiClient.get<ClientSalesResponse>(`/customers/${id}/sales`)
}

// ─── Statistiques client (Phase 3) ──────────────────────────────────────────

/**
 * Récupérer les stats d'un client (totalSpent, totalPurchases, averageOrder, lastPurchaseAt).
 * GET /api/customers/:id/stats
 */
export async function getClientStats(id: number): Promise<ClientStatsResponse> {
  return apiClient.get<ClientStatsResponse>(`/customers/${id}/stats`)
}

// ─── Fiche client complète (Phase 5) ────────────────────────────────────────

/**
 * Récupérer la fiche complète d'un client (customer + stats + recentSales + status).
 * GET /api/customers/:id/full
 * → Utilisez cet endpoint pour la page de détail client.
 */
export async function getClientFull(id: number): Promise<ClientFullResponse> {
  return apiClient.get<ClientFullResponse>(`/customers/${id}/full`)
}

// ─── Segmentation (Phase 6) ─────────────────────────────────────────────────

/**
 * Top 10 clients par dépenses.
 * GET /api/customers/top
 */
export async function getTopClients(): Promise<ClientSegmentResponse> {
  return apiClient.get<ClientSegmentResponse>('/customers/top')
}

/**
 * Clients inactifs (sans achat > 60 jours).
 * GET /api/customers/inactive
 */
export async function getInactiveClients(): Promise<ClientSegmentResponse> {
  return apiClient.get<ClientSegmentResponse>('/customers/inactive')
}

/**
 * Nouveaux clients (0 achats).
 * GET /api/customers/new
 */
export async function getNewClients(): Promise<ClientSegmentResponse> {
  return apiClient.get<ClientSegmentResponse>('/customers/new')
}
