# 🚀 Guide des Prochaines Étapes

## Phase 1: Intégration API Réelle (1-2 semaines)

### Objectif
Connecter la carte à votre API backend et remplacer les données mockées.

### Étapes

#### 1.1 Préparer le Backend
Assurez-vous que votre API fournit ces endpoints:

```
GET /api/livraisons
  Query: ?date=2024-01-23&zone=Zone-1&agent=Agent-1
  Response: { results: [...] }

GET /api/agents
  Query: ?zone=Zone-1
  Response: { results: [...] }

GET /api/zones
  Response: { results: [...] }

GET /api/heatmap
  Query: ?zone=Zone-1
  Response: { results: [...] }

GET /api/routes
  Query: ?agent=Agent-1
  Response: { results: [...] }
```

#### 1.2 Adapter le Service
**Fichier**: `src/services/cartography.service.ts`

```typescript
// Avant (mock)
export const cartographyService = {
  getDeliveryMarkers: async (filters) => {
    return mockDeliveryMarkers.filter(...);
  }
};

// Après (API réelle)
export const cartographyService = {
  getDeliveryMarkers: async (filters) => {
    try {
      const response = await apiClient.get("/livraisons", { params: filters });
      return response.data.results || response.data;
    } catch (error) {
      console.error("Erreur API livraisons:", error);
      return []; // Fallback
    }
  }
};
```

#### 1.3 Tester les Appels API
1. Lancer le serveur frontend: `npm run dev`
2. Vérifier DevTools → Network
3. Chercher les appels `/livraisons`, `/agents`, etc.
4. Vérifier que les données s'affichent correctement

#### 1.4 Gérer les Erreurs
Ajouter des notifications d'erreur:

```typescript
import { toast } from "sonner";

try {
  const data = await cartographyService.getDeliveryMarkers(filters);
} catch (error) {
  toast.error("Impossible de charger les livraisons");
}
```

### Temps Estimé: 1-2 jours

---

## Phase 2: WebSocket pour Live Tracking (2-3 semaines)

### Objectif
Afficher les positions des agents en temps réel via WebSocket.

### Étapes

#### 2.1 Implémenter WebSocket Client
**Nouveau fichier**: `src/hooks/use-agent-tracking.ts`

```typescript
import { useEffect, useState } from "react";

export function useAgentTracking() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "agent_location_update") {
        setAgents((prev) =>
          prev.map((a) =>
            a.id === data.agent_id
              ? { ...a, lat: data.lat, lng: data.lng }
              : a
          )
        );
      }
    };

    return () => socket.close();
  }, []);

  return agents;
}
```

#### 2.2 Utiliser le Hook dans MapComponent
```typescript
const liveAgents = useAgentTracking();

// Fusionner avec les agents statiques
const allAgents = [...initialAgents, ...liveAgents];
```

#### 2.3 Animer les Mouvements
```typescript
function animateMarker(lat1: number, lng1: number, lat2: number, lng2: number) {
  // Interpolation smooth du marker
  let progress = 0;
  const duration = 1000; // 1 seconde
  const startTime = Date.now();

  const animate = () => {
    progress = (Date.now() - startTime) / duration;
    if (progress < 1) {
      const lat = lat1 + (lat2 - lat1) * progress;
      const lng = lng1 + (lng2 - lng1) * progress;
      marker.setLatLng([lat, lng]);
      requestAnimationFrame(animate);
    } else {
      marker.setLatLng([lat2, lng2]);
    }
  };

  animate();
}
```

### Temps Estimé: 2-3 jours

---

## Phase 3: Clustering de Marqueurs (1-2 semaines)

### Objectif
Améliorer les performances avec beaucoup de marqueurs via clustering.

### Étapes

#### 3.1 Installer le Plugin
```bash
npm install leaflet.markercluster
npm install --save-dev @types/leaflet.markercluster
```

#### 3.2 Importer et Utiliser
**Fichier**: `src/app/(main)/dashboard/map/_components/map.tsx`

```typescript
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Dans le composant:
const markerGroup = L.markerClusterGroup({
  maxClusterRadius: 80,
  disableClusteringAtZoom: 16,
});

deliveryMarkers.forEach((marker) => {
  const leafletMarker = L.marker([marker.lat, marker.lng]);
  markerGroup.addLayer(leafletMarker);
});

map.current!.addLayer(markerGroup);
```

#### 3.3 Customiser le Style
```typescript
const markerGroup = L.markerClusterGroup({
  iconCreateFunction: (cluster) => {
    const count = cluster.getChildCount();
    return L.divIcon({
      html: `<div class="cluster-icon">${count}</div>`,
      iconSize: [40, 40],
    });
  },
});
```

### Temps Estimé: 1-2 jours

---

## Phase 4: Export et Rapports (1-2 semaines)

### Objectif
Permettre l'export de la carte et des données en PDF/image.

### Étapes

#### 4.1 Installer les Dépendances
```bash
npm install html2canvas jspdf
npm install --save-dev @types/html2canvas
```

#### 4.2 Créer une Fonction d'Export
**Nouveau fichier**: `src/app/(main)/dashboard/map/_components/export.tsx`

```typescript
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportMapAsPDF(mapElement: HTMLElement) {
  const canvas = await html2canvas(mapElement);
  const pdf = new jsPDF("l", "mm", "a4");
  
  pdf.addImage(
    canvas.toDataURL("image/png"),
    "PNG",
    10,
    10,
    190,
    140
  );
  
  pdf.save("cartographie.pdf");
}

export async function exportMapAsImage(mapElement: HTMLElement) {
  const canvas = await html2canvas(mapElement);
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "cartographie.png";
  link.click();
}
```

#### 4.3 Ajouter les Boutons
```typescript
<div className="flex gap-2">
  <Button onClick={() => exportMapAsPDF(mapRef.current!)}>
    <Download /> Exporter PDF
  </Button>
  <Button onClick={() => exportMapAsImage(mapRef.current!)}>
    <Image /> Exporter Image
  </Button>
</div>
```

### Temps Estimé: 1-2 jours

---

## Phase 5: Calcul d'Itinéraire Temps Réel (2-4 semaines)

### Objectif
Calculer les itinéraires optimisés automatiquement.

### Étapes

#### 5.1 Choisir un Service de Routing
**Options**:
- OSRM (open-source, gratuit)
- Mapbox Routing (API payante)
- Google Maps Directions (API payante)

#### 5.2 Implémenter OSRM (Recommandé)
```bash
npm install osrm-client
```

#### 5.3 Créer un Service de Routing
**Nouveau fichier**: `src/services/routing.service.ts`

```typescript
import { Client } from "osrm-client";

const osrmClient = new Client({
  baseURL: "http://router.project-osrm.org/route/v1",
});

export const routingService = {
  getOptimalRoute: async (coordinates: [number, number][]) => {
    const response = await osrmClient.route({
      coordinates,
      annotations: ["distance", "duration"],
    });

    return {
      distance: response.routes[0].distance / 1000, // km
      duration: response.routes[0].duration / 60, // minutes
      geometry: response.routes[0].geometry,
    };
  },

  getMatrix: async (origins: [number, number][], destinations: [number, number][]) => {
    return await osrmClient.table({
      coordinates: [...origins, ...destinations],
    });
  },
};
```

#### 5.4 Utiliser dans MapComponent
```typescript
useEffect(() => {
  const calculateRoutes = async () => {
    const routes = await Promise.all(
      agentPositions.map(async (agent) => {
        const deliveries = deliveryMarkers.filter((m) => m.agent === agent.id);
        const coordinates = [
          [agent.lng, agent.lat], // Note: OSRM utilise [lng, lat]
          ...deliveries.map((d) => [d.lng, d.lat]),
        ];

        const route = await routingService.getOptimalRoute(coordinates);
        return route;
      })
    );

    setCalculatedRoutes(routes);
  };

  calculateRoutes();
}, [agentPositions, deliveryMarkers]);
```

### Temps Estimé: 2-3 jours

---

## Phase 6: Optimisation et Scalabilité (Ongoing)

### Objectif
Préparer la carte pour la production à grande échelle.

### Considérations

#### 6.1 Pagination
Si > 100 marqueurs, implémenter pagination:

```typescript
const [page, setPage] = useState(1);
const pageSize = 50;

const paginatedMarkers = deliveryMarkers.slice(
  (page - 1) * pageSize,
  page * pageSize
);
```

#### 6.2 Caching
Ajouter un cache pour les données:

```typescript
const cache = new Map();

export async function getCachedDeliveries(date: string) {
  if (cache.has(date)) {
    return cache.get(date);
  }

  const data = await cartographyService.getDeliveryMarkers({ date });
  cache.set(date, data);
  return data;
}
```

#### 6.3 Service Worker
Pour support offline:

```typescript
// public/service-worker.js
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("cartography-v1").then((cache) => {
      return cache.addAll([
        "/dashboard/map",
        "/api/zones",
      ]);
    })
  );
});
```

#### 6.4 Monitoring
Ajouter des métriques:

```typescript
// Temps de chargement
const startTime = Date.now();
const data = await loadMapData();
const duration = Date.now() - startTime;
console.log(`Chargement en ${duration}ms`);

// Envoyer à Analytics
analytics.trackEvent("map_load", { duration });
```

### Temps Estimé: Ongoing

---

## Roadmap Visuelle

```
Aujourd'hui
    ↓
[✓ Intégration Leaflet]
    ↓
Semaine 1-2
    ↓
[Phase 1: API Réelle] ← PRIORITÉ 1
    ↓
Semaine 2-3
    ↓
[Phase 2: WebSocket] ← PRIORITÉ 2
    ↓
Semaine 3-4
    ↓
[Phase 3: Clustering] ← PRIORITÉ 3
    ↓
Semaine 4-5
    ↓
[Phase 4: Export] ← PRIORITÉ 4
    ↓
Semaine 6-9
    ↓
[Phase 5: Routing] ← PRIORITÉ 5
    ↓
Semaine 9+
    ↓
[Phase 6: Optimisation] ← Ongoing
```

---

## Ressources et Références

### Documentation Officielle
- Leaflet: https://leafletjs.com
- Leaflet Plugins: https://leafletjs.com/plugins
- OSRM: http://project-osrm.org
- Next.js: https://nextjs.org/docs
- React: https://react.dev

### Plugins Recommandés
- **Clustering**: leaflet.markercluster
- **Heat**: leaflet.heat
- **Drawing**: leaflet-draw
- **Routing**: leaflet-routing-machine

### Services Tiers
- **Routing**: OSRM (gratuit), Mapbox, Google Maps
- **Tiles**: OpenStreetMap, Stamen, CartoDB
- **Geocoding**: Nominatim, Mapbox, Google Maps

---

## Support et Questions

### Documentation Interne
- `CARTOGRAPHY_INTEGRATION.md` - Architecture complète
- `CARTOGRAPHY_QUICKSTART.md` - Guide de démarrage
- `CARTOGRAPHY_TECHNICAL.md` - Guide technique

### Assistance
- Consultez les commentaires du code
- Vérifiez la console navigateur pour les erreurs
- Utilisez React DevTools pour le debugging
- Vérifiez DevTools → Network pour les API

---

## Conclusion

L'intégration Leaflet est maintenant **complète et opérationnelle**. Cette feuille de route vous guide à travers les améliorations progressives pour arriver à une solution production-ready complète.

**Approche Recommandée**:
1. Commencez par l'API réelle (Phase 1) - C'est la priorité
2. Puis WebSocket (Phase 2) - Pour l'expérience en temps réel
3. Puis Clustering (Phase 3) - Si beaucoup de données
4. Puis Export (Phase 4) - Si besoin de rapports
5. Puis Routing (Phase 5) - Pour optimisation avancée

Chaque phase peut être déployée indépendamment. Bonne chance! 🚀

---

**Date**: 23 janvier 2026  
**Version**: 1.0  
**Status**: ✅ Ready for Next Steps
