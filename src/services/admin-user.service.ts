
import { apiClient } from "@/lib/api-client";

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: "super_admin" | "gestionnaire" | "superviseur";
    status: "actif" | "inactif" | "banni";
    lastConnection?: string; // Not explicitly in API response example but in frontend schema
    created_at?: string;
}

export interface CreateAdminUserDTO {
    email: string;
    name: string;
    role: string;
    status: string;
    password?: string; // API likely needs password for creation even if not in example JSON body for GET
}

export interface UpdateAdminUserDTO {
    name?: string;
    role?: string;
    status?: string;
}

export const adminUserService = {
    getAllAdminUsers: async (params?: { search?: string; page?: number; role?: string; status?: string }) => {
        let url = "/auth/admin-users/";
        if (params?.role) {
            url = "/auth/admin-users/by_role/";
        } else if (params?.status) {
            url = "/auth/admin-users/by_status/";
        }

        const response = await apiClient.get(url, { params });
        // Handle pagination if present, or returning list directly
        return (response.data as any)?.results ?? response.data;
    },

    getAdminUser: async (id: string) => {
        const response = await apiClient.get<AdminUser>(`/auth/admin-users/${id}/`);
        return response.data;
    },

    createAdminUser: async (data: CreateAdminUserDTO) => {
        const response = await apiClient.post<AdminUser>("/auth/admin-users/", data);
        return response.data;
    },

    updateAdminUser: async (id: string, data: UpdateAdminUserDTO) => {
        const response = await apiClient.put<AdminUser>(`/auth/admin-users/${id}/`, data);
        return response.data;
    },

    deleteAdminUser: async (id: string) => {
        await apiClient.delete(`/auth/admin-users/${id}/`);
    },
};
