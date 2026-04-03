Documentation de l'API Produits (FlowCommerce)
Ce document détaille les points d'entrée (endpoints) disponibles pour la gestion du catalogue produit.

🔒 Authentification & Headers
Toutes les requêtes vers l'API produits nécessitent une session active (via Better Auth).

Header	Valeur	Description
Content-Type	application/json	Format de données requis pour les requêtes POST/PUT/PATCH.
Authorization	Bearer <token>	Requis si l'authentification par token est configurée.
Cookie	better-auth.session-token=...	Requis pour l'authentification par session (navigateur).
📦 Endpoints Principaux
1. Liste des produits
GET /api/products

Récupère la liste des produits avec support pour la recherche, la pagination et le filtrage.

Paramètres Query (Optionnels) :

page (number, défaut 1) : Page actuelle.
limit (number, défaut 20, max 100) : Nombre d'éléments par page.
search (string) : Recherche par nom ou SKU.
filter (enum, défaut all) : active, inactive, low-stock, out-of-stock, deleted.
sortBy (enum, défaut createdAt) : name, price, stock, createdAt, updatedAt.
sortOrder (enum, défaut desc) : asc, desc.
2. Créer un produit
POST /api/products

Corps de la requête (JSON) :

json
{
  "name": "Nom du produit",
  "price": 1000,
  "description": "Description optionnelle", // (optional)
  "costPrice": 500, // (optional)
  "stock": 10, // (optional, default: 0)
  "stockAlert": 5, // (optional, default: 5)
  "barcode": "123456789", // (optional)
  "sku": "PROD-001", // (optional)
  "active": true, // (optional, default: true)
  "metadata": { // (optional)
    "brand": "Marque X",
    "color": "Rouge",
    "material": "Coton"
  },
  "images": [ // (optional, default: [])
    { "url": "https://example.com/image.jpg" }
  ]
}
3. Détail d'un produit
GET /api/products/:id

Récupère les informations complètes d'un produit spécifique.

4. Modifier un produit
PUT /api/products/:id

Corps de la requête (JSON) : (Tous les champs sont optionnels)

name, description, price, costPrice, stock, stockAlert, barcode, sku, active, metadata, images.
5. Supprimer un produit
DELETE /api/products/:id

Effectue une suppression logique (Soft Delete). Le produit pourra être restauré plus tard.

6. Restaurer un produit
PATCH /api/products/:id/restore

Restaure un produit précédemment supprimé.

📈 Statistiques & Stocks
7. Statistiques globales
GET /api/products/stats

Retourne un résumé : total produits, valeur du stock, produits actifs, alertes de stock.

8. Alertes de stock
GET /api/products/low-stock : Liste les produits dont le stock est inférieur au seuil d'alerte.
GET /api/products/out-of-stock : Liste les produits en rupture de stock.
9. Ajustement de stock
PATCH /api/products/:id/stock

Permet d'augmenter ou de diminuer manuellement le stock.

Corps de la requête (JSON) :

json
{
  "quantity": 5, // Positif pour ajout, négatif pour retrait
  "type": "purchase", // "purchase", "adjustment", "return"
  "reason": "Réapprovisionnement fournisseur" // (optional)
}
⚠️ Codes d'erreurs communs
Code HTTP	Message	Description
400	Erreur de validation	Les données envoyées ne respectent pas le schéma Zod.
401	Non authentifié	Session manquante ou expirée.
404	Enregistrement non trouvé	Le produit avec l'ID spécifié n'existe pas.
409	Conflit de données	Problème d'unicité (ex: SKU ou code-barres déjà utilisé).