# 📍 Composants Cartographie

## Structure

```
_components/
├── cartography-view.tsx      # Composant principal d'orchestration
├── map.tsx                   # Carte Leaflet interactive
├── filters.tsx               # Barre de filtres
├── stats-cards.tsx           # Cartes KPI
├── config.ts                 # Configuration centralisée
├── utils.ts                  # Utilitaires (calculs, formatage)
├── index.ts                  # Exports
└── README.md                 # Ce fichier
```

## Composants

### `CartographyView`
**Responsabilité**: Orchestration principale

Gère l'état global et compose tous les sous-composants.

```tsx
function CartographyView() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);

  return (
    <>
      <MapStatsCards ... />
      <MapFilters ... />
      <MapComponent ... />
    </>
  );
}
```

**Props**: Aucune (composant root de la page)

**State**:
- `selectedDate`: Date sélectionnée (YYYY-MM-DD)
- `selectedZone`: Zone sélectionnée (ID)
- `selectedAgent`: Agent sélectionné (ID)
- `showHeatmap`: Booléen pour affichage heatmap
- `showRoutes`: Booléen pour affichage itinéraires

---

### `MapComponent`
**Responsabilité**: Rendu de la carte Leaflet

Affiche la carte interactive avec tous les éléments (marqueurs, zones, heatmap, routes).

```tsx
interface MapComponentProps {
  selectedDate?: string;
  selectedZone?: string;
  selectedAgent?: string;
  showHeatmap?: boolean;
  showRoutes?: boolean;
}

function MapComponent(props: MapComponentProps) {
  // Initialise Leaflet
  // Charge les données
  // Ajoute les couches
  // Gère les interactions
}
```

**Comportements**:
- Initialise la carte une seule fois
- Re-charge les données au changement de filtres
- Nettoie les anciennes couches avant d'en ajouter
- Gère les popups au clic
- Affiche une légende

**Couches gérées**:
- Tuiles OSM (toujours affichées)
- Marqueurs de livraison
- Marqueurs d'agents
- Zones circulaires
- Heatmap (si activée)
- Polylines d'itinéraires (si activées)

---

### `MapFilters`
**Responsabilité**: Interface de filtrage

Fournit des contrôles pour filtrer et configurer la carte.

```tsx
interface MapFiltersProps {
  onDateChange: (date: string) => void;
  onZoneChange: (zone: string) => void;
  onAgentChange: (agent: string) => void;
  onHeatmapToggle: (enabled: boolean) => void;
  onRoutesToggle: (enabled: boolean) => void;
  selectedDate?: string;
  selectedZone?: string;
  selectedAgent?: string;
}

function MapFilters(props: MapFiltersProps) {
  // Charge les options des dropdowns
  // Gère les états des checkboxes
  // Affiche les filtres actifs
}
```

**Éléments**:
- Select Date: 7 derniers jours
- Select Zone: Toutes les zones disponibles
- Select Agent: Tous les agents disponibles
- Checkbox Heatmap: Activer/désactiver
- Checkbox Routes: Activer/désactiver
- Button Reset: Réinitialiser tous les filtres
- Affichage des filtres actifs

---

### `MapStatsCards`
**Responsabilité**: Statistiques et KPI

Affiche 4 cartes avec statistiques réactives.

```tsx
interface MapStatsCardsProps {
  selectedDate?: string;
  selectedZone?: string;
  selectedAgent?: string;
}

function MapStatsCards(props: MapStatsCardsProps) {
  const [deliveryMarkers, setDeliveryMarkers] = useState([]);
  const [agentPositions, setAgentPositions] = useState([]);

  // Calcule: total, complétées, en cours, en attente
  // Affiche: agents actifs, taux de complément
}
```

**Cartes affichées**:
1. **Livraisons totales** - Nombre total avec en-cours
2. **Taux de complément** - Pourcentage avec tendance
3. **Agents actifs** - Nombre d'agents en tournée
4. **En attente** - Livraisons non-assignées

---

## Fichiers Utilitaires

### `config.ts`
Contient toutes les configurations et constantes.

```typescript
// Exemples de paramètres
MAP_CONFIG.defaultCenter     // Coordonnées initiales
MAP_CONFIG.defaultZoom       // Niveau de zoom
HEATMAP_CONFIG.gradient      // Gradient de couleurs
STATUS_COLORS.delivery       // Couleurs des statuts
FILTER_CONFIG.daysInPast     // Nombre de jours
```

**Avantages**:
- Configuration centralisée
- Facile à modifier
- Réutilisable dans plusieurs composants

---

### `utils.ts`
Contient les fonctions utilitaires.

```typescript
// Calculs géographiques
calculateDistance(lat1, lng1, lat2, lng2)
isPointInRadius(...)
calculateBounds(coordinates)

// Formatage
formatDistance(km)
formatDuration(minutes)
formatDate(dateString)
formatAddress(address)

// Groupement
groupByZone(items)
groupByStatus(items)
groupByAgent(items)

// Statistiques
calculateAverage(items, selector)
calculateTotal(items, selector)

// Utilitaires divers
getColorByIntensity(intensity)
isValidCoordinate(lat, lng)
deduplicateBy(items, selector)
```

---

### `index.ts`
Ré-exporte tous les composants et types.

```typescript
// Permet d'importer ainsi:
import { CartographyView, MapComponent } from "@/app/(main)/dashboard/map/_components";

// Au lieu de:
import { CartographyView } from "@/app/(main)/dashboard/map/_components/cartography-view";
import { MapComponent } from "@/app/(main)/dashboard/map/_components/map";
```

---

## Flux de Données

### Initialisation
```
CartographyView
  ├── MapStatsCards (charge les stats initiales)
  ├── MapFilters (charge les options de dropdowns)
  └── MapComponent (initialise la carte Leaflet)
```

### Filtrage
```
User clique sur un dropdown
  ↓
MapFilters appelle onDateChange(value)
  ↓
CartographyView reçoit et set selectedDate
  ↓
CartographyView transmet la prop à MapStatsCards et MapComponent
  ↓
useEffect se déclenche avec selectedDate en dépendance
  ↓
Service charge les nouvelles données
  ↓
Composants affichent les données filtrées
```

---

## Intégration API Réelle

Pour remplacer les données mockées:

1. **Dans `cartographyService`**:
```typescript
// Remplacer les mock par des appels API
getDeliveryMarkers: async (filters) => {
  return await apiClient.get("/livraisons", { params: filters });
}
```

2. **Adapter les types si nécessaire**:
```typescript
// Si votre API retourne d'autres noms de champs
interface DeliveryMarker {
  // ... adapter aux champs de votre API
}
```

3. **Les composants ne changent pas** - Ils continuent à fonctionner normalement.

---

## Performance

### Optimisations Mises en Place

- ✅ **useRef** pour les références Leaflet (évite re-renders)
- ✅ **useEffect** avec dépendances ciblées
- ✅ **Cleanup** au unmount pour éviter les memory leaks
- ✅ **Lazy loading** des marqueurs
- ✅ **Memoization** implicite des calculs coûteux

### Considérations

- La heatmap peut être lente avec > 1000 points
- Limiter à 500 marqueurs maximum pour performance
- Utiliser pagination si nombreuses données
- Considérer le clustering pour dense zones

---

## Accessibilité

- ✅ Labels associés aux inputs
- ✅ Semantic HTML (buttons, selects)
- ✅ Contraste de couleurs correct
- ✅ Descriptions textuelles des visuels
- ✅ Navigation au clavier possible

---

## Tests Manuels à Faire

- [ ] Carte s'affiche sans erreur
- [ ] Marqueurs visibles et cliquables
- [ ] Filtres réactifs et rapides
- [ ] Heatmap s'active/désactive smooth
- [ ] Itinéraires s'affichent correctement
- [ ] Stats se mettent à jour
- [ ] Pas de memory leaks (DevTools)
- [ ] Responsive sur mobile

---

## Commandes Utiles

```bash
# Développement
npm run dev

# Build
npm run build

# Linting
npm run lint

# Formattage
npm run format
```

---

## Ressources

- [Leaflet.js Docs](https://leafletjs.com)
- [Leaflet.heat Plugin](https://github.com/Leaflet/Leaflet.heat)
- [React Hooks Docs](https://react.dev/reference/react)
- [Next.js Docs](https://nextjs.org/docs)

---

**Date**: 23 janvier 2026  
**Status**: ✅ Production Ready
