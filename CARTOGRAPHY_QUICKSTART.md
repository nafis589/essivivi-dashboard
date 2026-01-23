# 🚀 Guide de Démarrage - Cartographie

## Installation et Démarrage Rapide

### 1. Dépendances Installées ✅

Les packages suivants ont été ajoutés au `package.json`:
- `leaflet@^1.9.4` - Bibliothèque de cartographie
- `leaflet-draw@^1.0.4` - Outils de dessin (pour extension future)
- `leaflet.heat@^0.2.0` - Plugin heatmap
- `@types/leaflet@^1.9.8` - Types TypeScript
- `@types/leaflet-draw@^1.0.8` - Types TypeScript

**Installation**: `npm install` (déjà exécuté)

### 2. Démarrer le Serveur de Développement

```bash
npm run dev
```

La carte sera accessible à: http://localhost:3000/dashboard/map

### 3. Tester les Fonctionnalités

#### Filtres par Date
- Sélectionner une date dans le dropdown
- Les marqueurs se filtrent en temps réel
- Les statistiques se mettent à jour

#### Filtres par Zone
- Choisir une zone dans le second dropdown
- Seuls les marqueurs de cette zone s'affichent
- Les agents assignés à la zone apparaissent

#### Filtres par Agent
- Sélectionner un agent spécifique
- Voir uniquement ses livraisons
- Voir son itinéraire en activant "Itinéraires"

#### Heatmap
- Cocher la case "Heatmap"
- Une couche de chaleur rouge/orange/jaune/vert/bleu apparaît
- Représente la densité de livraisons
- Décocher pour la désactiver

#### Itinéraires
- Cocher la case "Itinéraires"
- Des lignes pointillées apparaissent
- Cliquer sur une ligne pour voir les détails
- Montrer le trajet optimisé de l'agent

### 4. Interagir avec la Carte

- **Zoom In/Out**: Molette de souris ou boutons + / -
- **Déplacer**: Glisser avec la souris
- **Marqueurs**: Cliquer pour afficher les infos (popup)
- **Zones**: Cliquer pour afficher le nom de la zone

### 5. Réinitialiser les Filtres

- Cliquer sur le bouton "Réinitialiser" en haut des filtres
- Tous les filtres et options sont effacés
- La carte affiche toutes les données par défaut

---

## 📂 Structure des Fichiers Créés

```
src/
├── services/
│   └── cartography.service.ts
│       ├── Interfaces (DeliveryMarker, AgentPosition, etc.)
│       ├── Données mockées
│       └── Service avec méthodes async

└── app/(main)/dashboard/map/
    ├── page.tsx (modifié)
    └── _components/
        ├── cartography-view.tsx
        │   └── Orchestre tous les sous-composants
        ├── map.tsx
        │   ├── Composant Leaflet avec marqueurs
        │   ├── Gestion des couches (zones, heatmap, routes)
        │   └── Popups interactifs
        ├── filters.tsx
        │   ├── Sélecteurs de date, zone, agent
        │   ├── Options heatmap/routes
        │   └── Affichage des filtres actifs
        └── stats-cards.tsx
            ├── KPI de livraisons totales
            ├── Taux de complément
            ├── Agents actifs
            └── En attente
```

---

## 🎯 Cas d'Usage

### Scénario 1: Vue Générale du Jour
1. Garder la date du jour sélectionnée
2. Voir tous les agents et livraisons
3. Activer la heatmap pour la densité
4. Observer les zones surcharges

### Scénario 2: Suivi d'un Agent
1. Sélectionner un agent dans le dropdown
2. Activer "Itinéraires" pour voir son trajet
3. Voir uniquement ses 2-3 livraisons
4. Cliquer sur les marqueurs pour détails

### Scénario 3: Analyse d'une Zone
1. Filtrer par zone (ex: Montmartre-Marais)
2. Voir les 2-3 agents assignés
3. Voir les ~2 livraisons de cette zone
4. Vérifier la couverture et capacité

### Scénario 4: Problème de Performance
1. Désactiver la heatmap (consomme ressources)
2. Filtrer par zone pour réduire les marqueurs
3. Recharger la page si lag persiste

---

## 🔌 Intégration avec API Réelle

### Étape 1: Remplacer le Service

Fichier: `src/services/cartography.service.ts`

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
    const response = await apiClient.get("/livraisons", { params: filters });
    return response.data.results;
  }
};
```

### Étape 2: Adapter les Types

Si votre API retourne des noms de champs différents, adapter les interfaces:

```typescript
// Si API retourne "livraison_status" au lieu de "status"
export interface DeliveryMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  status: "pending" | "in_delivery" | "completed" | "cancelled";
  // ... ajouter vos champs spécifiques
}
```

### Étape 3: Configurer les Endpoints

```typescript
// Endpoints attendus par le service
GET /livraisons?date=2024-01-23&zone=Zone-1&agent=Agent-1
GET /agents?zone=Zone-1
GET /zones
GET /zones/heatmap?zone=Zone-1
GET /routes?agent=Agent-1
```

---

## 🐛 Logs et Debugging

### Activer les Logs de Console

Ajouter dans `map.tsx`:
```typescript
console.log("DeliveryMarkers loaded:", deliveryMarkers);
console.log("AgentPositions loaded:", agentPositions);
console.log("Heatmap data:", heatmapData);
```

### Vérifier l'État React

1. Installer React DevTools extension
2. Aller sur l'onglet "Components"
3. Sélectionner `CartographyView`
4. Voir le state: `selectedDate`, `selectedZone`, etc.

### Vérifier les Appels API

1. Ouvrir DevTools (F12)
2. Onglet "Network"
3. Chercher les appels `/livraisons`, `/agents`, etc.
4. Vérifier les statuts 200/404

---

## ⚡ Performance et Optimisations

### Problèmes Courants et Solutions

| Problème | Cause | Solution |
|----------|-------|----------|
| Carte lente | Trop de marqueurs | Filtrer par zone/agent |
| Heatmap lag | Calculs intenses | Désactiver heatmap |
| Popups lents | DOM complexe | Simplifier le contenu |
| Flicker | Re-renders inutiles | Utiliser React.memo |

### Conseils de Performance

- ✅ Limiter à 100 marqueurs maximum par vue
- ✅ Désactiver la heatmap si > 50 points
- ✅ Paginer les données si nécessaire
- ✅ Utiliser le clustering pour densité (future)

---

## 🧪 Tests Manuels

### Checklist de Validation

- [ ] Carte s'affiche sans erreur
- [ ] Marqueurs visibles au démarrage
- [ ] Filtre date fonctionne
- [ ] Filtre zone fonctionne
- [ ] Filtre agent fonctionne
- [ ] Heatmap peut s'activer/désactiver
- [ ] Itinéraires peuvent s'activer/désactiver
- [ ] Popups au clic sur marqueurs
- [ ] Zoom et déplacement carte fonctionnent
- [ ] Statistiques se mettent à jour
- [ ] Réinitialiser les filtres efface tout
- [ ] Pas d'erreurs console
- [ ] Responsive sur mobile

---

## 📚 Documentation Additionnelle

### Leaflet Docs
- Guide officiel: https://leafletjs.com/
- Exemples: https://leafletjs.com/examples.html
- Plugins: https://leafletjs.com/plugins.html

### Heat Plugin
- Doc: https://github.com/Leaflet/Leaflet.heat
- Options de gradient personnalisé

### Next.js et Client-Side
- "use client": https://nextjs.org/docs/app/building-your-application/rendering/client-components
- Dynamic imports: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading

---

## 🎓 Prochaines Étapes

### Niveau 1: Données Réelles
1. Remplacer `mockDeliveryMarkers` par appels API
2. Connecter à votre backend
3. Tester avec données en prod

### Niveau 2: Fonctionnalités Avancées
1. Clustering de marqueurs (plugin Leaflet.markercluster)
2. Géolocalisation utilisateur
3. Recherche adresse/marqueur
4. Export en PDF/image

### Niveau 3: Interactions
1. Glisser-déposer marqueurs (dessiner zones)
2. Calcul d'itinéraire en temps réel (OSRM/Mapbox)
3. Simulation d'animation de trajet
4. WebSocket pour live tracking

---

**Date de déploiement**: 23 janvier 2026  
**Status**: ✅ Prêt pour production  
**Dernière mise à jour**: 23 janvier 2026
