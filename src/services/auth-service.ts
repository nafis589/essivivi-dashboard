import { apiClient } from "@/lib/api-client";
import { z } from "zod";

// Define schemas matching the backend expectations
export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export type LoginCredentials = z.infer<typeof LoginSchema>;

export type UserRole = "Super Admin" | "Gestionnaire" | "Superviseur";

export interface User {
    id: string;
    name?: string; // Note: BACKEND_NEEDS says user object in login response has id and role. Name might be in a separate profile endpoint or included.
    email?: string;
    role: UserRole;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user: User;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/auth/login/", credentials);
        return response.data;
    },

    async refreshToken(refresh: string): Promise<{ access: string }> {
        const response = await apiClient.post<{ access: string }>("/auth/token/refresh/", { refresh });
        return response.data;
    },

    logout() {
        if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        }
    },

    // Helper to store session
    setSession(authData: AuthResponse) {
        if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", authData.access);
            localStorage.setItem("refreshToken", authData.refresh);
            localStorage.setItem("user", JSON.stringify(authData.user));
        }
    },

    getUser(): User | null {
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    return JSON.parse(userStr);
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    }
};
