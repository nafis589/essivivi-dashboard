import { apiClient } from "@/lib/api-client";

export interface Commande {
    id: string;
    client: string;
    qt_commandee: number;
    statut?: string;
    date_creation?: string;
    agent?: string;
    // Add other fields as returned by the API
}

export interface CreateCommandeDTO {
    client: string;
    qt_commandee: number;
}

export interface UpdateCommandeDTO {
    qt_commandee?: number;
    statut?: string;
}

export interface AssignAgentDTO {
    agent_id: string;
}

export const commandeService = {
    getAllCommandes: async (params?: Record<string, any>) => {
        const response = await apiClient.get("/commandes/", { params });
        // Backend returns a paginated object { count, next, previous, results }
        return (response.data as any)?.results ?? response.data;
    },

    getCommande: async (id: string) => {
        const response = await apiClient.get<Commande>(`/commandes/${id}/`);
        return response.data;
    },

    createCommande: async (data: CreateCommandeDTO) => {
        const response = await apiClient.post<Commande>("/commandes/", data);
        return response.data;
    },

    updateCommande: async (id: string, data: UpdateCommandeDTO) => {
        const response = await apiClient.put<Commande>(`/commandes/${id}/`, data);
        return response.data;
    },

    deleteCommande: async (id: string) => {
        await apiClient.delete(`/commandes/${id}/`);
    },

    assignAgent: async (id: string, data: AssignAgentDTO) => {
        const response = await apiClient.post(`/commandes/${id}/assign_agent/`, data);
        return response.data;
    },
};
