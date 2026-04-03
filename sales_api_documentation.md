# Documentation de l'API - Module Ventes (Sales)

Cette documentation décrit les endpoints disponibles pour le module "Ventes", afin de faciliter son intégration côté Front-End.
Toutes les routes nécessitent une authentification valide (ex: un Bearer token ou un cookie de session, injecté via notre middleware d'authentification existant).

Toutes ces routes sont généralement préfixées par `/api/sales` (à confirmer selon votre point de montage racine dans le routeur principal).

---

## 1. Récupérer la liste des ventes (paginée, avec filtres et recherche)

**Endpoint :** `GET /api/sales`

Permet de récupérer la liste des ventes avec un support de la pagination, de la recherche textuelle, et des filtrages par date ou par statut.

### Paramètres de requête (Query Parameters)
| Paramètre | Type   | Défaut | Description |
| --------- | ------ | ------ | ----------- |
| `page`    | string | `'1'`  | Numéro de la page (ex: `1`, `2`) |
| `limit`   | string | `'10'` | Nombre d'éléments par page (max: `100`) |
| `search`  | string | -      | Parcourt le numéro de facture (`invoiceNumber`) et le nom du client. |
| `status`  | string | `'all'`| Statut de la vente : `'all'`, `'COMPLETED'`, `'PENDING'`, `'CANCELLED'` |
| `startDate`| string| -      | Filtrer à partir de cette date (ex: `YYYY-MM-DD`) |
| `endDate` | string | -      | Filtrer jusqu'à cette date (ex: `YYYY-MM-DD`) |
| `sortBy`  | string | `'createdAt'` | Champ de tri : `'createdAt'`, `'total'`, `'invoiceNumber'` |
| `sortOrder`| string| `'desc'` | Ordre du tri : `'asc'` ou `'desc'` |

### Structure de la Réponse (200 OK)
```json
{
  "data": [
    {
      "id": 1,
      "invoiceNumber": "INV-2026-0001",
      "userId": "user-uuid",
      "customerId": 10,
      "subtotal": 15000,
      "tax": 0,
      "total": 15000,
      "status": "COMPLETED",
      "createdAt": "2026-03-26T10:00:00.000Z",
      "updatedAt": "2026-03-26T10:00:00.000Z",
      "customer": {
        "id": 10,
        "name": "Jean Dupont"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45
  }
}
```

---

## 2. Créer une nouvelle vente

**Endpoint :** `POST /api/sales`

Créée une nouvelle vente de façon transactionnelle : 
- Décrémente les stocks des produits vendus.
- Enregistre la transaction de paiement.
- Met à jour les statistiques globales du client concerné (si spécifié).
- Enregistre les mouvements d'inventaire en tant que sorties (`OUT`).

### Payload de la requête (Body)
```json
{
  "customerId": 10,  // (Optionnel) ID du client; peut être null (ou omis) si c'est un client de passage
  "items": [         // Requis. Liste des produits achetés (minimum 1)
    {
      "productId": 5, // Requis. ID valide et positif
      "quantity": 2   // Requis. Quantité valide et positive
    }
  ],
  "paymentMethod": "CASH" // Requis. Valeurs possibles: "CASH", "CARD", "MOBILE_MONEY"
}
```

### Structure de la Réponse (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 12,
    "invoiceNumber": "INV-2026-0012",
    "subtotal": 15000,
    "tax": 0,
    "total": 15000,
    "status": "COMPLETED",
    "createdAt": "2026-03-26T14:30:00.000Z",
    "customer": {
      "id": 10,
      "name": "Jean Dupont",
      "phone": "+33600000000",
      "email": "jean.dupont@example.com"
    },
    "items": [
      {
        "id": 20,
        "productId": 5,
        "name": "Nom du produit",
        "quantity": 2,
        "price": 7500,
        "costPrice": 5000,
        "total": 15000
      }
    ],
    "payments": [
      {
        "id": 8,
        "method": "CASH",
        "amount": 15000
      }
    ]
  },
  "message": "Vente créée avec succès"
}
```

### Cas d'erreurs :
- **404 Not Found** : Le `productId` ou le `customerId` est introuvable ou vous n'y avez pas accès.
- **400 Bad Request** : Stock insuffisant pour un produit sélectionné (ex: `"Stock insuffisant pour le produit..."`). Échec de la validation du modèle de données (Zod).

---

## 3. Statistiques globales de vente

**Endpoint :** `GET /api/sales/stats`

Renvoie les statistiques globales de vente pour le compte utilisateur connecté. Il est utilisé principalement pour alimenter les informations de haut niveau du Dashboard financier ou de vente.

### Structure de la Réponse (200 OK)
```json
{
  "totalRevenue": 250000,
  "totalSales": 15,
  "todayRevenue": 45000,
  "averageOrder": 16666.67
}
```

---

## 4. Détails d'une vente spécifique

**Endpoint :** `GET /api/sales/:id`

Permet de récupérer les détails (inclus les articles et les paiements) d'une vente spécifique. Parfait pour afficher une facture ou un reçu sur Front-End.

### Paramètres d'URL
| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id`      | number | Identifiant unique (ID) de la vente |

### Structure de la Réponse (200 OK)
```json
{
  "id": 12,
  "invoiceNumber": "INV-2026-0012",
  "createdAt": "2026-03-26T12:00:00.000Z",
  "status": "COMPLETED",
  "subtotal": 15000,
  "tax": 0,
  "total": 15000,
  "customer": {
    "id": 10,
    "name": "Jean Dupont",
    "phone": "+33600000000"
  },
  "items": [
    {
      "name": "Nom du produit Exemple",
      "quantity": 2,
      "price": 7500,
      "total": 15000
    }
  ],
  "payments": [
    {
      "method": "CASH",
      "amount": 15000
    }
  ]
}
```

**Note** : Renvoie **404 Not Found** si la vente n'existe pas ou n'appartient pas à l'utilisateur.

---

## 5. Supprimer une vente

**Endpoint :** `DELETE /api/sales/:id`

Permet d'annuler et de supprimer une transaction de vente existante.
*Effets induits de l'opération transactionnelle :*
- Les quantités des produits de cette vente retournent dans l'inventaire.
- Un mouvement d'inventaire entrant (`IN`) est enregistré pour compenser.
- Les montants dépensés par le client et son total de factures associées sont décrémentés.

### Paramètres d'URL
| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `id`      | number | Identifiant unique (ID) de la vente à supprimer |

### Structure de la Réponse (200 OK)
```json
{
  "success": true,
  "message": "Vente supprimée avec succès"
}
```

**Note** : Renvoie **404 Not Found** si la vente à invalider n'est pas trouvée.
