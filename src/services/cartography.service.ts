/**
 * Service de cartographie intégré aux endpoints backend
 * Fournit les données en temps réel depuis l'API
 */

import { apiClient } from "@/lib/api-client";

// Types d'interface
export interface DeliveryMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  status: "pending" | "in_delivery" | "completed" | "cancelled";
  date: string;
  zone: string;
  agent?: string;
}

export interface AgentPosition {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "active" | "idle" | "offline";
  zone: string;
  deliveries_today: number;
  vehicle: string;
  last_update: string;
}

export interface ServiceZone {
  id: string;
  name: string;
  center: [number, number];
  radius: number;
  polygon?: [number, number][];
  type: "circle" | "polygon";
  color: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export interface FilterOption {
  id: string;
  name: string;
}


export interface OptimizedRoute {
  id: string;
  agent_id: string;
  agent_name: string;
  waypoints: [number, number][];
  distance: number;
  duration: number;
  stops: DeliveryMarker[];
}

/**
 * Service de cartographie intégré API
 */
export const cartographyService = {
  /**
   * Récupère tous les marqueurs de livraison depuis le backend
   */
  getDeliveryMarkers: async (filters?: {
    date?: string;
    zone?: string;
    agent?: string;
    status?: string;
  }): Promise<DeliveryMarker[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.date) params.append("date", filters.date);
      if (filters?.zone) params.append("zone", filters.zone);
      if (filters?.agent) params.append("agent", filters.agent);
      if (filters?.status) params.append("status", filters.status);

      const queryString = params.toString();
      const url = `/livraisons${queryString ? "?" + queryString : ""}`;

      const response = await apiClient.get(url);
      const data = response.data.results || response.data;

      // Assurer la compatibilité avec la structure esperée
      return Array.isArray(data) ? data : data?.results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des marqueurs de livraison:", error);
      return [];
    }
  },

  /**
   * Récupère les positions actuelles des agents
   */
  getAgentPositions: async (filters?: {
    zone?: string;
    status?: string;
  }): Promise<AgentPosition[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.zone) params.append("zone", filters.zone);
      if (filters?.status) params.append("status", filters.status);

      const queryString = params.toString();
      const url = `/agents${queryString ? "?" + queryString : ""}`;

      const response = await apiClient.get(url);
      const data = response.data.results || response.data;

      return Array.isArray(data) ? data : data?.results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des positions des agents:", error);
      return [];
    }
  },

  /**
   * Récupère les zones de chalandise
   */
  getServiceZones: async (): Promise<ServiceZone[]> => {
    try {
      const response = await apiClient.get("/cartography/zones");
      const data = response.data.results || response.data;

      return Array.isArray(data) ? data : data?.results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des zones:", error);
      return [];
    }
  },

  /**
   * Récupère les données de heatmap
   */
  getHeatmapData: async (filters?: {
    zone?: string;
    date?: string;
  }): Promise<HeatmapPoint[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.zone) params.append("zone", filters.zone);
      if (filters?.date) params.append("date", filters.date);

      const queryString = params.toString();
      const url = `/heatmap${queryString ? "?" + queryString : ""}`;

      const response = await apiClient.get(url);
      const data = response.data.results || response.data;

      return Array.isArray(data) ? data : data?.results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des données heatmap:", error);
      return [];
    }
  },

  /**
   * Récupère les itinéraires optimisés
   */
  getOptimizedRoutes: async (filters?: {
    agent?: string;
    date?: string;
  }): Promise<OptimizedRoute[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.agent) params.append("agent", filters.agent);
      if (filters?.date) params.append("date", filters.date);

      const queryString = params.toString();
      const url = `/routes${queryString ? "?" + queryString : ""}`;

      const response = await apiClient.get(url);
      const data = response.data.results || response.data;

      return Array.isArray(data) ? data : data?.results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des itinéraires:", error);
      return [];
    }
  },

  /**
   * Récupère les zones disponibles pour les filtres
   */
  getAvailableZones: async (): Promise<FilterOption[]> => {
    try {
      const response = await apiClient.get("/cartography/zones/list");
      const data = response.data.results || response.data;

      return Array.isArray(data) ? data : data?.results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération de la liste des zones:", error);
      return [];
    }
  },

  /**
   * Récupère les agents disponibles pour les filtres
   */
  getAvailableAgents: async (): Promise<FilterOption[]> => {
    try {
      const response = await apiClient.get("/cartography/agents/list");
      const data = response.data.results || response.data;

      return Array.isArray(data) ? data : data?.results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération de la liste des agents:", error);
      return [];
    }
  },

  /**
   * Récupère les statistiques globales (optionnel)
   */
  getStatsSummary: async (date?: string) => {
    try {
      const params = new URLSearchParams();
      if (date) params.append("date", date);

      const queryString = params.toString();
      const url = `/stats/summary${queryString ? "?" + queryString : ""}`;

      const response = await apiClient.get(url);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      return null;
    }
  },
};

