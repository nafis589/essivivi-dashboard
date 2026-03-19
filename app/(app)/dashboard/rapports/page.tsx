'use client'

import { BarChart3, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock report data
const revenueData = [
  { month: 'Sept', revenue: 8500, previous: 7200 },
  { month: 'Oct', revenue: 9200, previous: 8100 },
  { month: 'Nov', revenue: 10800, previous: 9500 },
  { month: 'Déc', revenue: 12500, previous: 11000 },
  { month: 'Jan', revenue: 12450, previous: 10200 },
]

const topProducts = [
  { name: 'Baguette tradition', quantity: 245, revenue: 269.50 },
  { name: 'Croissant au beurre', quantity: 189, revenue: 245.70 },
  { name: 'Pain au chocolat', quantity: 156, revenue: 218.40 },
  { name: 'Pain de campagne', quantity: 89, revenue: 284.80 },
  { name: 'Éclair au chocolat', quantity: 67, revenue: 234.50 },
]

export default function RapportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rapports</h2>
          <p className="text-zinc-500">
            Analysez les performances de votre commerce.
          </p>
        </div>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Période
        </Button>
      </div>

      {/* Revenue chart placeholder */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution du chiffre d&apos;affaires</CardTitle>
            <CardDescription>Comparaison avec l&apos;année précédente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between gap-4 px-4">
              {revenueData.map((data) => {
                const maxRevenue = Math.max(...revenueData.map(d => Math.max(d.revenue, d.previous)))
                const currentHeight = (data.revenue / maxRevenue) * 250
                const previousHeight = (data.previous / maxRevenue) * 250
                
                return (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex items-end gap-1 h-[260px]">
                      <div
                        className="w-6 bg-blue-500 rounded-t-md transition-all"
                        style={{ height: currentHeight }}
                        title={`${data.revenue} € (actuel)`}
                      />
                      <div
                        className="w-6 bg-zinc-200 rounded-t-md transition-all"
                        style={{ height: previousHeight }}
                        title={`${data.previous} € (précédent)`}
                      />
                    </div>
                    <span className="text-sm text-zinc-500">{data.month}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className="text-zinc-500">Cette année</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-zinc-200 rounded" />
                <span className="text-zinc-500">Année précédente</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                CA ce mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,450 €</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +22.1% vs année précédente
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Commandes ce mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">523</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8.5% vs mois dernier
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Panier moyen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23.80 €</div>
              <div className="flex items-center text-sm text-red-600 mt-1">
                <TrendingDown className="h-4 w-4 mr-1" />
                -2.3% vs mois dernier
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top products */}
      <Card>
        <CardHeader>
          <CardTitle>Produits les plus vendus</CardTitle>
          <CardDescription>Classement par quantité vendue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-zinc-500">{product.quantity} vendus</p>
                </div>
                <p className="font-semibold">{product.revenue.toFixed(2)} €</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
