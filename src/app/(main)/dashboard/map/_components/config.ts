/**
 * Configuration Cartography
 * 
 * Paramètres centralisés pour la carte interactive
 */

// Configuration de la carte Leaflet
export const MAP_CONFIG = {
  // Coordonnées initiales (Paris)
  defaultCenter: {
    lat: 48.8566,
    lng: 2.3522,
  },

  // Zoom initial
  defaultZoom: 13,

  // Zoom min/max
  minZoom: 10,
  maxZoom: 19,

  // Tuiles cartographiques
  tileLayer: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
  },

  // Conteneur de la carte
  containerHeight: "500px",
  containerBorderRadius: "0.375rem",
};

// Configuration Heatmap
export const HEATMAP_CONFIG = {
  max: 1,
  radius: 25,
  blur: 15,
  gradient: {
    0.0: "#0000ff",   // Bleu
    0.25: "#00ff00",  // Vert
    0.5: "#ffff00",   // Jaune
    0.75: "#ff8800",  // Orange
    1.0: "#ff0000",   // Rouge
  },
};

// Configuration Marqueurs
export const MARKER_CONFIG = {
  delivery: {
    iconSize: [32, 32],
    popupAnchor: [0, -16],
    emoji: "📦",
  },
  agent: {
    iconSize: [36, 36],
    popupAnchor: [0, -18],
    emoji: "🚚",
  },
};

// Statuts et couleurs
export const STATUS_COLORS = {
  // Livraisons
  delivery: {
    completed: "#10b981",    // Vert
    in_delivery: "#f59e0b",  // Orange
    pending: "#6b7280",      // Gris
    cancelled: "#ef4444",    // Rouge
  },
  // Agents
  agent: {
    active: "#3b82f6",       // Bleu
    idle: "#fbbf24",         // Jaune
    offline: "#9ca3af",      // Gris
  },
};

// Configuration Filtres
export const FILTER_CONFIG = {
  daysInPast: 7,                    // Nombre de jours à afficher
  dateFormat: "yyyy-MM-dd",         // Format des dates
  maxAgentsInSelect: 20,            // Limite des agents affichés
  maxZonesInSelect: 10,             // Limite des zones affichées
};

// Configuration Routes
export const ROUTE_CONFIG = {
  polylineColor: "#3b82f6",         // Bleu
  polylineWeight: 3,
  polylineOpacity: 0.7,
  polylineDashArray: "5, 5",
};

// Configuration Zones
export const ZONE_CONFIG = {
  circleWeight: 2,
  circleFillOpacity: 0.1,
  circleInteractive: true,
};

// Messages d'interface
export const UI_MESSAGES = {
  filters: {
    title: "Filtres et Options",
    description: "Affinez votre vue de la cartographie",
    resetButton: "Réinitialiser",
    activeFilters: "Filtres actifs",
  },
  map: {
    title: "Carte Interactive - Suivi des Livraisons",
    legend: "Légende",
  },
  stats: {
    deliveriesTotals: "Livraisons totales",
    completionRate: "Taux de complément",
    activeAgents: "Agents actifs",
    pendingDeliveries: "Livraisons en attente",
  },
  errors: {
    loadingFailed: "Erreur lors du chargement des données",
    mapInitFailed: "Impossible d'initialiser la carte",
  },
};

// Délais de mise à jour
export const UPDATE_DELAYS = {
  mapDataFetch: 100,      // ms, délai avant fetch après filtre change
  statisticsUpdate: 500,  // ms, délai avant update stats
};

// Limites de données
export const DATA_LIMITS = {
  maxMarkers: 500,
  maxHeatmapPoints: 1000,
  maxRoutes: 50,
};

// Export par défaut
export default {
  MAP_CONFIG,
  HEATMAP_CONFIG,
  MARKER_CONFIG,
  STATUS_COLORS,
  FILTER_CONFIG,
  ROUTE_CONFIG,
  ZONE_CONFIG,
  UI_MESSAGES,
  UPDATE_DELAYS,
  DATA_LIMITS,
};
