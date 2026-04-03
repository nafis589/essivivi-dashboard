# 📋 Module Clients — Documentation API Complète

> **Base URL** : `/api/customers`
> **Authentification** : Toutes les routes nécessitent un header d'authentification (session Better Auth).
> **Multi-tenant** : Toutes les requêtes sont automatiquement filtrées par `userId` (l'utilisateur connecté).

---

## 📌 Modèle de données

```typescript
interface Customer {
  id: number              // Auto-increment
  userId: string          // ID de l'utilisateur propriétaire
  name: string            // Nom du client (requis)
  phone: string | null    // Téléphone
  email: string | null    // Email
  address: string | null  // Adresse
  notes: string | null    // Notes libres
  totalPurchases: number  // Nombre total d'achats (auto-calculé)
  totalSpent: number      // Total dépensé en FCFA (auto-calculé)
  lastPurchaseAt: string | null  // Date du dernier achat (auto-calculé)
  createdAt: string       // Date de création
  updatedAt: string       // Date de mise à jour
}
```

> [!IMPORTANT]
> Les champs `totalPurchases`, `totalSpent` et `lastPurchaseAt` sont **mis à jour automatiquement** lors de la création/suppression d'une vente. Ne pas les envoyer dans les requêtes de création/modification.

---

## Phase 1 — CRUD de base

### 1.1 Lister les clients

```
GET /api/customers
```

**Query Parameters :**

| Param | Type | Défaut | Description |
|-------|------|--------|-------------|
| `page` | string (number) | `"1"` | Numéro de page |
| `limit` | string (number) | `"20"` | Résultats par page (max 100) |
| `search` | string | — | Recherche dans `name`, `phone`, `email` |
| `sortBy` | enum | `"createdAt"` | Tri : `name`, `email`, `totalPurchases`, `totalSpent`, `lastPurchaseAt`, `createdAt` |
| `sortOrder` | enum | `"desc"` | Ordre : `asc`, `desc` |

**Réponse :**

```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": 1,
        "name": "Jean Dupont",
        "phone": "0612345678",
        "email": "jean@mail.com",
        "address": "Bamako, Mali",
        "notes": null,
        "totalPurchases": 15,
        "totalSpent": 125000,
        "lastPurchaseAt": "2026-03-20T10:00:00.000Z",
        "createdAt": "2026-01-15T08:00:00.000Z",
        "updatedAt": "2026-03-20T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

### 1.2 Créer un client

```
POST /api/customers
```

**Body (JSON) :**

```json
{
  "name": "Jean Dupont",
  "phone": "0612345678",
  "email": "jean@mail.com",
  "address": "Bamako, Mali",
  "notes": "Client fidèle"
}
```

| Champ | Type | Requis | Validation |
|-------|------|--------|------------|
| `name` | string | ✅ | 2-255 caractères |
| `phone` | string | ❌ | Max 30 caractères |
| `email` | string | ❌ | Format email valide, max 255 |
| `address` | string | ❌ | Max 500 caractères |
| `notes` | string | ❌ | Max 2000 caractères |

**Réponse (201) :**

```json
{
  "success": true,
  "data": { "id": 1, "name": "Jean Dupont", "..." : "..." },
  "message": "Client créé avec succès"
}
```

---

### 1.3 Récupérer un client

```
GET /api/customers/:id
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Jean Dupont",
    "phone": "0612345678",
    "email": "jean@mail.com",
    "address": "Bamako, Mali",
    "notes": null,
    "totalPurchases": 15,
    "totalSpent": 125000,
    "lastPurchaseAt": "2026-03-20T10:00:00.000Z",
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-03-20T10:00:00.000Z",
    "sales": [ "..." ]
  }
}
```

**Erreurs :**
- `404` — Client non trouvé

---

### 1.4 Modifier un client

```
PUT /api/customers/:id
```

**Body (JSON) — tous les champs sont optionnels :**

```json
{
  "name": "Jean Dupont (modifié)",
  "phone": "0698765432"
}
```

**Réponse :**

```json
{
  "success": true,
  "data": { "..." : "..." },
  "message": "Client mis à jour avec succès"
}
```

---

### 1.5 Supprimer un client

```
DELETE /api/customers/:id
```

> [!WARNING]
> Suppression définitive (hard delete). Les ventes liées au client conservent leur `customerId` mais le client n'existera plus.

**Réponse :**

```json
{
  "success": true,
  "message": "Client supprimé avec succès"
}
```

---

## Phase 2 — Historique des ventes d'un client

### 2.1 Récupérer les ventes

```
GET /api/customers/:id/sales
```

**Réponse :**

```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "total": 15000,
      "createdAt": "2026-03-20T10:00:00.000Z",
      "itemsCount": 3
    },
    {
      "id": 8,
      "total": 8500,
      "createdAt": "2026-03-15T14:30:00.000Z",
      "itemsCount": 2
    }
  ]
}
```

| Champ | Description |
|-------|-------------|
| [id](file:///c:/Users/toure/flowbackend/source/middlewares/validation.middleware.ts#10-59) | ID de la vente |
| `total` | Montant total en FCFA |
| `createdAt` | Date de la vente |
| `itemsCount` | Nombre total d'articles (somme des quantités) |

> Ventes triées par `createdAt` DESC (plus récentes en premier).

---

## Phase 3 — Statistiques client

### 3.1 Récupérer les stats

```
GET /api/customers/:id/stats
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "totalSpent": 125000,
    "totalPurchases": 15,
    "averageOrder": 8333.33,
    "lastPurchaseAt": "2026-03-20T10:00:00.000Z"
  }
}
```

| Champ | Description |
|-------|-------------|
| `totalSpent` | Total dépensé en FCFA |
| `totalPurchases` | Nombre total d'achats |
| `averageOrder` | Panier moyen (arrondi à 2 décimales). `0` si aucun achat |
| `lastPurchaseAt` | Date du dernier achat. `null` si aucun achat |

---

## Phase 4 — Mise à jour automatique des stats

> [!NOTE]
> Cette phase est **transparente pour le frontend**. Les statistiques client sont automatiquement mises à jour lors de la création ou suppression d'une vente via `POST /api/sales` et `DELETE /api/sales/:id`.

**Ce qui se passe automatiquement :**

| Événement | Action |
|-----------|--------|
| Création d'une vente avec `customerId` | `totalPurchases += 1`, `totalSpent += sale.total`, `lastPurchaseAt = now()` |
| Suppression d'une vente avec `customerId` | `totalPurchases -= 1`, `totalSpent -= sale.total` |

> Tout est exécuté dans une **transaction atomique** avec la vente elle-même.

---

## Phase 5 — Fiche client complète

### 5.1 Récupérer la fiche complète

```
GET /api/customers/:id/full
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": 1,
      "name": "Jean Dupont",
      "phone": "0612345678",
      "email": "jean@mail.com",
      "address": "Bamako, Mali",
      "notes": null,
      "createdAt": "2026-01-15T08:00:00.000Z",
      "updatedAt": "2026-03-20T10:00:00.000Z"
    },
    "stats": {
      "totalSpent": 125000,
      "totalPurchases": 15,
      "averageOrder": 8333.33,
      "lastPurchaseAt": "2026-03-20T10:00:00.000Z"
    },
    "recentSales": [
      {
        "id": 10,
        "total": 15000,
        "createdAt": "2026-03-20T10:00:00.000Z",
        "itemsCount": 3
      }
    ],
    "status": "active"
  }
}
```

| Champ | Description |
|-------|-------------|
| `customer` | Données du client (sans les champs calculés) |
| `stats` | Statistiques (totalSpent, totalPurchases, averageOrder, lastPurchaseAt) |
| `recentSales` | Les **5 dernières ventes** avec `itemsCount` |
| `status` | Statut du client : `"new"`, `"active"` ou `"inactive"` |

**Règles de statut :**

| Statut | Condition |
|--------|-----------|
| `"new"` | `totalPurchases === 0` |
| `"active"` | Dernière commande ≤ 60 jours |
| `"inactive"` | Dernière commande > 60 jours |

> [!TIP]
> Utilisez cet endpoint pour la page de **détail client** côté frontend. Il évite de faire 3 appels séparés ([/:id](file:///c:/Users/toure/flowbackend/source/middlewares/validation.middleware.ts#10-59), `/:id/stats`, `/:id/sales`).

---

## Phase 6 — Segmentation des clients

### 6.1 Top clients

```
GET /api/customers/top
```

Retourne les **10 meilleurs clients** classés par montant total dépensé (DESC).

> Seuls les clients ayant effectué au moins 1 achat sont inclus.

**Réponse :**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Jean Dupont",
      "totalSpent": 125000,
      "totalPurchases": 15,
      "lastPurchaseAt": "2026-03-20T10:00:00.000Z",
      "..."  : "..."
    }
  ],
  "count": 10
}
```

---

### 6.2 Clients inactifs

```
GET /api/customers/inactive
```

Retourne les clients **sans achat depuis plus de 60 jours**.

> Seuls les clients ayant effectué au moins 1 achat sont inclus (exclut les "nouveaux").

**Réponse :**

```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "Marie Konaté",
      "totalSpent": 35000,
      "totalPurchases": 3,
      "lastPurchaseAt": "2025-12-10T08:00:00.000Z",
      "..." : "..."
    }
  ],
  "count": 4
}
```

---

### 6.3 Nouveaux clients

```
GET /api/customers/new
```

Retourne les clients **sans aucun achat** (`totalPurchases = 0`), triés par date de création DESC.

**Réponse :**

```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "name": "Ali Traoré",
      "totalSpent": 0,
      "totalPurchases": 0,
      "lastPurchaseAt": null,
      "createdAt": "2026-03-25T10:00:00.000Z",
      "..." : "..."
    }
  ],
  "count": 7
}
```

---

## 📊 Récapitulatif des endpoints

| Méthode | Route | Phase | Description |
|---------|-------|-------|-------------|
| `GET` | `/api/customers` | 1 | Liste paginée + recherche + tri |
| `POST` | `/api/customers` | 1 | Créer un client |
| `GET` | `/api/customers/top` | 6 | Top 10 clients par dépenses |
| `GET` | `/api/customers/inactive` | 6 | Clients inactifs (+60 jours) |
| `GET` | `/api/customers/new` | 6 | Nouveaux clients (0 achats) |
| `GET` | `/api/customers/:id` | 1 | Détail d'un client |
| `PUT` | `/api/customers/:id` | 1 | Modifier un client |
| `DELETE` | `/api/customers/:id` | 1 | Supprimer un client |
| `GET` | `/api/customers/:id/sales` | 2 | Historique des ventes |
| `GET` | `/api/customers/:id/stats` | 3 | Statistiques client |
| `GET` | `/api/customers/:id/full` | 5 | Fiche complète |

---

## 🔒 Sécurité

- **Authentification** : Toutes les routes nécessitent une session valide
- **Multi-tenant** : Chaque requête Prisma filtre par `userId = req.user.id`
- **Isolation** : Impossible d'accéder aux clients d'un autre utilisateur
- **Validation** : Tous les inputs sont validés par Zod (body, params, query)

---

## ⚠️ Codes d'erreur

| Code | Description |
|------|-------------|
| `400` | Erreur de validation (champs invalides) |
| `401` | Non authentifié |
| `404` | Client non trouvé (ou n'appartient pas à l'utilisateur) |
| `500` | Erreur serveur |

**Format d'erreur de validation :**

```json
{
  "success": false,
  "message": "Erreur de validation",
  "errors": [
    { "field": "body.name", "message": "Le nom doit contenir au moins 2 caractères" }
  ]
}
```

**Format d'erreur générique :**

```json
{
  "success": false,
  "message": "Client non trouvé"
}
```
