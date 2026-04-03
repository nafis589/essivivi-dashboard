# 🔐 Architecture d'Authentification — FlowCommerce

## Vue d'ensemble

FlowCommerce utilise une architecture d'authentification **hybride** :

| Couche | Mécanisme | Stockage | Usage |
|--------|-----------|----------|-------|
| **Frontend → Backend API** | JWT Bearer Token | `localStorage("fc_token")` | Autoriser les appels API (produits, clients, etc.) |
| **Next.js Middleware** | Cookie `fc_authenticated` | `document.cookie` | Protéger les routes côté serveur (redirection SSR) |

---

## Flux d'authentification

```
┌──────────────┐       POST /auth/sign-in/email        ┌──────────────────┐
│   LoginForm  │  ─────────────────────────────────────►│  Backend Express │
│  (frontend)  │◄──────────────────────────────────────│  (localhost:3001) │
└──────┬───────┘   { user, token }                      └──────────────────┘
       │
       │  login(user, token)
       ▼
┌──────────────┐
│ AuthContext   │─── localStorage.setItem("fc_token", token)
│              │─── localStorage.setItem("fc_user", JSON.stringify(user))
│              │─── document.cookie = "fc_authenticated=true; path=/; ..."
└──────┬───────┘
       │
       │  router.push("/dashboard")
       ▼
┌──────────────────────────────────────┐
│  Next.js Middleware (middleware.ts)   │
│  Lit le cookie "fc_authenticated"    │
│  → Si absent : redirige vers /sign-in│
│  → Si présent : laisse passer        │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Page Dashboard / Produits / etc.    │
│  apiClient.get("/products")          │
│  → Lit "fc_token" dans localStorage  │
│  → Envoie Header: Authorization:     │
│    Bearer <jwt_token>                │
│  → credentials: 'include' (cookies)  │
└──────────────────────────────────────┘
```

---

## Fichiers clés

| Fichier | Rôle |
|---------|------|
| `context/auth-context.tsx` | Provider React — gère le state user/token, login/logout |
| `lib/api/client.ts` | Client HTTP principal (produits, clients, ventes) |
| `lib/api-client.ts` | Client HTTP pour l'auth (sign-in, sign-up) |
| `lib/api/endpoints.ts` | Dictionnaire des URLs API |
| `middleware.ts` | Protection des routes Next.js (SSR) |
| `components/auth/login-form.tsx` | Formulaire de connexion |

---

## Règles d'architecture des appels API

### 1. Toujours envoyer le token JWT

```typescript
// ✅ Correct — lit "fc_token" (le vrai JWT)
const token = localStorage.getItem("fc_token");
headers: { Authorization: `Bearer ${token}` }

// ❌ Incorrect — "fc_authenticated" est un booléen, pas un JWT
const token = localStorage.getItem("fc_authenticated"); // "true"
headers: { Authorization: `Bearer true` } // → 401 garanti
```

### 2. Toujours inclure `credentials: 'include'`

Pour que les cookies traversent les requêtes cross-origin (frontend `localhost:3000` → backend `localhost:3001`) :

```typescript
fetch(url, {
  credentials: "include", // ⚠️ Obligatoire pour les cookies cross-origin
  headers: { Authorization: `Bearer ${token}` },
});
```

### 3. Le cookie `fc_authenticated` est UNIQUEMENT pour le middleware Next.js

| Cookie | Utilisé par | Contient |
|--------|------------|----------|
| `fc_authenticated` | `middleware.ts` (SSR) | `"true"` (flag booléen) |
| N'est PAS un token | N'est PAS pour l'API backend | Pas de data sensible |

### 4. Un seul client API pour les appels métier

Utilisez `apiClient` de `lib/api/client.ts` pour toutes les opérations CRUD :

```typescript
import { apiClient } from '@/lib/api/client';

// Le token JWT est automatiquement lu depuis localStorage
const products = await apiClient.get('/products');
await apiClient.post('/products', newProduct);
await apiClient.put(`/products/${id}`, updatedProduct);
await apiClient.delete(`/products/${id}`);
```

### 5. Backend : CORS doit autoriser les credentials

Le backend Express doit avoir :

```typescript
app.use(cors({
  origin: "http://localhost:3000", // PAS "*" si credentials: true
  credentials: true,
}));
```

---

## Diagnostic : Erreur 401 sur GET /api/products

### Cause racine identifiée

Le fichier `lib/api/client.ts` lisait `localStorage.getItem('fc_authenticated')` au lieu de `localStorage.getItem('fc_token')`.

- `fc_authenticated` contient la chaîne `"true"` (un flag pour le middleware)
- Le header envoyé était : `Authorization: Bearer true`
- Le backend rejetait ce token invalide → **401 Unauthorized**

### Correction appliquée

1. **`lib/api/client.ts`** → `getAuthHeaders()` lit maintenant `"fc_token"`
2. **`lib/api-client.ts`** → Ajout de `credentials: "include"` + lecture auto du token
3. **`credentials: 'include'`** placé APRÈS le spread pour ne pas être écrasé

---

## Checklist de vérification

- [x] `fc_token` est stocké dans localStorage après le login
- [x] `apiClient` lit `fc_token` pour le header Authorization
- [x] `credentials: 'include'` est envoyé sur chaque requête
- [x] Le cookie `fc_authenticated` n'est utilisé que par le middleware Next.js
- [ ] Le backend a CORS configuré avec `credentials: true`
- [ ] Le backend valide le JWT et non le cookie
