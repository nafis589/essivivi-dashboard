import { apiClient } from "@/lib/api-client";

export interface Livraison {
    id: string;
    commande?: string;
    agent?: string;
    statut?: string;
    is_validated?: boolean;
    date_livraison?: string;
    // Add other fields as returned by the API
}

export interface UpdateLivraisonDTO {
    statut?: string;
    is_validated?: boolean;
}

export const livraisonService = {
    getAllLivraisons: async (params?: Record<string, any>) => {
        const response = await apiClient.get("/livraisons/", { params });
        // Backend returns a paginated object { count, next, previous, results }
        return (response.data as any)?.results ?? response.data;
    },

    getLivraison: async (id: string) => {
        const response = await apiClient.get<Livraison>(`/livraisons/${id}/`);
        return response.data;
    },

    updateLivraison: async (id: string, data: UpdateLivraisonDTO) => {
        const response = await apiClient.patch<Livraison>(`/livraisons/${id}/`, data);
        return response.data;
    },

    validateDelivery: async (id: string) => {
        const response = await apiClient.patch(`/livraisons/${id}/validate/`, {});
        return response.data;
    },
};
