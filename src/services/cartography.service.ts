/**
 * Service de cartographie avec données mockées
 * Fournit les données pour :
 * - Marqueurs de livraison
 * - Positions des agents en tournée
 * - Zones de chalandise
 * - Données de heatmap
 * - Itinéraires optimisés
 */

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
  center: [number, number]; // [lat, lng]
  radius: number; // en mètres
  polygon?: [number, number][]; // points du polygone
  type: "circle" | "polygon";
  color: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1
}

export interface OptimizedRoute {
  id: string;
  agent_id: string;
  agent_name: string;
  waypoints: [number, number][]; // [lat, lng]
  distance: number; // en km
  duration: number; // en minutes
  stops: DeliveryMarker[];
}

/**
 * Données mockées pour les marqueurs de livraison
 */
export const mockDeliveryMarkers: DeliveryMarker[] = [
  {
    id: "delivery_1",
    name: "Supermarché Central",
    lat: 48.8703,
    lng: 2.3412,
    address: "123 Rue de Rivoli, Paris",
    status: "completed",
    date: "2024-01-23",
    zone: "Zone-1",
  },
  {
    id: "delivery_2",
    name: "Pharmacie Montmartre",
    lat: 48.8884,
    lng: 2.3431,
    address: "456 Boulevard Rochechouart, Paris",
    status: "in_delivery",
    date: "2024-01-23",
    zone: "Zone-2",
    agent: "Agent-1",
  },
  {
    id: "delivery_3",
    name: "Restaurant Le Gourmet",
    lat: 48.8566,
    lng: 2.3522,
    address: "789 Champs-Élysées, Paris",
    status: "completed",
    date: "2024-01-23",
    zone: "Zone-1",
  },
  {
    id: "delivery_4",
    name: "Boutique Fashion",
    lat: 48.8606,
    lng: 2.2936,
    address: "101 Rue de Turbigo, Paris",
    status: "pending",
    date: "2024-01-23",
    zone: "Zone-3",
    agent: "Agent-2",
  },
  {
    id: "delivery_5",
    name: "Café du Marais",
    lat: 48.8599,
    lng: 2.3674,
    address: "202 Rue de Turenne, Paris",
    status: "completed",
    date: "2024-01-23",
    zone: "Zone-2",
  },
  {
    id: "delivery_6",
    name: "Librairie Universitaire",
    lat: 48.8495,
    lng: 2.3548,
    address: "303 Boulevard Saint-Germain, Paris",
    status: "in_delivery",
    date: "2024-01-23",
    zone: "Zone-1",
    agent: "Agent-3",
  },
  {
    id: "delivery_7",
    name: "Boulangerie Artisanale",
    lat: 48.875,
    lng: 2.3483,
    address: "404 Rue Caulaincourt, Paris",
    status: "pending",
    date: "2024-01-23",
    zone: "Zone-4",
  },
  {
    id: "delivery_8",
    name: "Magasin Électronique",
    lat: 48.8529,
    lng: 2.3629,
    address: "505 Rue Mouffetard, Paris",
    status: "completed",
    date: "2024-01-23",
    zone: "Zone-3",
  },
];

/**
 * Positions mockées des agents en tournée
 */
export const mockAgentPositions: AgentPosition[] = [
  {
    id: "Agent-1",
    name: "Michel Dupont",
    lat: 48.8884,
    lng: 2.3431,
    status: "active",
    zone: "Zone-2",
    deliveries_today: 8,
    vehicle: "Tricycle-001",
    last_update: "2024-01-23T14:35:00Z",
  },
  {
    id: "Agent-2",
    name: "Sarah Martin",
    lat: 48.8606,
    lng: 2.2936,
    status: "active",
    zone: "Zone-3",
    deliveries_today: 12,
    vehicle: "Tricycle-002",
    last_update: "2024-01-23T14:33:00Z",
  },
  {
    id: "Agent-3",
    name: "Pierre Durand",
    lat: 48.8495,
    lng: 2.3548,
    status: "active",
    zone: "Zone-1",
    deliveries_today: 10,
    vehicle: "Tricycle-003",
    last_update: "2024-01-23T14:34:00Z",
  },
  {
    id: "Agent-4",
    name: "Emma Bernard",
    lat: 48.872,
    lng: 2.328,
    status: "idle",
    zone: "Zone-2",
    deliveries_today: 6,
    vehicle: "Tricycle-004",
    last_update: "2024-01-23T14:20:00Z",
  },
  {
    id: "Agent-5",
    name: "Jean Thomas",
    lat: 48.8434,
    lng: 2.3488,
    status: "active",
    zone: "Zone-1",
    deliveries_today: 9,
    vehicle: "Tricycle-005",
    last_update: "2024-01-23T14:36:00Z",
  },
];

/**
 * Zones de chalandise mockées
 */
export const mockServiceZones: ServiceZone[] = [
  {
    id: "Zone-1",
    name: "Zone Centre-Rive Gauche",
    center: [48.8495, 2.3548],
    radius: 1500,
    type: "circle",
    color: "#3b82f6",
  },
  {
    id: "Zone-2",
    name: "Zone Montmartre-Marais",
    center: [48.8740, 2.3431],
    radius: 1800,
    type: "circle",
    color: "#ef4444",
  },
  {
    id: "Zone-3",
    name: "Zone République-Bastille",
    center: [48.8606, 2.2936],
    radius: 1600,
    type: "circle",
    color: "#10b981",
  },
  {
    id: "Zone-4",
    name: "Zone Opéra-Tuileries",
    center: [48.875, 2.3383],
    radius: 1400,
    type: "circle",
    color: "#f59e0b",
  },
];

/**
 * Points de chaleur (densité de livraisons)
 */
export const mockHeatmapData: HeatmapPoint[] = [
  { lat: 48.8703, lng: 2.3412, intensity: 0.9 },
  { lat: 48.8884, lng: 2.3431, intensity: 0.85 },
  { lat: 48.8566, lng: 2.3522, intensity: 0.8 },
  { lat: 48.8606, lng: 2.2936, intensity: 0.75 },
  { lat: 48.8599, lng: 2.3674, intensity: 0.7 },
  { lat: 48.8495, lng: 2.3548, intensity: 0.88 },
  { lat: 48.875, lng: 2.3483, intensity: 0.6 },
  { lat: 48.8529, lng: 2.3629, intensity: 0.72 },
  // Points supplémentaires pour la densité
  { lat: 48.8668, lng: 2.3522, intensity: 0.65 },
  { lat: 48.8640, lng: 2.3645, intensity: 0.7 },
  { lat: 48.8850, lng: 2.3350, intensity: 0.68 },
  { lat: 48.8750, lng: 2.3200, intensity: 0.55 },
];

/**
 * Itinéraires optimisés mockés
 */
export const mockOptimizedRoutes: OptimizedRoute[] = [
  {
    id: "route_1",
    agent_id: "Agent-1",
    agent_name: "Michel Dupont",
    waypoints: [
      [48.8884, 2.3431],
      [48.8599, 2.3674],
      [48.8650, 2.3550],
      [48.8700, 2.3400],
    ],
    distance: 8.5,
    duration: 45,
    stops: mockDeliveryMarkers.filter((m) => m.agent === "Agent-1"),
  },
  {
    id: "route_2",
    agent_id: "Agent-2",
    agent_name: "Sarah Martin",
    waypoints: [
      [48.8606, 2.2936],
      [48.8680, 2.2850],
      [48.8550, 2.2950],
      [48.8500, 2.3000],
    ],
    distance: 7.2,
    duration: 38,
    stops: mockDeliveryMarkers.filter((m) => m.agent === "Agent-2"),
  },
  {
    id: "route_3",
    agent_id: "Agent-3",
    agent_name: "Pierre Durand",
    waypoints: [
      [48.8495, 2.3548],
      [48.8550, 2.3600],
      [48.8600, 2.3500],
      [48.8530, 2.3450],
    ],
    distance: 6.8,
    duration: 36,
    stops: mockDeliveryMarkers.filter((m) => m.agent === "Agent-3"),
  },
];

/**
 * Service de cartographie
 */
export const cartographyService = {
  /**
   * Récupère tous les marqueurs de livraison
   * Optionnellement filtrés par date, zone ou agent
   */
  getDeliveryMarkers: async (filters?: { date?: string; zone?: string; agent?: string }) => {
    let result = [...mockDeliveryMarkers];

    if (filters?.date) {
      result = result.filter((m) => m.date === filters.date);
    }
    if (filters?.zone) {
      result = result.filter((m) => m.zone === filters.zone);
    }
    if (filters?.agent) {
      result = result.filter((m) => m.agent === filters.agent);
    }

    return result;
  },

  /**
   * Récupère les positions actuelles de tous les agents
   */
  getAgentPositions: async (zone?: string) => {
    let result = [...mockAgentPositions];

    if (zone) {
      result = result.filter((a) => a.zone === zone);
    }

    return result;
  },

  /**
   * Récupère les zones de chalandise
   */
  getServiceZones: async () => {
    return [...mockServiceZones];
  },

  /**
   * Récupère les données de heatmap
   */
  getHeatmapData: async (zone?: string) => {
    if (!zone) {
      return [...mockHeatmapData];
    }

    // Filtrer les points par zone (approximatif)
    const zoneData = mockServiceZones.find((z) => z.id === zone);
    if (!zoneData) return [];

    return mockHeatmapData.filter((point) => {
      const distance = Math.sqrt(
        Math.pow(point.lat - zoneData.center[0], 2) + Math.pow(point.lng - zoneData.center[1], 2)
      );
      return distance * 111000 < zoneData.radius * 1.5; // Approximation: 1 degré ≈ 111km
    });
  },

  /**
   * Récupère les itinéraires optimisés
   */
  getOptimizedRoutes: async (agent?: string) => {
    let result = [...mockOptimizedRoutes];

    if (agent) {
      result = result.filter((r) => r.agent_id === agent);
    }

    return result;
  },

  /**
   * Récupère les zones disponibles pour les filtres
   */
  getAvailableZones: async () => {
    return mockServiceZones.map((z) => ({ id: z.id, name: z.name }));
  },

  /**
   * Récupère les agents disponibles pour les filtres
   */
  getAvailableAgents: async () => {
    return mockAgentPositions.map((a) => ({ id: a.id, name: a.name }));
  },
};
