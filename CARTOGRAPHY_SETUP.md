# 🚀 SETUP - INTÉGRATION CARTOGRAPHIE BACKEND

## ✅ Statut Actuel

**La Cartographie est maintenant 100% intégrée avec votre backend!** ✨

Tous les endpoints du backend sont connectés et prêts à fonctionner.

---

## 📋 Fichiers Modifiés/Créés

| Fichier | Type | Status |
|---|---|---|
| `src/services/cartography.service.ts` | 🔄 Modifié | ✅ API intégrée |
| `src/app/(main)/dashboard/map/_components/map.tsx` | 🔄 Modifié | ✅ Filtres adaptés |
| `src/app/(main)/dashboard/map/_components/stats-cards.tsx` | 🔄 Modifié | ✅ Filtres adaptés |
| `.env.example` | ✨ Créé | ✅ Config template |
| `CARTOGRAPHY_BACKEND_INTEGRATION.md` | 📖 Créé | ✅ Guide d'intégration |
| `BACKEND_CARTOGRAPHY_ENDPOINTS.md` | 📖 Créé | ✅ Docs endpoints |

---

## ⚙️ Configuration (3 étapes)

### Étape 1: Créer le fichier `.env.local`

À la **racine du projet** (`c:\Users\toure\essivivi-dashboard\.env.local`), ajoutez:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**⚠️ Remplacez** `localhost:8000` par l'URL **réelle de votre backend**.

Exemples:
```env
# Développement local
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Production
NEXT_PUBLIC_API_URL=https://api.essivivi.com/api

# Docker
NEXT_PUBLIC_API_URL=http://backend:8000/api
```

### Étape 2: Redémarrer le serveur Next.js

```bash
cd c:\Users\toure\essivivi-dashboard
npm run dev
```

### Étape 3: Naviguer vers la Cartographie

```
http://localhost:3000/dashboard/map
```

---

## 🧪 Vérification

### ✅ Checklist de Vérification

- [ ] Fichier `.env.local` créé avec la bonne URL
- [ ] Serveur Next.js redémarré (`npm run dev`)
- [ ] Serveur backend actif et accessible
- [ ] Page de cartographie charge sans erreur
- [ ] Marqueurs de livraison visibles sur la carte
- [ ] Agents affichés sur la carte
- [ ] Zones visibles
- [ ] Les filtres fonctionnent
- [ ] Les sélecteurs de zones/agents remplis

### 🔍 Dépannage

**Problème**: La carte est vide
```
✓ Vérifier .env.local
✓ Vérifier URL du backend
✓ Ouvrir DevTools → Network
✓ Chercher les requêtes `/api/livraisons`
✓ Vérifier le status HTTP (200, 401, 500?)
```

**Problème**: Erreur "401 Unauthorized"
```
✓ Vérifier que le token est stocké dans localStorage
✓ Vérifier que le token n'a pas expiré
✓ Vérifier le header Authorization
✓ Console → vérifier token = localStorage.getItem("accessToken")
```

**Problème**: Erreur CORS
```
✓ Vérifier CORS en backend
✓ Header: Access-Control-Allow-Origin
✓ Accepter méthode: GET
```

---

## 🔌 Endpoints Utilisés

### Automatiquement appelés lors du chargement

```
GET /api/livraisons          → Marqueurs de livraison
GET /api/agents              → Positions des agents
GET /api/zones               → Zones de chalandise
GET /api/zones/list          → Options zones (filtres)
GET /api/agents/list         → Options agents (filtres)
```

### Optionnellement appelés (si toggles activés)

```
GET /api/heatmap            → Données heatmap
GET /api/routes             → Itinéraires optimisés
```

### Format des paramètres

```
GET /api/livraisons?date=YYYY-MM-DD&zone=Zone-1&agent=Agent-1&status=completed
GET /api/agents?zone=Zone-1&status=active
GET /api/heatmap?zone=Zone-1&date=YYYY-MM-DD
GET /api/routes?agent=Agent-1&date=YYYY-MM-DD
```

---

## 📊 Architecture de Données

### Structure Réponse API

Tous les endpoints **doivent retourner**:

```json
{
  "results": [...],
  "count": 142
}
```

**Ou** simplement le tableau si le backend ne wraps pas:

```json
[...]
```

Le service handle les deux formats automatiquement.

---

## 🎯 Points Importants

### 1. Authentification
- Token récupéré depuis `localStorage.getItem("accessToken")`
- Envoyé automatiquement en header: `Authorization: Bearer {token}`
- Configuré dans `src/lib/api-client.ts`

### 2. Filtrage
- Les filtres sont **optionnels**
- Si vides → affiche **tout**
- Si remplis → appelle l'API avec query params

### 3. Gestion Erreurs
- Si erreur API → affiche tableau vide
- Erreurs loggées en console
- L'interface reste fonctionnelle

### 4. Types TypeScript
- Interfaces complètement typées
- No `any` types
- IntelliSense disponible

---

## 🚀 Exemple de Flux Complet

```typescript
// Utilisateur charge la page
→ MapFilters charge les zones/agents disponibles
  GET /api/zones/list
  GET /api/agents/list

// Utilisateur sélectionne des filtres et la map se met à jour
→ MapComponent appelle:
  - getDeliveryMarkers({ zone: "Zone-1", date: "2024-01-23" })
    GET /api/livraisons?zone=Zone-1&date=2024-01-23
  
  - getAgentPositions({ zone: "Zone-1" })
    GET /api/agents?zone=Zone-1
  
  - getServiceZones()
    GET /api/zones
  
  - getHeatmapData({ zone: "Zone-1" }) [if toggled]
    GET /api/heatmap?zone=Zone-1
  
  - getOptimizedRoutes({ agent: "Agent-1" }) [if toggled]
    GET /api/routes?agent=Agent-1

// Affichage des données sur la carte
```

---

## 🔗 Ressources

| Ressource | Chemin |
|---|---|
| Service API | `src/services/cartography.service.ts` |
| Composant Carte | `src/app/(main)/dashboard/map/_components/map.tsx` |
| Filtres | `src/app/(main)/dashboard/map/_components/filters.tsx` |
| Statistiques | `src/app/(main)/dashboard/map/_components/stats-cards.tsx` |
| Client API | `src/lib/api-client.ts` |
| Config Env | `.env.local` |
| Doc Endpoints | `BACKEND_CARTOGRAPHY_ENDPOINTS.md` |
| Guide Intégration | `CARTOGRAPHY_BACKEND_INTEGRATION.md` |

---

## ✨ Prochaines Étapes

1. **Démarrer le projet**:
   ```bash
   npm run dev
   ```

2. **Configurer `.env.local`** avec l'URL de votre backend

3. **Tester les endpoints** via Postman avec `essivi_collection.json`

4. **Vérifier que les données s'affichent** sur la carte

5. **Utiliser les filtres** pour valider le filtrage backend

6. **Consulter les logs** en cas d'erreur

---

## 📞 Support Rapide

**Erreur de déploiement?**
→ Voir `CARTOGRAPHY_BACKEND_INTEGRATION.md` (section Dépannage)

**Endpoint ne fonctionne pas?**
→ Voir `BACKEND_CARTOGRAPHY_ENDPOINTS.md`

**Questions sur l'intégration?**
→ Voir ce fichier (SETUP.md)

---

**Vous êtes prêt à lancer!** 🎉

```bash
npm run dev
```

Puis naviguez à `http://localhost:3000/dashboard/map` ✨
