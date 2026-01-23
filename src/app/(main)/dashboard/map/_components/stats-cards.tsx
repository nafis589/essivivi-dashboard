"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Package, Truck, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cartographyService, type DeliveryMarker, type AgentPosition } from "@/services/cartography.service";

interface MapStatsCardsProps {
  selectedDate?: string;
  selectedZone?: string;
  selectedAgent?: string;
}

export function MapStatsCards({ selectedDate, selectedZone, selectedAgent }: MapStatsCardsProps) {
  const [deliveryMarkers, setDeliveryMarkers] = useState<DeliveryMarker[]>([]);
  const [agentPositions, setAgentPositions] = useState<AgentPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [markers, agents] = await Promise.all([
          cartographyService.getDeliveryMarkers({
            date: selectedDate,
            zone: selectedZone,
            agent: selectedAgent,
          }),
          cartographyService.getAgentPositions(selectedZone),
        ]);
        setDeliveryMarkers(markers);
        setAgentPositions(agents);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [selectedDate, selectedZone, selectedAgent]);

  const totalDeliveries = deliveryMarkers.length;
  const completedDeliveries = deliveryMarkers.filter((m) => m.status === "completed").length;
  const inDeliveryCount = deliveryMarkers.filter((m) => m.status === "in_delivery").length;
  const pendingDeliveries = deliveryMarkers.filter((m) => m.status === "pending").length;
  const activeAgents = agentPositions.filter((a) => a.status === "active").length;
  const completionRate = totalDeliveries > 0 ? Math.round((completedDeliveries / totalDeliveries) * 100) : 0;

  return (
    <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      {/* Total Livraisons */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1">
            <Package className="size-4" />
            Livraisons totales
          </CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {totalDeliveries}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              {inDeliveryCount}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            En cours de livraison <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">{inDeliveryCount} sur {totalDeliveries}</div>
        </CardFooter>
      </Card>

      {/* Taux de Complément */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1">
            ✅ Taux de complément
          </CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {completionRate}%
          </CardTitle>
          <CardAction>
            <Badge variant={completionRate >= 80 ? "default" : "outline"}>
              {completionRate >= 80 ? <TrendingUp /> : <TrendingDown />}
              {completionRate >= 80 ? "+2%" : "-1%"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {completedDeliveries} livraisons complétées
            {completionRate >= 80 ? (
              <TrendingUp className="size-4 text-green-500" />
            ) : (
              <TrendingDown className="size-4 text-orange-500" />
            )}
          </div>
          <div className="text-muted-foreground">Performance journalière</div>
        </CardFooter>
      </Card>

      {/* Agents Actifs */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1">
            <Truck className="size-4" />
            Agents actifs
          </CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {activeAgents}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              {agentPositions.length}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Équipe mobilisée <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Sur {agentPositions.length} agents disponibles</div>
        </CardFooter>
      </Card>

      {/* En Attente */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="size-4" />
            Livraisons en attente
          </CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {pendingDeliveries}
          </CardTitle>
          <CardAction>
            <Badge variant={pendingDeliveries > 5 ? "destructive" : "outline"}>
              {pendingDeliveries > 5 ? <TrendingUp /> : "✓"}
              {pendingDeliveries > 5 ? `+${pendingDeliveries}` : "Normal"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            À programmer <MapPin className="size-4" />
          </div>
          <div className="text-muted-foreground">Assignement nécessaire</div>
        </CardFooter>
      </Card>
    </div>
  );
}
