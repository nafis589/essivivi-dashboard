/**
 * Utilitaires Cartography
 * 
 * Fonctions utilitaires pour les calculs géographiques et conversions
 */

/**
 * Calcule la distance entre deux points GPS en kilomètres
 * Utilise la formule de Haversine
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convertit les degrés en radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Vérifie si un point est à l'intérieur d'un rayon
 * (utilisé pour les zones circulaires)
 */
export function isPointInRadius(
  pointLat: number,
  pointLng: number,
  centerLat: number,
  centerLng: number,
  radiusMeters: number
): boolean {
  const distance = calculateDistance(pointLat, pointLng, centerLat, centerLng);
  return distance * 1000 <= radiusMeters; // Convertir km en m
}

/**
 * Formate une distance en kilomètres pour l'affichage
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Formate une durée en minutes pour l'affichage
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins > 0 ? mins + "m" : ""}`;
}

/**
 * Calcule les limites (bounds) d'une liste de coordonnées
 * Utile pour auto-zoom sur des marqueurs
 */
export function calculateBounds(coordinates: Array<[number, number]>) {
  if (coordinates.length === 0) {
    return null;
  }

  let minLat = coordinates[0][0];
  let maxLat = coordinates[0][0];
  let minLng = coordinates[0][1];
  let maxLng = coordinates[0][1];

  coordinates.forEach(([lat, lng]) => {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });

  return {
    north: maxLat,
    south: minLat,
    east: maxLng,
    west: minLng,
  };
}

/**
 * Groupe les marqueurs par zone
 */
export function groupByZone<T extends { zone: string }>(items: T[]): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  items.forEach((item) => {
    if (!grouped.has(item.zone)) {
      grouped.set(item.zone, []);
    }
    grouped.get(item.zone)!.push(item);
  });

  return grouped;
}

/**
 * Groupe les marqueurs par statut
 */
export function groupByStatus<T extends { status: string }>(items: T[]): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  items.forEach((item) => {
    if (!grouped.has(item.status)) {
      grouped.set(item.status, []);
    }
    grouped.get(item.status)!.push(item);
  });

  return grouped;
}

/**
 * Groupe les marqueurs par agent
 */
export function groupByAgent<T extends { agent?: string }>(items: T[]): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  items.forEach((item) => {
    const agent = item.agent || "sans-agent";
    if (!grouped.has(agent)) {
      grouped.set(agent, []);
    }
    grouped.get(agent)!.push(item);
  });

  return grouped;
}

/**
 * Filtre les marqueurs par rayon autour d'une position
 */
export function filterByRadius<T extends { lat: number; lng: number }>(
  items: T[],
  centerLat: number,
  centerLng: number,
  radiusMeters: number
): T[] {
  return items.filter((item) =>
    isPointInRadius(item.lat, item.lng, centerLat, centerLng, radiusMeters)
  );
}

/**
 * Calcule la statistique moyenne d'une collection
 */
export function calculateAverage<T>(items: T[], selector: (item: T) => number): number {
  if (items.length === 0) return 0;
  const sum = items.reduce((acc, item) => acc + selector(item), 0);
  return sum / items.length;
}

/**
 * Calcule la statistique totale d'une collection
 */
export function calculateTotal<T>(items: T[], selector: (item: T) => number): number {
  return items.reduce((acc, item) => acc + selector(item), 0);
}

/**
 * Génère une couleur basée sur une intensité (0-1)
 */
export function getColorByIntensity(intensity: number): string {
  // Gradient: bleu → vert → jaune → orange → rouge
  if (intensity < 0.25) {
    return `rgb(0, 0, ${Math.round(255 * (intensity / 0.25))})`; // Bleu
  }
  if (intensity < 0.5) {
    return `rgb(0, ${Math.round(255 * ((intensity - 0.25) / 0.25))}, 255)`; // Cyan
  }
  if (intensity < 0.75) {
    return `rgb(0, 255, ${Math.round(255 * (1 - (intensity - 0.5) / 0.25))})`; // Vert-Jaune
  }
  return `rgb(${Math.round(255 * ((intensity - 0.75) / 0.25))}, 255, 0)`; // Jaune-Orange
}

/**
 * Valide les coordonnées GPS
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Formate une adresse pour l'affichage
 */
export function formatAddress(address: string, maxLength: number = 50): string {
  if (address.length <= maxLength) {
    return address;
  }
  return `${address.substring(0, maxLength)}...`;
}

/**
 * Obtient le statut lisible en français
 */
export function getDeliveryStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    completed: "Livré",
    in_delivery: "En cours",
    pending: "En attente",
    cancelled: "Annulé",
  };
  return labels[status] || status;
}

/**
 * Obtient le statut agent lisible en français
 */
export function getAgentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: "Actif",
    idle: "Inactif",
    offline: "Hors ligne",
  };
  return labels[status] || status;
}

/**
 * Formate une date pour l'affichage
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formate une date/heure pour l'affichage
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Crée un hash de couleur stable basé sur une chaîne
 */
export function getHashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Pagination des éléments
 */
export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return items.slice(start, end);
}

/**
 * Obtient le nombre de pages nécessaires
 */
export function getPaginationInfo(total: number, pageSize: number) {
  return {
    totalPages: Math.ceil(total / pageSize),
    totalItems: total,
    pageSize,
  };
}

/**
 * Utilitaire de déduplication
 */
export function deduplicateBy<T, K>(items: T[], selector: (item: T) => K): T[] {
  const seen = new Set<K>();
  return items.filter((item) => {
    const key = selector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
