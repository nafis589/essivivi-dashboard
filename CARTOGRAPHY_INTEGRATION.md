# 📍 Intégration Cartographie Leaflet.js

## Vue d'ensemble

Cette documentation décrit l'intégration complète de Leaflet.js dans l'onglet **Cartographie** du dashboard administrateur. La solution est entièrement fonctionnelle, utilise des données mockées et respecte scrupuleusement le design system du template.

---

## 🏗️ Architecture et Structure

### Fichiers Créés

```
src/
├── services/
│   └── cartography.service.ts          # Service de données mockées
└── app/(main)/dashboard/map/
    └── _components/
        ├── map.tsx                      # Composant carte Leaflet
        ├── filters.tsx                  # Composant filtres réactifs
        ├── stats-cards.tsx              # Cartes de statistiques
        └── cartography-view.tsx         # Composant d'orchestration
```

### Fichiers Modifiés

- **package.json**: Ajout des dépendances Leaflet
- **page.tsx** (map): Remplacé pour utiliser `CartographyView`

---

## 🎨 Fonctionnalités Implémentées

### 1. **Affichage de la Carte Interactive**
- ✅ Carte OpenStreetMap entièrement intégré
- ✅ Centrage automatique sur Paris (48.8566, 2.3522)
- ✅ Zoom initial à niveau 13
- ✅ Interactions tactiles et souris (zoom, pan, etc.)

### 2. **Marqueurs de Livraison**
- ✅ Icônes personnalisées avec code couleur de statut
- ✅ 4 statuts visuels: complétée (vert), en cours (orange), en attente (gris), annulée (rouge)
- ✅ PopUps informatifs au clic
- ✅ Filtrage dynamique par date, zone et agent

### 3. **Positions des Agents en Tournée**
- ✅ Marqueurs distincts (camion 🚚) avec couleur de statut
- ✅ 3 statuts: actif (bleu), inactif (jaune), hors ligne (gris)
- ✅ Informations détaillées: nom, véhicule, zone, livraisons du jour
- ✅ Mise à jour en temps réel (simulation)

### 4. **Zones de Chalandise**
- ✅ 4 zones avec cercles colorés
- ✅ Rayon de 1400-1800m selon la zone
- ✅ Transparence d'affichage (10% opacité)
- ✅ PopUps au survol

### 5. **Carte de Chaleur (Heatmap)**
- ✅ Activable via checkbox dans les filtres
- ✅ Gradient: bleu → vert → jaune → orange → rouge
- ✅ Intensité basée sur la densité de livraisons
- ✅ Rayon et flou configurables

### 6. **Itinéraires Optimisés**
- ✅ Activable via checkbox dans les filtres
- ✅ Affichage des polylignes pointillées
- ✅ PopUps avec distance et durée
- ✅ Filtrables par agent

### 7. **Filtres Interactifs**
- ✅ **Date**: Sélection sur les 7 derniers jours
- ✅ **Zone**: Filtrage par zone de chalandise
- ✅ **Agent**: Filtrage par agent en tournée
- ✅ **Heatmap**: Toggle pour affichage de chaleur
- ✅ **Itinéraires**: Toggle pour affichage des polylignes
- ✅ **Réinitialisation**: Bouton pour effacer tous les filtres

### 8. **Cartes de Statistiques**
- ✅ **Livraisons totales**: Compte avec badge des en-cours
- ✅ **Taux de complément**: Pourcentage avec indicateur de tendance
- ✅ **Agents actifs**: Nombre d'agents en tournée
- ✅ **Livraisons en attente**: Alerte si trop de non-assignées
- ✅ Réactives aux filtres

---

## 📦 Dépendances Ajoutées

```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "leaflet-draw": "^1.0.4",
    "leaflet.heat": "^0.2.0"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.8",
    "@types/leaflet-draw": "^1.0.8"
  }
}
```

---

## 🔧 Intégration Next.js

### Rendu Côté Client
Tous les composants utilisent la directive `"use client"` pour assurer:
- ✅ Chargement de Leaflet uniquement côté client
- ✅ Absence de problèmes SSR
- ✅ Hydratation sans erreur

### Structure Modulaire
```tsx
// cartography-view.tsx (orchestration)
- MapStatsCards (stats et KPIs)
- MapFilters (filtres réactifs)
- MapComponent (carte interactive)
```

---

## 📊 Service de Données Mockées

### `cartographyService`

#### Méthodes Disponibles

```typescript
// Récupérer les marqueurs de livraison
const markers = await cartographyService.getDeliveryMarkers({
  date?: string,      // Format: YYYY-MM-DD
  zone?: string,      // ID de zone
  agent?: string      // ID d'agent
});

// Récupérer les positions des agents
const agents = await cartographyService.getAgentPositions(zone?: string);

// Récupérer les zones de chalandise
const zones = await cartographyService.getServiceZones();

// Récupérer les données heatmap
const points = await cartographyService.getHeatmapData(zone?: string);

// Récupérer les itinéraires optimisés
const routes = await cartographyService.getOptimizedRoutes(agent?: string);

// Récupérer les zones pour les filtres
const zonesForFilter = await cartographyService.getAvailableZones();

// Récupérer les agents pour les filtres
const agentsForFilter = await cartographyService.getAvailableAgents();
```

### Données Mockées

**8 Marqueurs de livraison** avec positions réelles à Paris
- Statuts variés (complétée, en cours, en attente)
- Zones d'assignement
- Adresses détaillées

**5 Agents en tournée**
- Positions géolocalisées
- Statuts (actif, inactif, hors ligne)
- Véhicules assignés
- Livraisons du jour

**4 Zones de chalandise**
- Centre-Rive Gauche
- Montmartre-Marais
- République-Bastille
- Opéra-Tuileries

**12 Points de chaleur**
- Représentant la densité de livraisons
- Intensité de 0.55 à 0.9

**3 Itinéraires optimisés**
- 1 par agent principal
- Waypoints et distance/durée

---

## 🎨 Respect du Design System

### Composants Réutilisés

- ✅ `Card` / `CardHeader` / `CardContent`: Conteneurs
- ✅ `Select` / `SelectTrigger` / `SelectContent`: Dropdowns filtres
- ✅ `Button`: Actions (réinitialiser)
- ✅ `Badge`: Tags de statut et filtres
- ✅ `Checkbox`: Options d'affichage
- ✅ `Label`: Libellés de formulaires
- ✅ `Spinner`: Indicateurs de chargement

### Style et Espacements

- ✅ Grille responsive `@container/main`
- ✅ Breakpoints `@md/main`, `@xl/main`, `@5xl/main`
- ✅ Espacements cohérents: `gap-4 md:gap-6`
- ✅ Classes Tailwind du template

### Palette de Couleurs

- ✅ Utilisation des variables CSS du thème
- ✅ Cohérence avec le design existant
- ✅ Support du mode sombre via `dark:` classes

---

## 🚀 Utilisation

### Accéder à la Page

Naviguer vers `/dashboard/map` dans le sidebar "Cartographie"

### Filtrer les Données

1. Sélectionner une date (7 derniers jours)
2. (Optionnel) Choisir une zone
3. (Optionnel) Choisir un agent
4. Cocher "Heatmap" pour voir la densité
5. Cocher "Itinéraires" pour voir les polylignes

### Interagir avec la Carte

- **Zoom**: Molette souris ou gestes tactiles
- **Déplacement**: Glisser-déposer
- **Marqueurs**: Cliquer pour afficher les détails
- **Réinitialiser**: Bouton en haut à droite des filtres

---

## 📈 Extension Future

### Pour Intégrer des Données Réelles

1. **Remplacer le service**:
```typescript
// Au lieu de mockDeliveryMarkers, faire:
const response = await apiClient.get("/deliveries");
return response.data;
```

2. **Ajouter l'API réelle**:
```typescript
export const cartographyService = {
  getDeliveryMarkers: async (filters) => {
    return await apiClient.get("/deliveries", { params: filters });
  },
  // ... autres méthodes
};
```

3. **WebSocket pour temps réel**:
```typescript
// Connecter un WebSocket pour les mises à jour d'agents
socket.on("agent:location:updated", (agent) => {
  // Mettre à jour le marqueur
});
```

4. **Routing réel**:
- Utiliser OSRM ou Mapbox Routing API
- Remplacer les waypoints mockés par des calculs réels

---

## 🔍 Troubleshooting

### La carte ne s'affiche pas
- Vérifier que Leaflet CSS est importé: `import "leaflet/dist/leaflet.css"`
- Vérifier que le conteneur a une hauteur définie
- Vérifier la console navigateur pour les erreurs

### Marqueurs mal positionnés
- Vérifier les coordonnées lat/lng (latitude, longitude)
- S'assurer que lat ∈ [-90, 90] et lng ∈ [-180, 180]

### Heatmap ne s'affiche pas
- Vérifier que `leaflet.heat` est importé
- S'assurer que showHeatmap est true
- Vérifier que heatmapData n'est pas vide

### Filtres ne réactifs
- Vérifier que le state est passé en props
- Vérifier que les callbacks sont correctement bindés
- Regarder React DevTools pour le state

---

## 📝 Notes de Développement

### Performance

- ✅ Lazy loading des images (icônes)
- ✅ Memoization des calculs coûteux
- ✅ Nettoyage des références au unmount
- ✅ Gestion optimale du DOM Leaflet

### Accessibilité

- ✅ Labels associés aux inputs
- ✅ Semantique HTML correcte
- ✅ Contraste des couleurs
- ✅ Aria-labels sur les icônes

### Sécurité

- ✅ Données mockées (pas d'API réelle)
- ✅ Pas d'injection XSS dans les popups
- ✅ Validation des filtres côté client

---

## 📞 Support

Pour toute question ou amélioration:
- Vérifier la documentation Leaflet: https://leafletjs.com
- Consulter les exemples du projet
- Vérifier les logs navigateur

---

**Intégration réalisée le 23 janvier 2026**
**Prêt pour la production avec données réelles**
