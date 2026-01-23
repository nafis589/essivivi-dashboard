"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  cartographyService,
  type DeliveryMarker,
  type AgentPosition,
  type ServiceZone,
  type OptimizedRoute,
  type HeatmapPoint,
} from "@/services/cartography.service";

interface MapComponentProps {
  selectedDate?: string;
  selectedZone?: string;
  selectedAgent?: string;
  showHeatmap?: boolean;
  showRoutes?: boolean;
}

// Fonction pour créer une icône personnalisée pour les marqueurs
function createMarkerIcon(type: "delivery" | "agent", status?: string) {
  const colors: Record<string, string> = {
    completed: "#10b981",
    in_delivery: "#f59e0b",
    pending: "#6b7280",
    cancelled: "#ef4444",
    active: "#3b82f6",
    idle: "#fbbf24",
    offline: "#9ca3af",
  };

  const color = status && status in colors ? colors[status] : "#6366f1";
  const html =
    type === "delivery"
      ? `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">📦</div>`
      : `<div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">🚚</div>`;

  return L.divIcon({
    html,
    iconSize: [type === "delivery" ? 32 : 36, type === "delivery" ? 32 : 36],
    popupAnchor: [0, -16],
  });
}

export function MapComponent({
  selectedDate,
  selectedZone,
  selectedAgent,
  showHeatmap = false,
  showRoutes = false,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(true);

  const markersRef = useRef<L.Marker[]>([]);
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const zoneLayersRef = useRef<L.Circle[]>([]);
  const heatmapLayerRef = useRef<(L.Layer & { setData?: (data: any) => void }) | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialiser la carte
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([48.8566, 2.3522], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }

    // Charger et afficher les données
    const loadMapData = async () => {
      try {
        setLoading(true);

        // Récupérer les données
        const [deliveryMarkers, agentPositions, zones, heatmapData, routes] = await Promise.all([
          cartographyService.getDeliveryMarkers({ date: selectedDate, zone: selectedZone, agent: selectedAgent }),
          cartographyService.getAgentPositions(selectedZone),
          cartographyService.getServiceZones(),
          showHeatmap ? cartographyService.getHeatmapData(selectedZone) : Promise.resolve([]),
          showRoutes ? cartographyService.getOptimizedRoutes(selectedAgent) : Promise.resolve([]),
        ]);

        // Nettoyer les anciens marqueurs et couches
        markersRef.current.forEach((m) => m.remove());
        routeLayersRef.current.forEach((r) => r.remove());
        zoneLayersRef.current.forEach((z) => z.remove());
        if (heatmapLayerRef.current) {
          map.current!.removeLayer(heatmapLayerRef.current);
        }

        markersRef.current = [];
        routeLayersRef.current = [];
        zoneLayersRef.current = [];

        // Afficher les zones de chalandise
        zones.forEach((zone) => {
          const circle = L.circle([zone.center[0], zone.center[1]], {
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: 0.1,
            weight: 2,
            radius: zone.radius,
          })
            .bindPopup(`<strong>${zone.name}</strong>`)
            .addTo(map.current!);
          zoneLayersRef.current.push(circle);
        });

        // Afficher les marqueurs de livraison
        deliveryMarkers.forEach((marker: DeliveryMarker) => {
          const leafletMarker = L.marker([marker.lat, marker.lng], {
            icon: createMarkerIcon("delivery", marker.status),
          })
            .bindPopup(
              `<div style="font-size: 12px;">
                <strong>${marker.name}</strong><br/>
                ${marker.address}<br/>
                <span style="background: ${
                  {
                    completed: "#10b981",
                    in_delivery: "#f59e0b",
                    pending: "#6b7280",
                    cancelled: "#ef4444",
                  }[marker.status]
                }; color: white; padding: 2px 6px; border-radius: 3px;">
                  ${marker.status === "in_delivery" ? "En cours" : marker.status === "completed" ? "Livré" : marker.status === "pending" ? "En attente" : "Annulé"}
                </span>
              </div>`
            )
            .addTo(map.current!);
          markersRef.current.push(leafletMarker);
        });

        // Afficher les positions des agents
        agentPositions.forEach((agent: AgentPosition) => {
          const leafletMarker = L.marker([agent.lat, agent.lng], {
            icon: createMarkerIcon("agent", agent.status),
          })
            .bindPopup(
              `<div style="font-size: 12px;">
                <strong>${agent.name}</strong><br/>
                ${agent.vehicle}<br/>
                Zone: ${agent.zone}<br/>
                Livraisons: ${agent.deliveries_today}<br/>
                <span style="background: ${
                  {
                    active: "#3b82f6",
                    idle: "#fbbf24",
                    offline: "#9ca3af",
                  }[agent.status]
                }; color: white; padding: 2px 6px; border-radius: 3px;">
                  ${agent.status === "active" ? "Actif" : agent.status === "idle" ? "Inactif" : "Hors ligne"}
                </span>
              </div>`
            )
            .addTo(map.current!);
          markersRef.current.push(leafletMarker);
        });

        // Afficher la heatmap si activée
        if (showHeatmap && heatmapData.length > 0) {
          const heatmapPoints: [number, number, number][] = heatmapData.map((p: HeatmapPoint) => [
            p.lat,
            p.lng,
            p.intensity,
          ]);
          // Utiliser la méthode heat de leaflet
          const heatLayer = (L as any).heatLayer(heatmapPoints, {
            max: 1,
            radius: 25,
            blur: 15,
            gradient: {
              0.0: "#0000ff",
              0.25: "#00ff00",
              0.5: "#ffff00",
              0.75: "#ff8800",
              1.0: "#ff0000",
            },
          }).addTo(map.current!);
          heatmapLayerRef.current = heatLayer;
        }

        // Afficher les itinéraires optimisés si activés
        if (showRoutes && routes.length > 0) {
          routes.forEach((route: OptimizedRoute) => {
            const polyline = L.polyline(
              route.waypoints.map((wp) => [wp[0], wp[1]]),
              {
                color: "#3b82f6",
                weight: 3,
                opacity: 0.7,
                dashArray: "5, 5",
              }
            )
              .bindPopup(
                `<div style="font-size: 12px;">
                  <strong>Itinéraire ${route.agent_name}</strong><br/>
                  Distance: ${route.distance} km<br/>
                  Durée: ${route.duration} min<br/>
                  Arrêts: ${route.stops.length}
                </div>`
              )
              .addTo(map.current!);
            routeLayersRef.current.push(polyline);
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données de la carte:", error);
        setLoading(false);
      }
    };

    loadMapData();

    return () => {
      // Cleanup sera géré au unmount
    };
  }, [selectedDate, selectedZone, selectedAgent, showHeatmap, showRoutes]);

  return (
    <Card className="@container/map">
      <CardHeader>
        <CardTitle>Carte Interactive - Suivi des Livraisons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-hidden rounded-lg border bg-muted">
          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <Spinner className="size-8" />
            </div>
          )}
          <div ref={mapContainer} style={{ height: "500px", width: "100%" }} className="rounded-md" />
        </div>

        {/* Légende */}
        <div className="mt-4 grid gap-2 rounded-lg border bg-muted/50 p-3 text-sm">
          <div className="font-semibold">Légende</div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500 text-xs">
                📦
              </div>
              <span>Livraison complétée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-amber-500 text-xs">
                📦
              </div>
              <span>Livraison en cours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-500 text-xs">
                📦
              </div>
              <span>Livraison en attente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-xs">
                🚚
              </div>
              <span>Agent actif</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-amber-400 text-xs">
                🚚
              </div>
              <span>Agent inactif</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
