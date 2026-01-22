import { apiClient } from "@/lib/api-client";

export interface Client {
    id: string;
    nom_point_vente: string;
    responsable: string;
    telephone: string;
    adresse: string;
    user_details?: { email?: string; [k: string]: any };
    email?: string;
    // Add other fields as returned by the API
}

export interface CreateClientDTO {
    nom_point_vente: string;
    responsable: string;
    telephone: string;
    adresse: string;
}

export interface UpdateClientDTO {
    nom_point_vente?: string;
    responsable?: string;
    telephone?: string;
    adresse?: string;
}

export const clientService = {
    getAllClients: async (params?: Record<string, any>) => {
        const response = await apiClient.get("/clients/", { params });
        // Backend returns a paginated object { count, next, previous, results }
        return (response.data as any)?.results ?? response.data;
    },

    getClient: async (id: string) => {
        const response = await apiClient.get<Client>(`/clients/${id}/`);
        return response.data;
    },

    createClient: async (data: CreateClientDTO) => {
        const response = await apiClient.post<Client>("/clients/", data);
        return response.data;
    },

    updateClient: async (id: string, data: UpdateClientDTO) => {
        const response = await apiClient.put<Client>(`/clients/${id}/`, data);
        return response.data;
    },

    deleteClient: async (id: string) => {
        await apiClient.delete(`/clients/${id}/`);
    },
};
