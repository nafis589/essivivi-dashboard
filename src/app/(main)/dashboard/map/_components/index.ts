/**
 * Cartography Module - Exports
 * 
 * Module principal pour l'intégration Leaflet.js dans le dashboard
 * Réexporte tous les composants et services nécessaires
 */

// Services
export { cartographyService } from "@/services/cartography.service";
export type {
  DeliveryMarker,
  AgentPosition,
  ServiceZone,
  HeatmapPoint,
  OptimizedRoute,
} from "@/services/cartography.service";

// Composants
export { CartographyView } from "./cartography-view";
export { MapComponent } from "./map";
export { MapFilters } from "./filters";
export { MapStatsCards } from "./stats-cards";

// Types des composants
export type { default as MapComponentProps } from "./map";
export type { default as MapFiltersProps } from "./filters";
export type { default as MapStatsCardsProps } from "./stats-cards";
