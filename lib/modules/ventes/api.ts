/**
 * Service API — Module Ventes
 *
 * Connecte le frontend aux endpoints documentés dans sales_api_documentation.md
 */

import { apiClient } from '@/lib/api/client'
import type {
  SalesListResponse,
  Sale,
  SalesStats
} from './types'

export interface SalesListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string | 'all';
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * 1. Récupérer la liste des ventes (paginée)
 * GET /api/sales
 */
export async function fetchSales(params?: SalesListParams): Promise<SalesListResponse> {
  return apiClient.get<SalesListResponse>('/sales', {
    params: params as Record<string, string | number | boolean | undefined>,
  })
}

/**
 * 2. Créer une nouvelle vente
 * POST /api/sales
 */
export async function createSale(data: any): Promise<{ success: boolean; data: Sale; message: string }> {
  return apiClient.post<{ success: boolean; data: Sale; message: string }>('/sales', data)
}

/**
 * 3. Statistiques globales de vente
 * GET /api/sales/stats
 */
export async function getSalesStats(): Promise<SalesStats> {
  return apiClient.get<SalesStats>('/sales/stats')
}

/**
 * 4. Détails d'une vente spécifique
 * GET /api/sales/:id
 */
export async function getSaleDetails(id: number): Promise<Sale> {
  return apiClient.get<Sale>(`/sales/${id}`)
}

/**
 * 5. Supprimer une vente
 * DELETE /api/sales/:id
 */
export async function deleteSale(id: number): Promise<{ success: boolean; message: string }> {
  return apiClient.delete<{ success: boolean; message: string }>(`/sales/${id}`)
}
