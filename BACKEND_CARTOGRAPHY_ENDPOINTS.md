# 🔌 ENDPOINTS API - Cartographie Leaflet

**Date**: 23 janvier 2026  
**Version**: 1.0  
**Status**: Documentation Complète

---

## 📋 Vue d'Ensemble

Ce document spécifie **tous les endpoints API** nécessaires au backend pour que l'onglet **Cartographie** fonctionne correctement.

**Total d'endpoints**: 8 endpoints  
**Méthodes**: GET (lectures)  
**Format**: JSON  

---

## 🔌 Endpoints API Détaillés

### 1️⃣ GET /api/livraisons - Récupérer les Marqueurs de Livraison

**Description**: Retourne la liste des livraisons du jour avec filtrage optionnel

**Méthode**: `GET`  
**URL**: `/api/livraisons`

#### Query Parameters (Optionnels)

| Paramètre | Type | Format | Exemple | Description |
|---|---|---|---|---|
| `date` | string | YYYY-MM-DD | `2024-01-23` | Date de filtrage |
| `zone` | string | string | `Zone-1` | ID de zone |
| `agent` | string | string | `Agent-1` | ID d'agent assigné |
| `status` | string | pending\|in_delivery\|completed\|cancelled | `completed` | Filtrer par statut |

#### Request Example

```bash
GET /api/livraisons?date=2024-01-23&zone=Zone-1&agent=Agent-1
```

#### Response Format

```json
{
  "status": "success",
  "count": 2,
  "results": [
    {
      "id": "delivery_1",
      "name": "Supermarché Central",
      "lat": 48.8703,
      "lng": 2.3412,
      "address": "123 Rue de Rivoli, Paris",
      "status": "completed",
      "date": "2024-01-23",
      "zone": "Zone-1",
      "agent": null
    },
    {
      "id": "delivery_2",
      "name": "Pharmacie Montmartre",
      "lat": 48.8884,
      "lng": 2.3431,
      "address": "456 Boulevard Rochechouart, Paris",
      "status": "in_delivery",
      "date": "2024-01-23",
      "zone": "Zone-1",
      "agent": "Agent-1"
    }
  ]
}
```

#### Response Schema

```typescript
interface DeliveryMarkerResponse {
  status: "success" | "error";
  count: number;
  results: Array<{
    id: string;                // Identifiant unique
    name: string;              // Nom du client/lieu
    lat: number;               // Latitude (-90 à 90)
    lng: number;               // Longitude (-180 à 180)
    address: string;           // Adresse complète
    status: "pending" | "in_delivery" | "completed" | "cancelled";
    date: string;              // Format YYYY-MM-DD
    zone: string;              // ID de zone (Zone-1, Zone-2, etc.)
    agent?: string | null;     // ID agent assigné (optionnel)
  }>;
}
```

#### Status Codes

| Code | Signification |
|---|---|
| 200 | ✅ Succès |
| 400 | ❌ Paramètres invalides |
| 401 | ❌ Non authentifié |
| 500 | ❌ Erreur serveur |

---

### 2️⃣ GET /api/agents - Récupérer les Positions des Agents

**Description**: Retourne la liste des agents en tournée avec leurs positions GPS

**Méthode**: `GET`  
**URL**: `/api/agents`

#### Query Parameters (Optionnels)

| Paramètre | Type | Format | Exemple | Description |
|---|---|---|---|---|
| `zone` | string | string | `Zone-1` | Filtrer par zone |
| `status` | string | active\|idle\|offline | `active` | Filtrer par statut |

#### Request Example

```bash
GET /api/agents?zone=Zone-1&status=active
```

#### Response Format

```json
{
  "status": "success",
  "count": 3,
  "results": [
    {
      "id": "Agent-1",
      "name": "Michel Dupont",
      "lat": 48.8884,
      "lng": 2.3431,
      "status": "active",
      "zone": "Zone-2",
      "deliveries_today": 8,
      "vehicle": "Tricycle-001",
      "last_update": "2024-01-23T14:35:00Z"
    },
    {
      "id": "Agent-2",
      "name": "Sarah Martin",
      "lat": 48.8606,
      "lng": 2.2936,
      "status": "active",
      "zone": "Zone-3",
      "deliveries_today": 12,
      "vehicle": "Tricycle-002",
      "last_update": "2024-01-23T14:33:00Z"
    }
  ]
}
```

#### Response Schema

```typescript
interface AgentPositionResponse {
  status: "success" | "error";
  count: number;
  results: Array<{
    id: string;                    // Identifiant unique (Agent-1, Agent-2, etc.)
    name: string;                  // Nom complet de l'agent
    lat: number;                   // Latitude actuelle (-90 à 90)
    lng: number;                   // Longitude actuelle (-180 à 180)
    status: "active" | "idle" | "offline";
    zone: string;                  // Zone assignée (Zone-1, Zone-2, etc.)
    deliveries_today: number;      // Nombre de livraisons du jour
    vehicle: string;               // Identifiant du véhicule (Tricycle-001, etc.)
    last_update: string;           // Timestamp ISO 8601 de la dernière mise à jour
  }>;
}
```

#### Status Codes

| Code | Signification |
|---|---|
| 200 | ✅ Succès |
| 400 | ❌ Paramètres invalides |
| 401 | ❌ Non authentifié |
| 500 | ❌ Erreur serveur |

---

### 3️⃣ GET /api/zones - Récupérer les Zones de Chalandise

**Description**: Retourne la liste de toutes les zones de chalandise

**Méthode**: `GET`  
**URL**: `/api/zones`

#### Query Parameters

Aucun paramètre

#### Request Example

```bash
GET /api/zones
```

#### Response Format

```json
{
  "status": "success",
  "count": 4,
  "results": [
    {
      "id": "Zone-1",
      "name": "Zone Centre-Rive Gauche",
      "center": [48.8495, 2.3548],
      "radius": 1500,
      "type": "circle",
      "color": "#3b82f6",
      "polygon": null
    },
    {
      "id": "Zone-2",
      "name": "Zone Montmartre-Marais",
      "center": [48.8740, 2.3431],
      "radius": 1800,
      "type": "circle",
      "color": "#ef4444",
      "polygon": null
    }
  ]
}
```

#### Response Schema

```typescript
interface ServiceZoneResponse {
  status: "success" | "error";
  count: number;
  results: Array<{
    id: string;                      // Identifiant unique (Zone-1, Zone-2, etc.)
    name: string;                    // Nom descriptif de la zone
    center: [number, number];        // [latitude, longitude] du centre
    radius: number;                  // Rayon en mètres
    type: "circle" | "polygon";      // Type de zone (cercle ou polygone)
    color: string;                   // Code couleur hex (#RRGGBB)
    polygon?: Array<[number, number]> | null;  // Points du polygone si type = polygon
  }>;
}
```

#### Status Codes

| Code | Signification |
|---|---|
| 200 | ✅ Succès |
| 401 | ❌ Non authentifié |
| 500 | ❌ Erreur serveur |

---

### 4️⃣ GET /api/heatmap - Récupérer les Données de Heatmap

**Description**: Retourne les points de densité de livraisons pour la heatmap

**Méthode**: `GET`  
**URL**: `/api/heatmap`

#### Query Parameters (Optionnels)

| Paramètre | Type | Format | Exemple | Description |
|---|---|---|---|---|
| `zone` | string | string | `Zone-1` | Filtrer par zone |
| `date` | string | YYYY-MM-DD | `2024-01-23` | Date de filtrage |

#### Request Example

```bash
GET /api/heatmap?zone=Zone-1&date=2024-01-23
```

#### Response Format

```json
{
  "status": "success",
  "count": 8,
  "results": [
    {
      "lat": 48.8703,
      "lng": 2.3412,
      "intensity": 0.9
    },
    {
      "lat": 48.8884,
      "lng": 2.3431,
      "intensity": 0.85
    },
    {
      "lat": 48.8566,
      "lng": 2.3522,
      "intensity": 0.8
    }
  ]
}
```

#### Response Schema

```typescript
interface HeatmapResponse {
  status: "success" | "error";
  count: number;
  results: Array<{
    lat: number;              // Latitude du point (-90 à 90)
    lng: number;              // Longitude du point (-180 à 180)
    intensity: number;        // Intensité 0 à 1 (0=faible, 1=forte)
  }>;
}
```

#### Status Codes

| Code | Signification |
|---|---|
| 200 | ✅ Succès |
| 400 | ❌ Paramètres invalides |
| 401 | ❌ Non authentifié |
| 500 | ❌ Erreur serveur |

---

### 5️⃣ GET /api/routes - Récupérer les Itinéraires Optimisés

**Description**: Retourne les itinéraires optimisés pour les agents

**Méthode**: `GET`  
**URL**: `/api/routes`

#### Query Parameters (Optionnels)

| Paramètre | Type | Format | Exemple | Description |
|---|---|---|---|---|
| `agent` | string | string | `Agent-1` | Filtrer par agent |
| `date` | string | YYYY-MM-DD | `2024-01-23` | Date de filtrage |

#### Request Example

```bash
GET /api/routes?agent=Agent-1&date=2024-01-23
```

#### Response Format

```json
{
  "status": "success",
  "count": 1,
  "results": [
    {
      "id": "route_1",
      "agent_id": "Agent-1",
      "agent_name": "Michel Dupont",
      "waypoints": [
        [48.8884, 2.3431],
        [48.8599, 2.3674],
        [48.8650, 2.3550],
        [48.8700, 2.3400]
      ],
      "distance": 8.5,
      "duration": 45,
      "stops": [
        {
          "id": "delivery_2",
          "name": "Pharmacie Montmartre",
          "lat": 48.8884,
          "lng": 2.3431,
          "address": "456 Boulevard Rochechouart, Paris",
          "status": "in_delivery",
          "date": "2024-01-23",
          "zone": "Zone-2",
          "agent": "Agent-1"
        }
      ]
    }
  ]
}
```

#### Response Schema

```typescript
interface OptimizedRouteResponse {
  status: "success" | "error";
  count: number;
  results: Array<{
    id: string;                            // Identifiant unique de la route
    agent_id: string;                      // ID de l'agent assigné
    agent_name: string;                    // Nom de l'agent
    waypoints: Array<[number, number]>;    // Points de passage [lat, lng]
    distance: number;                      // Distance totale en km
    duration: number;                      // Durée totale en minutes
    stops: Array<DeliveryMarker>;          // Détails des livraisons (voir endpoint 1)
  }>;
}
```

#### Status Codes

| Code | Signification |
|---|---|
| 200 | ✅ Succès |
| 400 | ❌ Paramètres invalides |
| 401 | ❌ Non authentifié |
| 500 | ❌ Erreur serveur |

---

### 6️⃣ GET /api/zones/list - Récupérer les Zones pour Filtres

**Description**: Retourne une liste simplifiée des zones (pour les dropdowns)

**Méthode**: `GET`  
**URL**: `/api/zones/list`

#### Query Parameters

Aucun paramètre

#### Request Example

```bash
GET /api/zones/list
```

#### Response Format

```json
{
  "status": "success",
  "count": 4,
  "results": [
    {
      "id": "Zone-1",
      "name": "Zone Centre-Rive Gauche"
    },
    {
      "id": "Zone-2",
      "name": "Zone Montmartre-Marais"
    },
    {
      "id": "Zone-3",
      "name": "Zone République-Bastille"
    },
    {
      "id": "Zone-4",
      "name": "Zone Opéra-Tuileries"
    }
  ]
}
```

#### Response Schema

```typescript
interface ZoneListResponse {
  status: "success" | "error";
  count: number;
  results: Array<{
    id: string;        // Identifiant unique
    name: string;      // Nom pour affichage
  }>;
}
```

---

### 7️⃣ GET /api/agents/list - Récupérer les Agents pour Filtres

**Description**: Retourne une liste simplifiée des agents (pour les dropdowns)

**Méthode**: `GET`  
**URL**: `/api/agents/list`

#### Query Parameters

Aucun paramètre

#### Request Example

```bash
GET /api/agents/list
```

#### Response Format

```json
{
  "status": "success",
  "count": 5,
  "results": [
    {
      "id": "Agent-1",
      "name": "Michel Dupont"
    },
    {
      "id": "Agent-2",
      "name": "Sarah Martin"
    },
    {
      "id": "Agent-3",
      "name": "Pierre Durand"
    },
    {
      "id": "Agent-4",
      "name": "Emma Bernard"
    },
    {
      "id": "Agent-5",
      "name": "Jean Thomas"
    }
  ]
}
```

#### Response Schema

```typescript
interface AgentListResponse {
  status: "success" | "error";
  count: number;
  results: Array<{
    id: string;        // Identifiant unique
    name: string;      // Nom pour affichage
  }>;
}
```

---

### 8️⃣ GET /api/stats/summary - Statistiques Globales (Optionnel)

**Description**: Retourne les statistiques globales pour les cartes KPI

**Méthode**: `GET`  
**URL**: `/api/stats/summary`

#### Query Parameters (Optionnels)

| Paramètre | Type | Format | Exemple | Description |
|---|---|---|---|---|
| `date` | string | YYYY-MM-DD | `2024-01-23` | Date de filtrage |

#### Request Example

```bash
GET /api/stats/summary?date=2024-01-23
```

#### Response Format

```json
{
  "status": "success",
  "data": {
    "total_deliveries": 142,
    "completed_deliveries": 98,
    "in_delivery": 24,
    "pending_deliveries": 15,
    "cancelled_deliveries": 5,
    "active_agents": 24,
    "total_agents": 28,
    "completion_rate": 69,
    "average_deliveries_per_agent": 5.68
  }
}
```

#### Response Schema

```typescript
interface StatsResponse {
  status: "success" | "error";
  data: {
    total_deliveries: number;
    completed_deliveries: number;
    in_delivery: number;
    pending_deliveries: number;
    cancelled_deliveries: number;
    active_agents: number;
    total_agents: number;
    completion_rate: number;          // Pourcentage 0-100
    average_deliveries_per_agent: number;
  };
}
```

---

## 📊 Schémas TypeScript Complets

### DeliveryMarker (Livraison)

```typescript
interface DeliveryMarker {
  id: string;                                    // Identifiant unique
  name: string;                                  // Nom du client/lieu
  lat: number;                                   // Latitude GPS
  lng: number;                                   // Longitude GPS
  address: string;                               // Adresse complète
  status: "pending" | "in_delivery" | "completed" | "cancelled";
  date: string;                                  // Format: YYYY-MM-DD
  zone: string;                                  // ID de zone
  agent?: string | null;                         // ID agent assigné (optionnel)
}
```

### AgentPosition (Agent en Tournée)

```typescript
interface AgentPosition {
  id: string;                                    // Identifiant unique
  name: string;                                  // Nom complet
  lat: number;                                   // Latitude GPS actuelle
  lng: number;                                   // Longitude GPS actuelle
  status: "active" | "idle" | "offline";       // Statut actuel
  zone: string;                                  // Zone assignée
  deliveries_today: number;                      // Nombre de livraisons
  vehicle: string;                               // Identifiant véhicule
  last_update: string;                           // Timestamp ISO 8601
}
```

### ServiceZone (Zone de Chalandise)

```typescript
interface ServiceZone {
  id: string;                                    // Identifiant unique
  name: string;                                  // Nom descriptif
  center: [number, number];                      // [latitude, longitude]
  radius: number;                                // Rayon en mètres
  polygon?: Array<[number, number]> | null;     // Points du polygone (optionnel)
  type: "circle" | "polygon";                   // Type de zone
  color: string;                                 // Code couleur hex
}
```

### HeatmapPoint (Point de Chaleur)

```typescript
interface HeatmapPoint {
  lat: number;                                   // Latitude GPS
  lng: number;                                   // Longitude GPS
  intensity: number;                             // Intensité 0-1
}
```

### OptimizedRoute (Itinéraire Optimisé)

```typescript
interface OptimizedRoute {
  id: string;                                    // Identifiant unique
  agent_id: string;                              // ID de l'agent
  agent_name: string;                            // Nom de l'agent
  waypoints: Array<[number, number]>;            // Points de passage [lat, lng]
  distance: number;                              // Distance en km
  duration: number;                              // Durée en minutes
  stops: Array<DeliveryMarker>;                  // Détails des livraisons
}
```

---

## 🔐 Authentification

Tous les endpoints **doivent être protégés** par authentification:

### Bearer Token

```bash
GET /api/livraisons HTTP/1.1
Authorization: Bearer <YOUR_JWT_TOKEN>
Host: api.example.com
```

### Session Cookie

```bash
GET /api/livraisons HTTP/1.1
Cookie: session=<SESSION_ID>
Host: api.example.com
```

---

## ⚙️ Paramètres Communs à Tous les Endpoints

### Headers Recommandés

```
Content-Type: application/json
Accept: application/json
Accept-Language: fr-FR
```

### Response Wrapper Standard

Tous les endpoints retournent ce format:

```json
{
  "status": "success|error",
  "count": 0,
  "results": [],
  "error": {
    "code": "ERROR_CODE",
    "message": "Description de l'erreur"
  }
}
```

### Erreurs Standards

```json
{
  "status": "error",
  "count": 0,
  "results": [],
  "error": {
    "code": "INVALID_PARAMETERS",
    "message": "The date parameter must be in YYYY-MM-DD format"
  }
}
```

---

## 📈 Pagination (Si > 100 Résultats)

Si vos données sont volumineuses, implémentez la pagination:

```bash
GET /api/livraisons?page=1&limit=50
```

Response:

```json
{
  "status": "success",
  "count": 150,
  "total": 350,
  "page": 1,
  "limit": 50,
  "pages": 7,
  "results": []
}
```

---

## 🚀 Intégration Frontend

### Configuration dans `src/lib/api-client.ts`

```typescript
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajouter le token d'authentification
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Utilisation dans `cartography.service.ts`

```typescript
export const cartographyService = {
  getDeliveryMarkers: async (filters?: { date?: string; zone?: string; agent?: string }) => {
    const response = await apiClient.get("/livraisons", { params: filters });
    return response.data.results || response.data;
  },

  getAgentPositions: async (zone?: string) => {
    const response = await apiClient.get("/agents", { params: { zone } });
    return response.data.results || response.data;
  },

  getServiceZones: async () => {
    const response = await apiClient.get("/zones");
    return response.data.results || response.data;
  },

  getHeatmapData: async (zone?: string, date?: string) => {
    const response = await apiClient.get("/heatmap", { params: { zone, date } });
    return response.data.results || response.data;
  },

  getOptimizedRoutes: async (agent?: string, date?: string) => {
    const response = await apiClient.get("/routes", { params: { agent, date } });
    return response.data.results || response.data;
  },

  getAvailableZones: async () => {
    const response = await apiClient.get("/zones/list");
    return response.data.results || response.data;
  },

  getAvailableAgents: async () => {
    const response = await apiClient.get("/agents/list");
    return response.data.results || response.data;
  },
};
```

---

## 📝 Résumé des Endpoints

| # | Endpoint | Méthode | Description | Priorité |
|---|---|---|---|---|
| 1 | `/api/livraisons` | GET | Marqueurs de livraison | ⭐⭐⭐ |
| 2 | `/api/agents` | GET | Positions des agents | ⭐⭐⭐ |
| 3 | `/api/zones` | GET | Zones de chalandise | ⭐⭐⭐ |
| 4 | `/api/heatmap` | GET | Données heatmap | ⭐⭐ |
| 5 | `/api/routes` | GET | Itinéraires optimisés | ⭐⭐ |
| 6 | `/api/zones/list` | GET | Zones pour filtres | ⭐⭐⭐ |
| 7 | `/api/agents/list` | GET | Agents pour filtres | ⭐⭐⭐ |
| 8 | `/api/stats/summary` | GET | Statistiques globales | ⭐ |

**⭐⭐⭐ = Priorité haute (essentiel)**  
**⭐⭐ = Priorité moyenne (important)**  
**⭐ = Priorité basse (optionnel)**

---

## ✅ Checklist d'Implémentation Backend

### Phase 1 - Endpoints de Base (Semaine 1)
- [ ] `/api/livraisons` - Endpoints 1 & 6
- [ ] `/api/agents` - Endpoints 2 & 7
- [ ] `/api/zones` - Endpoint 3

### Phase 2 - Données Enrichies (Semaine 2)
- [ ] `/api/heatmap` - Endpoint 4
- [ ] `/api/routes` - Endpoint 5

### Phase 3 - Statistiques (Semaine 3)
- [ ] `/api/stats/summary` - Endpoint 8

---

## 📞 Questions Fréquentes

**Q: Quels endpoints sont essentiels?**  
R: Les 3 premiers sont essentiels (livraisons, agents, zones)

**Q: Comment gérer les coordonnées GPS?**  
R: Latitude -90 à 90, Longitude -180 à 180, au moins 4 décimales

**Q: Quelle fréquence de mise à jour?**  
R: Agents toutes les 30 secondes, livraisons toutes les 5 minutes

**Q: Comment formater les dates?**  
R: YYYY-MM-DD pour les dates, ISO 8601 pour les timestamps

---

**Version**: 1.0  
**Date**: 23 janvier 2026  
**Prêt pour développement backend** ✅
