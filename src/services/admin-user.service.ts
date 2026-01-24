import { apiClient } from "@/lib/api-client";

/**
 * Backend Admin User Response Model
 * Returned from the API
 */
export interface AdminUserResponse {
  id: string; // UUID
  user_id: string; // User UUID
  user_email: string; // Email
  name: string;
  role: "super_admin" | "gestionnaire" | "superviseur";
  status: "actif" | "inactif";
  last_connection: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Paginated Response from API
 */
export interface PaginatedAdminUsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminUserResponse[];
}

/**
 * Create Admin User DTO
 */
export interface CreateAdminUserDTO {
  email: string;
  name: string;
  password: string;
  confirm_password: string;
  role: "super_admin" | "gestionnaire" | "superviseur";
  status?: "actif" | "inactif"; // Optional, defaults to "actif"
}

/**
 * Update Admin User DTO
 */
export interface UpdateAdminUserDTO {
  name?: string;
  role?: "super_admin" | "gestionnaire" | "superviseur";
  status?: "actif" | "inactif";
}

/**
 * Admin User Service
 * Handles all admin user operations with the backend API
 * Base endpoint: /auth/admin-users/
 */
export const adminUserService = {
  /**
   * GET /auth/admin-users/
   * List all admin users with optional filtering and sorting
   */
  getAllAdminUsers: async (params?: {
    search?: string;
    ordering?: string;
  }): Promise<AdminUserResponse[]> => {
    try {
      const response = await apiClient.get<PaginatedAdminUsersResponse>(
        "/auth/admin-users/",
        { params }
      );

      // Return results array from paginated response
      return response.data?.results || [];
    } catch (error) {
      console.error("Error fetching admin users:", error);
      throw error;
    }
  },

  /**
   * GET /auth/admin-users/{admin_id}/
   * Get a single admin user by ID
   */
  getAdminUser: async (id: string): Promise<AdminUserResponse> => {
    try {
      const response = await apiClient.get<AdminUserResponse>(
        `/auth/admin-users/${id}/`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching admin user ${id}:`, error);
      throw error;
    }
  },

  /**
   * POST /auth/admin-users/
   * Create a new admin user
   */
  createAdminUser: async (
    data: CreateAdminUserDTO
  ): Promise<AdminUserResponse> => {
    try {
      const response = await apiClient.post<AdminUserResponse>(
        "/auth/admin-users/",
        {
          email: data.email,
          name: data.name,
          password: data.password,
          confirm_password: data.confirm_password,
          role: data.role,
          status: data.status || "actif",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating admin user:", error);
      throw error;
    }
  },

  /**
   * PUT /auth/admin-users/{admin_id}/
   * Update an existing admin user
   */
  updateAdminUser: async (
    id: string,
    data: UpdateAdminUserDTO
  ): Promise<AdminUserResponse> => {
    try {
      const response = await apiClient.put<AdminUserResponse>(
        `/auth/admin-users/${id}/`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating admin user ${id}:`, error);
      throw error;
    }
  },

  /**
   * DELETE /auth/admin-users/{admin_id}/
   * Delete an admin user
   */
  deleteAdminUser: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/auth/admin-users/${id}/`);
    } catch (error) {
      console.error(`Error deleting admin user ${id}:`, error);
      throw error;
    }
  },
};
