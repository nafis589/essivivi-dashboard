
import { apiClient } from "@/lib/api-client";

export interface Agent {
    id: string; // or number, based on API response
    nom: string;
    prenom: string;
    telephone: string;
    tricycle_assigne?: string;
    statut?: string;
    date_embauche?: string;
    email?: string;
    user_details?: { email?: string; [k: string]: any };
    // Add other fields as returned by the API
}

export interface CreateAgentDTO {
    nom: string;
    prenom: string;
    telephone: string;
    tricycle_assigne?: string;
}

export interface UpdateAgentDTO {
    nom?: string;
    prenom?: string;
    telephone?: string;
    tricycle_assigne?: string;
    statut?: string;
}

export const agentService = {
    getAllAgents: async (params?: Record<string, any>) => {
        const response = await apiClient.get("/agents/", { params });
        // Backend returns a paginated object { count, next, previous, results }
        return (response.data as any)?.results ?? response.data;
    },

    getAgent: async (id: string) => {
        const response = await apiClient.get<Agent>(`/agents/${id}/`);
        return response.data;
    },

    createAgent: async (data: CreateAgentDTO) => {
        const response = await apiClient.post<Agent>("/agents/", data);
        return response.data;
    },

    updateAgent: async (id: string, data: UpdateAgentDTO) => {
        const response = await apiClient.put<Agent>(`/agents/${id}/`, data);
        return response.data;
    },

    deleteAgent: async (id: string) => {
        await apiClient.delete(`/agents/${id}/`);
    },
};
