1. Onglet Tableau de Bord (Dashboard)
Pour alimenter les 4 cartes et le graphique restant, le backend doit exposer un endpoint (ex: GET /dashboard/overview/) retournant le JSON suivant :

json
{
  "summary": {
    "active_agents": {
      "current": 24,              // Nombre actuel (Carte 1)
      "total": 28,                // Sur un total de...
      "variation": 2,             // +2 vs période précédente
      "trend": "up"               // ou "down"
    },
    "daily_deliveries": {
      "count": 142,               // (Carte 2)
      "variation_percentage": 12  // +12%
    },
    "delivered_volume": {
      "value": 3500,              // (Carte 3)
      "variation_percentage": 5
    },
    "daily_revenue": {
      "amount": 1250500,          // (Carte 4)
      "variation_percentage": 8
    }
  },
  "chart_data": [                 // Pour le graphique "ChartAreaInteractive"
    { "date": "2024-05-01", "revenue": 1650000 },
    { "date": "2024-05-02", "revenue": 1790000 },
    // ... une entrée par jour sur 90 jours
    { "date": "2024-06-30", "revenue": 2150000 }
  ]
}

2. Onglet Commandes (Assignation d'Agent)
Actuellement, le bouton "Ajouter" (Enregistrer) ne fonctionne pas car il n'est relié à aucune action. Pour que l'assignation fonctionne :

A. Ce que le backend doit implémenter : Un endpoint pour modifier l'agent d'une commande spécifique.

Méthode : PATCH (ou PUT)
URL : /orders/{id}/assign-agent/
Corps de la requête (Body JSON) :
json
{
  "agent_id": "uuid-de-l-agent"
}
Réponse attendue : L'objet commande mis à jour ou un message de succès.
B. Endpoint pour la liste des agents (Optionnel) : Pour remplir le menu déroulant <Select> qui contient actuellement des valeurs en dur ("Koffi Mensah", etc.), vous aurez besoin d'un endpoint :

GET /agents/active/ (Retourne : [{ "id": "...", "name": "..." }])