# 🔧 Guide Technique et Exemples d'Utilisation

## Table des Matières

1. [Architecture Technique](#architecture-technique)
2. [Flux de Données](#flux-de-données)
3. [Exemples de Code](#exemples-de-code)
4. [API du Service](#api-du-service)
5. [Personnalisation](#personnalisation)
6. [Points d'Intégration](#points-dintégration)

---

## Architecture Technique

### Pile Technologique

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js 16                            │
│            (Framework React avec SSR/SSG)               │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Composants React (Client)                  │
│  ┌──────────┬──────────┬──────────┬──────────────────┐  │
│  │CartogView│MapStats  │MapFilters│MapComponent     │  │
│  └──────────┴──────────┴──────────┴──────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│          Service de Données (cartography.service.ts)    │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Filtrage & Récupération des Données Mockées        │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  Librairie Leaflet.js + Plugins                         │
│  ┌──────────┬──────────┬──────────┬──────────────────┐  │
│  │  Carte   │ Marqueurs│  Zones   │  Heatmap/Routes  │  │
│  │ OSM Tile │ Popups   │ Cercles  │  Polylines       │  │
│  └──────────┴──────────┴──────────┴──────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Composants et Responsabilités

#### `CartographyView` (Orchestration)
- Gère l'état global (date, zone, agent, heatmap, routes)
- Transmet les filtres aux sous-composants
- Compose l'interface complet

```typescript
function CartographyView() {
  const [selectedDate, setSelectedDate] = useState("");
  // ... (5 états)
  
  return (
    <MapStatsCards filters={{date, zone, agent}} />
    <MapFilters onFiltersChange={...} />
    <MapComponent filters={{date, zone, agent}} />
  );
}
```

#### `MapStatsCards` (Statistiques)
- Récupère les données via le service
- Calcule les KPIs (total, complètement, en cours)
- Affiche 4 cartes réactives

```typescript
interface MapStatsCardsProps {
  selectedDate?: string;
  selectedZone?: string;
  selectedAgent?: string;
}
```

#### `MapFilters` (Formulaire)
- Charge les options des dropdowns
- Gère les states des checkboxes
- Affiche les filtres actifs

```typescript
interface MapFiltersProps {
  onDateChange: (date: string) => void;
  onZoneChange: (zone: string) => void;
  onAgentChange: (agent: string) => void;
  onHeatmapToggle: (enabled: boolean) => void;
  onRoutesToggle: (enabled: boolean) => void;
}
```

#### `MapComponent` (Carte Interactive)
- Initialise la carte Leaflet
- Ajoute/retire les couches dynamiquement
- Gère les interactions utilisateur
- Rend la légende

```typescript
interface MapComponentProps {
  selectedDate?: string;
  selectedZone?: string;
  selectedAgent?: string;
  showHeatmap?: boolean;
  showRoutes?: boolean;
}
```

---

## Flux de Données

### Cycle de Filtrage

```
User sélectionne une date
           ↓
setSelectedDate("2024-01-23")
           ↓
CartographyView state change
           ↓
Props down à MapStatsCards + MapComponent
           ↓
useEffect déclenché avec la date en dépendance
           ↓
cartographyService.getDeliveryMarkers({ date })
           ↓
Filtrage des données mockées
           ↓
Mise à jour des marqueurs Leaflet
           ↓
Recalcul des statistiques
           ↓
Re-render des composants affectés
```

### Exemple Détaillé: Filtre Agent

1. **Utilisateur sélectionne "Michel Dupont"**
```tsx
<Select value={selectedAgent} onValueChange={onAgentChange} />
// onAgentChange = setSelectedAgent
```

2. **État remonte**
```tsx
setSelectedAgent("Agent-1");
// CartographyView state: {selectedAgent: "Agent-1"}
```

3. **Props transmis**
```tsx
<MapComponent 
  selectedAgent={selectedAgent}  // "Agent-1"
  selectedDate={selectedDate}
  selectedZone={selectedZone}
/>
```

4. **useEffect déclenché**
```typescript
useEffect(() => {
  loadMapData();
}, [selectedDate, selectedZone, selectedAgent]); // selectedAgent changé!
```

5. **Appel au service**
```typescript
const markers = await cartographyService.getDeliveryMarkers({
  agent: "Agent-1" // Filtre appliqué
});
```

6. **Mise à jour visuelle**
```typescript
// Seuls les marqueurs avec agent_id === "Agent-1" restent
// Les statistics recalculent: 2 livraisons au lieu de 8
```

---

## Exemples de Code

### Exemple 1: Ajouter un Nouveau Filtre

**Fichier**: `src/app/(main)/dashboard/map/_components/filters.tsx`

```typescript
// Ajouter une interface pour la route/itinéraire
interface MapFiltersProps {
  // ... props existantes
  onRouteChange: (route: string) => void;
  selectedRoute?: string;
}

export function MapFilters({
  // ... props existantes
  onRouteChange,
  selectedRoute,
}: MapFiltersProps) {
  const [routes, setRoutes] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    // Charger les routes disponibles
    const loadRoutes = async () => {
      const routesList = await cartographyService.getAvailableRoutes();
      setRoutes(routesList);
    };
    loadRoutes();
  }, []);

  return (
    // ... component JSX
    <Select value={selectedRoute || ""} onValueChange={onRouteChange}>
      <SelectTrigger>
        <SelectValue placeholder="Toutes les routes" />
      </SelectTrigger>
      <SelectContent>
        {routes.map((route) => (
          <SelectItem key={route.id} value={route.id}>
            {route.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Exemple 2: Ajouter une Couche Personnalisée

**Fichier**: `src/app/(main)/dashboard/map/_components/map.tsx`

```typescript
// Ajouter dans le composant MapComponent
const clustersRef = useRef<L.LayerGroup | null>(null);

// Dans le useEffect, après l'initialisation:
const loadCustomLayer = async () => {
  if (!map.current) return;

  // Créer un groupe de couches
  clustersRef.current = L.layerGroup().addTo(map.current);

  // Récupérer les clusters depuis le service
  const clusters = await customService.getClusters();

  // Ajouter les clusters à la couche
  clusters.forEach((cluster) => {
    const marker = L.marker([cluster.lat, cluster.lng])
      .bindPopup(cluster.name)
      .addTo(clustersRef.current!);
  });
};

// Dans le cleanup:
if (clustersRef.current) {
  map.current!.removeLayer(clustersRef.current);
}
```

### Exemple 3: Modifier le Style des Marqueurs

```typescript
// Dans map.tsx, fonction createMarkerIcon
function createMarkerIcon(type: "delivery" | "agent", status?: string) {
  // Custom SVG au lieu de div
  const svgString = `
    <svg width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="15" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="16" y="20" text-anchor="middle" font-size="16">📦</text>
    </svg>
  `;

  return L.divIcon({
    html: svgString,
    iconSize: [32, 32],
    popupAnchor: [0, -16],
  });
}
```

### Exemple 4: Ajouter une Animation de Marqueur

```typescript
// Animer un agent en temps réel
function animateAgentMovement(lat1: number, lng1: number, lat2: number, lng2: number) {
  const marker = L.marker([lat1, lng1]).addTo(map.current!);
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += 0.01;
    
    if (progress >= 1) {
      clearInterval(interval);
      marker.setLatLng([lat2, lng2]);
      return;
    }
    
    const lat = lat1 + (lat2 - lat1) * progress;
    const lng = lng1 + (lng2 - lng1) * progress;
    marker.setLatLng([lat, lng]);
  }, 16); // ~60 FPS
}
```

### Exemple 5: Ajouter un Événement sur la Carte

```typescript
// Déterminer la zone cliquée
if (map.current) {
  map.current.on("click", (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    
    // Trouver la zone au clic
    const clickedZone = mockServiceZones.find((zone) => {
      const distance = Math.sqrt(
        Math.pow(lat - zone.center[0], 2) + 
        Math.pow(lng - zone.center[1], 2)
      );
      return distance * 111 < zone.radius / 1000;
    });

    if (clickedZone) {
      console.log("Zone cliquée:", clickedZone.name);
      onZoneChange(clickedZone.id);
    }
  });
}
```

---

## API du Service

### Types et Interfaces

```typescript
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
  intensity: number; // 0-1
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
```

### Méthodes du Service

```typescript
// Récupérer avec filtres optionnels
cartographyService.getDeliveryMarkers({
  date?: "2024-01-23",
  zone?: "Zone-1",
  agent?: "Agent-1"
});
// Retour: DeliveryMarker[]

// Récupérer les agents d'une zone (optionnel)
cartographyService.getAgentPositions("Zone-1");
// Retour: AgentPosition[]

// Récupérer les zones
cartographyService.getServiceZones();
// Retour: ServiceZone[]

// Récupérer la heatmap (optionnel: filtrer par zone)
cartographyService.getHeatmapData("Zone-1");
// Retour: HeatmapPoint[]

// Récupérer les routes (optionnel: filtrer par agent)
cartographyService.getOptimizedRoutes("Agent-1");
// Retour: OptimizedRoute[]

// Récupérer les options de dropdown
cartographyService.getAvailableZones();
// Retour: Array<{id: string, name: string}>

cartographyService.getAvailableAgents();
// Retour: Array<{id: string, name: string}>
```

---

## Personnalisation

### Personnaliser les Couleurs des Zones

**Fichier**: `src/services/cartography.service.ts`

```typescript
export const mockServiceZones: ServiceZone[] = [
  {
    id: "Zone-1",
    name: "Zone Centre-Rive Gauche",
    center: [48.8495, 2.3548],
    radius: 1500,
    type: "circle",
    color: "#FF6B6B", // Changer à rouge
  },
  // ...
];
```

### Personnaliser les Statuts

```typescript
// Dans map.tsx, fonction createMarkerIcon
const colors: Record<string, string> = {
  completed: "#10b981",
  in_delivery: "#f59e0b",
  pending: "#6b7280",
  cancelled: "#ef4444",
  custom_status: "#8b5cf6", // Ajouter un nouveau
};
```

### Personnaliser la Heatmap

```typescript
// Dans map.tsx
const heatLayer = (L as any).heatLayer(heatmapPoints, {
  max: 1,                    // Intensité max
  radius: 35,                // Augmenter pour plus flou
  blur: 20,                  // Augmenter pour plus doux
  gradient: {
    0.0: "#0000ff",         // Bleu (faible)
    0.5: "#ffff00",         // Jaune (moyen)
    1.0: "#ff0000",         // Rouge (fort)
  },
});
```

### Personnaliser le Zoom Initial

```typescript
// Dans map.tsx, initialisation
if (!map.current) {
  map.current = L.map(mapContainer.current).setView(
    [48.8566, 2.3522],  // Latitude, Longitude du centre
    13                   // Zoom level (1-19)
  );
}

// Recommandé: 13 pour ville, 15+ pour quartier, 10 pour région
```

### Personnaliser les Popups

```typescript
// Dans map.tsx, pour les marqueurs
const popup = `
  <div style="width: 250px; font-size: 13px; line-height: 1.6;">
    <h4 style="margin: 0 0 8px;">${marker.name}</h4>
    <hr style="margin: 4px 0;" />
    <p><strong>Adresse:</strong> ${marker.address}</p>
    <p><strong>Statut:</strong> ${marker.status}</p>
    <p><strong>Zone:</strong> ${marker.zone}</p>
    ${marker.agent ? `<p><strong>Agent:</strong> ${marker.agent}</p>` : ""}
    <button onclick="console.log('Detail click')">Détails</button>
  </div>
`;

marker.bindPopup(popup);
```

---

## Points d'Intégration

### 1. Intégration WebSocket (Temps Réel)

```typescript
// Dans map.tsx, useEffect
useEffect(() => {
  const socket = new WebSocket("ws://localhost:8080");

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "agent_location_update") {
      // Mettre à jour la position de l'agent
      const agentMarker = markersRef.current.find(
        (m) => m.getLatLng().lat === data.lat
      );
      if (agentMarker) {
        agentMarker.setLatLng([data.lat, data.lng]);
      }
    }
  };

  return () => socket.close();
}, []);
```

### 2. Intégration API Réelle

```typescript
// Dans cartography.service.ts
export const cartographyService = {
  getDeliveryMarkers: async (filters?: any) => {
    try {
      const response = await apiClient.get("/livraisons", { params: filters });
      return response.data.results || response.data;
    } catch (error) {
      console.error("Erreur API:", error);
      return []; // Fallback
    }
  },
  // ... autres méthodes
};
```

### 3. Intégration Notification (Toast)

```typescript
// Dans filters.tsx
import { toast } from "sonner";

const handleResetFilters = () => {
  onDateChange("");
  onZoneChange("");
  onAgentChange("");
  setShowHeatmap(false);
  setShowRoutes(false);
  
  toast.success("Filtres réinitialisés");
};
```

### 4. Intégration Export Carte

```typescript
// Dans map.tsx
import { toPng } from "html-to-image";

const handleExportMap = async () => {
  if (!mapContainer.current) return;
  
  const image = await toPng(mapContainer.current);
  const link = document.createElement("a");
  link.href = image;
  link.download = "map-export.png";
  link.click();
};
```

### 5. Intégration Impression

```typescript
const handlePrintMap = () => {
  if (!mapContainer.current) return;
  
  const printWindow = window.open("", "", "width=900,height=900");
  printWindow?.document.write(mapContainer.current.innerHTML);
  printWindow?.print();
};
```

---

**Dernière mise à jour**: 23 janvier 2026  
**Prêt pour production** ✅
